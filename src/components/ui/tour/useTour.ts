import { useState, useEffect, useRef } from 'react';
import introJs from 'intro.js';
// Import the intro.js styles
import 'intro.js/introjs.css';
// Import our custom CSS
import './tour.css';

// Define types for intro.js
type IntroJs = ReturnType<typeof introJs>;

/**
 * Extended IntroJs type with access to private properties
 * Using type intersection instead of interface extension to avoid compatibility issues
 */
type IntroJsExt = IntroJs & {
  _currentStep?: number;
  _options?: {
    steps: IntroStep[];
    nextLabel?: string;
    prevLabel?: string;
    skipLabel?: string;
    doneLabel?: string;
    hidePrev?: boolean;
    hideNext?: boolean;
    tooltipPosition?: string;
    tooltipClass?: string;
    highlightClass?: string;
    [key: string]: unknown;
  };
};

// We can omit the separate IntroJsOptions interface since we're
// directly using the intro.js library's API

/**
 * Standard intro.js step
 */
interface IntroStep {
  element: string | HTMLElement;
  intro: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  tooltipClass?: string;
  highlightClass?: string;
  disableInteraction?: boolean;
}

/**
 * Return type for our useTour hook
 */
export interface TourHookResult {
  startTour: () => void;
  hasSeenTour: boolean;
}

/**
 * Our custom step options extending IntroStep
 */
interface CustomStepOptions {
  // Basic intro.js step properties
  element?: string | HTMLElement;
  intro: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  tooltipClass?: string;
  highlightClass?: string;
  disableInteraction?: boolean;

  // Our custom properties
  isInteractive?: boolean;
  waitForElementChange?: {
    selector: string;
    observeSubtree?: boolean;
  };
  onBeforeChange?: (targetElement: HTMLElement) => boolean | void;
  onAfterChange?: (targetElement: HTMLElement) => void;
}

// Create the predefined tour steps with intro.js format
// Will be populated in the hook
let _introInstance: IntroJs | null = null;

export const tourSteps: CustomStepOptions[] = [
  {
    // Step 01 - Explain the wizard that's already open
    intro:
      '<h3>Statement Wizard</h3><p>Welcome to Beacons! You\'re looking at the Statement Wizard, which helps you create statements to share with your employer.</p>',
    position: 'bottom',
  },
  {
    // Step 02 - Subject selection
    element: '.subject-tiles',
    intro:
      '<h3>Step 1: Choose a Subject</h3><p>Start by selecting the subject of your statement. This is often "I" or another perspective like "My team" or "The company".</p>',
    position: 'right',
  },
  {
    // Step 03 - Verb selection
    element: '.verb-grid',
    intro:
      '<h3>Step 2: Choose a Verb</h3><p>Next, select a verb that expresses your feeling or action. The sentiment filters at the top help you find positive, neutral, or negative verbs.</p>',
    position: 'bottom',
  },
  {
    // Step 04 - Complete Statement
    intro:
      '<h3>Step 3: Complete Your Statement</h3><p>Then you\'ll type what you\'re feeling or experiencing to complete your statement.</p>',
    position: 'bottom',
  },
  {
    // Step 05 - Choose Category
    intro:
      '<h3>Step 4: Choose a Category</h3><p>Select a category to help organize your feedback by topic.</p>',
    position: 'bottom',
  },
  {
    // Step 06 - Privacy Settings
    intro:
      '<h3>Final Step: Privacy Settings</h3><p>Finally, choose whether to share this statement with your employer. Public statements will be included when you send insights to your manager.</p>',
    position: 'bottom',
  }
];

