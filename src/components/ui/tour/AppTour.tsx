import React, { useState, useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tour.css'; // Import our custom tour styles

// Define a type for our tour steps
interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  };
}

// Create a predefined tour
const tourSteps: TourStep[] = [
  {
    element: '#statementList',
    popover: {
      title: 'Welcome to Beacons!',
      description: 'This is where all your statements will appear.',
      side: 'right',
      align: 'start'
    },
  },
  {
    element: '.category-section',
    popover: {
      title: 'Categories',
      description:
        'Statements are organized by categories to help you navigate them easily.',
      side: 'right',
      align: 'start'
    },
  },
  {
    element: '.question-card',
    popover: {
      title: 'Questions',
      description:
        'These are questions that will help you create meaningful statements.',
      side: 'right',
      align: 'start'
    },
  },
  {
    element: '.add-custom-button',
    popover: {
      title: 'Add Custom Statements',
      description:
        'You can also create your own custom statements from scratch!',
      side: 'left',
      align: 'start'
    },
  },
];

// Create a custom hook to manage the tour
export const useTour = () => {
  const [driverObj, setDriverObj] = useState<any>(null);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour before
    const tourSeen = localStorage.getItem('tour_completed');
    if (tourSeen) {
      setHasSeenTour(true);
    }

    // Initialize driver
    const driverInstance = driver({
      showProgress: true,
      steps: tourSteps,
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      doneBtnText: 'Done',
      stagePadding: 10,       // Add stage padding around highlighted element
      popoverOffset: 15,      // Distance between popover and element
      smoothScroll: true,     // Use built-in smooth scrolling
      
      onDestroyed: () => {
        // Mark tour as completed when finished
        localStorage.setItem('tour_completed', 'true');
        setHasSeenTour(true);
      }
    });

    setDriverObj(driverInstance);

    return () => {
      // Cleanup when component unmounts
      if (driverInstance) {
        driverInstance.destroy();
      }
    };
  }, []);

  // Start the tour
  const startTour = () => {
    if (driverObj) {
      driverObj.drive();
    }
  };

  return { startTour, hasSeenTour };
};

// Tour button component
export const TourButton: React.FC = () => {
  const { startTour } = useTour();

  return (
    <button
      onClick={startTour}
      className='ml-4 text-white hover:bg-pink-600 transition-colors border-2 border-white rounded-full px-3 py-1'
      aria-label='Start Tour'
    >
      Tour
    </button>
  );
};