// Create a custom hook to manage the tour
export function useTour(): TourHookResult {
  const [introInstance, setIntroInstance] = useState<IntroJs | null>(null);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const observersRef = useRef<MutationObserver[]>([]);
  const currentStepRef = useRef<number>(0);

  // Helper to clean up observers
  const cleanupObservers = () => {
    observersRef.current.forEach((observer) => observer.disconnect());
    observersRef.current = [];
  };

  // Listen for custom advance event
  useEffect(() => {
    const handleAdvance = () => {
      if (introInstance) {
        introInstance.nextStep();
      }
    };
    
    // Force tooltips to be visible at high z-index every 100ms
    const forceTooltipVisibility = () => {
      const tooltips = document.querySelectorAll('.introjs-tooltipReferenceLayer, .introjs-tooltip, .introjs-helperLayer');
      if (tooltips.length > 0) {
        tooltips.forEach(el => {
          const element = el as HTMLElement;
          element.style.zIndex = '999999999';
        });
      }
    };
    
    const intervalId = setInterval(forceTooltipVisibility, 100);
    window.addEventListener('INTRO_ADVANCE', handleAdvance);
    
    return () => {
      window.removeEventListener('INTRO_ADVANCE', handleAdvance);
      clearInterval(intervalId);
    };
  }, [introInstance]);

  useEffect(() => {
    // Check if user has seen the tour before
    const tourSeen = localStorage.getItem('tour_completed');
    if (tourSeen) {
      setHasSeenTour(true);
    }

    // Initialize intro.js instance
    const intro = introJs();

    // Function to convert our custom steps to standard IntroStep
    const convertToIntroStep = (step: CustomStepOptions): IntroStep => {
      // Pick only the properties that IntroStep expects
      const {
        element,
        intro,
        position,
        disableInteraction,
        tooltipClass,
        highlightClass,
      } = step;

      return {
        element: element || 'body', // Ensure element is always defined
        intro,
        position,
        disableInteraction,
        tooltipClass,
        highlightClass,
      };
    };

    // Prepare steps for intro.js - making sure they match the format it expects
    const preparedSteps = tourSteps.map(convertToIntroStep);

    // Configure intro.js with clean steps
    intro.setOptions({
      steps: preparedSteps, // Already typed as IntroStep[]
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      exitOnEsc: false,
      showStepNumbers: false,
      disableInteraction: true, // Default is to disable interaction
      scrollToElement: true,
      tooltipClass: 'tour-tooltip',
      highlightClass: 'tour-highlight',
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Done',
    });

    // Handle before-change event
    intro.onbeforechange(function (targetElement: HTMLElement) {
      if (!targetElement) return true; // Return true to continue to the next step

      const currentIndex = (intro as IntroJsExt)._currentStep || 0;
      currentStepRef.current = currentIndex;
      const step = tourSteps[currentIndex] as CustomStepOptions;
      
      console.log('Step change', currentIndex, targetElement);
      
      // Force z-index to be high on intro.js elements - apply this for ALL steps
      setTimeout(() => {
        // Force tooltip visibility with extremely high z-indices
        document.querySelectorAll('.introjs-tooltipReferenceLayer, .introjs-tooltip, .introjs-helperLayer, .introjs-overlay')
          .forEach(el => {
            const element = el as HTMLElement;
            if (element.classList.contains('introjs-tooltip')) {
              element.style.zIndex = '999999999';
            } else if (element.classList.contains('introjs-helperLayer')) {
              element.style.zIndex = '999999998';
            } else if (element.classList.contains('introjs-overlay')) {
              element.style.zIndex = '999999990';
            } else {
              element.style.zIndex = '999999999';
            }
          });
          
        // Fix any ReactModals
        const reactModals = document.querySelectorAll('.ReactModal__Overlay, .ReactModal__Content');
        reactModals.forEach(modal => {
          modal.classList.add('intro-highlighted-modal');
        });
      }, 10);
      
      // Clean up any existing observers
      cleanupObservers();

      // Call custom beforeChange handler if defined
      if (step.onBeforeChange) {
        const result = step.onBeforeChange(targetElement);
        if (result === false) {
          // If step has waitForElementChange, set up observer
          if (step.waitForElementChange) {
            const { selector, observeSubtree = true } =
              step.waitForElementChange;

            const observer = new MutationObserver(() => {
              const elementExists = document.querySelector(selector);
              if (elementExists) {
                document.body.classList.remove('tour-interactive-step');
                targetElement.classList.remove('interactive-tour-element');
                observer.disconnect();
                setTimeout(
                  () => window.dispatchEvent(new CustomEvent('INTRO_ADVANCE')),
                  500
                );
              }
            });

            observer.observe(document.body, {
              childList: true,
              subtree: observeSubtree,
            });

            observersRef.current.push(observer);
          }

          // For steps that require interaction, hide the next button
          if (step.isInteractive) {
            // Delay this slightly to ensure the button is rendered
            setTimeout(() => {
              const nextButton = document.querySelector('.introjs-nextbutton');
              if (nextButton) {
                (nextButton as HTMLElement).style.display = 'none';
              }
            }, 50);
          }

          return false; // Prevent auto-advancing to the next step
        }
      }

      return true; // Continue to the next step
    });

    // Handle change event (after a step is shown)
    intro.onafterchange(function (targetElement: HTMLElement) {
      if (!targetElement) return;

      const currentIndex = (intro as IntroJsExt)._currentStep || 0;
      const step = tourSteps[currentIndex] as CustomStepOptions;

      // Call custom afterChange handler if defined
      if (step.onAfterChange) {
        step.onAfterChange(targetElement);
      }
    });

    // Handle complete event
    intro.oncomplete(() => {
      // Mark tour as completed
      localStorage.setItem('tour_completed', 'true');
      setHasSeenTour(true);
      cleanupObservers();

      // Remove any leftover classes
      document.body.classList.remove('tour-interactive-step');
      const interactiveElements = document.querySelectorAll(
        '.interactive-tour-element'
      );
      interactiveElements.forEach((el) =>
        el.classList.remove('interactive-tour-element')
      );

      const modalElements = document.querySelectorAll(
        '.intro-highlighted-modal'
      );
      modalElements.forEach((el) =>
        el.classList.remove('intro-highlighted-modal')
      );
    });

    // Handle exit event
    intro.onexit(() => {
      // Clean up when tour is exited
      cleanupObservers();

      // Remove any leftover classes
      document.body.classList.remove('tour-interactive-step');
      const interactiveElements = document.querySelectorAll(
        '.interactive-tour-element'
      );
      interactiveElements.forEach((el) =>
        el.classList.remove('interactive-tour-element')
      );

      const modalElements = document.querySelectorAll(
        '.intro-highlighted-modal'
      );
      modalElements.forEach((el) =>
        el.classList.remove('intro-highlighted-modal')
      );
    });

    setIntroInstance(intro);
    // Store for access from steps
    _introInstance = intro;

    return () => {
      // Cleanup when component unmounts
      cleanupObservers();
      intro.exit(true); // Force exit
    };
  }, []);

  // Start the tour
  const startTour = () => {
    if (introInstance) {
      // Start at the top of the page
      window.scrollTo({ top: 0, behavior: 'auto' });
      
      // Pre-fix any tooltips that might already be present
      document.querySelectorAll('.ReactModal__Overlay, .ReactModal__Content').forEach(el => {
        (el as HTMLElement).style.zIndex = '999999980';
      });
      
      // Pre-open the wizard to demonstrate (without waiting for tour steps)
      const tryOpenWizard = () => {
        console.log('Pre-tour attempt to open wizard');
        
        // Find the clickable part of the question card - the outer div with cursor-pointer
        const clickableCard = document.querySelector('.question-card .cursor-pointer');
        
        // Fallback to any question card if the specific selector doesn't work
        const anyQuestionCard = document.querySelector('.question-card');
        
        // Try the most specific target first
        if (clickableCard) {
          console.log('Found clickable question card div, clicking it');
          
          // Create and dispatch mouse events for more reliable triggering
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          clickableCard.dispatchEvent(clickEvent);
          
          // Also try direct click as fallback
          try {
            (clickableCard as HTMLElement).click();
          } catch (e) {
            console.error('Error with direct click on clickable div', e);
          }
          
          // Wait for wizard to open, then start tour
          setTimeout(() => {
            // Check if wizard opened
            const wizardModal = document.querySelector('.ReactModal__Content');
            if (wizardModal) {
              console.log('Wizard opened successfully, starting tour');
            } else {
              console.log('Wizard did not open yet, trying anyway');
            }
            
            // Now start the tour
            introInstance.start();
            
            // Force tooltips to be visible immediately
            setTimeout(() => {
              document.querySelectorAll('.introjs-tooltipReferenceLayer, .introjs-tooltip, .introjs-helperLayer, .introjs-overlay')
                .forEach(el => {
                  const element = el as HTMLElement;
                  element.style.zIndex = '999999999';
                });
            }, 100);
          }, 800); // Longer delay to ensure wizard opens
          
        } else if (anyQuestionCard) {
          // Fallback to the whole question card
          console.log('Fallback: clicking whole question card');
          
          // Try to find the actual clickable element within the card
          const allDivsInCard = anyQuestionCard.querySelectorAll('div');
          let clicked = false;
          
          // Try clicking each div in the card until we find one that works
          allDivsInCard.forEach(div => {
            if (!clicked) {
              try {
                const clickEvent = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window
                });
                div.dispatchEvent(clickEvent);
                (div as HTMLElement).click();
                console.log('Tried clicking div in card', div);
                clicked = true;
              } catch (e) {
                // Continue to next div
              }
            }
          });
          
          // If we couldn't find a specific element, try the whole card
          if (!clicked) {
            try {
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              anyQuestionCard.dispatchEvent(clickEvent);
              (anyQuestionCard as HTMLElement).click();
            } catch (e) {
              console.error('Error clicking question card', e);
            }
          }
          
          // Wait for wizard to open, then start tour
          setTimeout(() => {
            introInstance.start();
            
            setTimeout(() => {
              document.querySelectorAll('.introjs-tooltipReferenceLayer, .introjs-tooltip, .introjs-helperLayer, .introjs-overlay')
                .forEach(el => {
                  const element = el as HTMLElement;
                  element.style.zIndex = '999999999';
                });
            }, 100);
          }, 800);
          
        } else {
          console.log('Could not find any question card, starting tour anyway');
          introInstance.start();
          
          setTimeout(() => {
            document.querySelectorAll('.introjs-tooltipReferenceLayer, .introjs-tooltip, .introjs-helperLayer, .introjs-overlay')
              .forEach(el => {
                const element = el as HTMLElement;
                element.style.zIndex = '999999999';
              });
          }, 100);
        }
      };
      
      // Try to open the wizard first, then start tour
      setTimeout(tryOpenWizard, 100);
    }
  };

  return { startTour, hasSeenTour };
}
