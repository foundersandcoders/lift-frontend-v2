Installation
Run one of the following commands to install the package:

# Using npm

npm install driver.js

# Using pnpm

pnpm install driver.js

# Using yarn

yarn add driver.js
Alternatively, you can use CDN and include the script in your HTML file:

<script src="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.js.iife.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.css"/>
Start Using
Once installed, you can import the package in your project. The following example shows how to highlight an element:

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver();
driverObj.highlight({
element: "#some-element",
popover: {
title: "Title",
description: "Description"
}
});
Note on CDN
If you are using the CDN, you will have to use the package from the window object:

const driver = window.driver.js.driver;

const driverObj = driver();

driverObj.highlight({
element: "#some-element",
popover: {
title: "Title",
description: "Description"
}
});
Continue reading the Getting Started guide to learn more about the package.

Basic Usage
Once installed, you can import and start using the library. There are several different configuration options available to customize the library. You can find more details about the options in the configuration section. Given below are the basic steps to get started.

Here is a simple example of how to create a tour with multiple steps.

Basic Tour Example

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
showProgress: true,
steps: [
{ element: '.page-header', popover: { title: 'Title', description: 'Description' } },
{ element: '.top-nav', popover: { title: 'Title', description: 'Description' } },
{ element: '.sidebar', popover: { title: 'Title', description: 'Description' } },
{ element: '.footer', popover: { title: 'Title', description: 'Description' } },
]
});

driverObj.drive();
Show me an Example
You can pass a single step configuration to the highlight method to highlight a single element. Given below is a simple example of how to highlight a single element.

Highlighting a simple Element

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver();
driverObj.highlight({
element: '#some-element',
popover: {
title: 'Title for the Popover',
description: 'Description for it',
},
});
Show me an Example
The same configuration passed to the highlight method can be used to create a tour. Given below is a simple example of how to create a tour with a single step.

Examples above show the basic usage of the library. Find more details about the configuration options in the configuration section and the examples in the examples section.

Configuration
Driver.js is built to be highly configurable. You can configure the driver globally, or per step. You can also configure the driver on the fly, while it’s running.

Driver.js is written in TypeScript. Configuration options are mostly self-explanatory. Also, if you’re using an IDE like WebStorm or VSCode, you’ll get autocomplete and documentation for all the configuration options.

Driver Configuration
You can configure the driver globally by passing the configuration object to the driver call or by using the setConfig method. Given below are some of the available configuration options.

type Config = {
// Array of steps to highlight. You should pass
// this when you want to setup a product tour.
steps?: DriveStep[];

// Whether to animate the product tour. (default: true)
animate?: boolean;
// Overlay color. (default: black)
// This is useful when you have a dark background
// and want to highlight elements with a light
// background color.
overlayColor?: string;
// Whether to smooth scroll to the highlighted element. (default: false)
smoothScroll?: boolean;
// Whether to allow closing the popover by clicking on the backdrop. (default: true)
allowClose?: boolean;
// Opacity of the backdrop. (default: 0.5)
overlayOpacity?: number;
// Distance between the highlighted element and the cutout. (default: 10)
stagePadding?: number;
// Radius of the cutout around the highlighted element. (default: 5)
stageRadius?: number;

// Whether to allow keyboard navigation. (default: true)
allowKeyboardControl?: boolean;

// Whether to disable interaction with the highlighted element. (default: false)
// Can be configured at the step level as well
disableActiveInteraction?: boolean;

// If you want to add custom class to the popover
popoverClass?: string;
// Distance between the popover and the highlighted element. (default: 10)
popoverOffset?: number;
// Array of buttons to show in the popover. Defaults to ["next", "previous", "close"]
// for product tours and [] for single element highlighting.
showButtons?: AllowedButtons[];
// Array of buttons to disable. This is useful when you want to show some of the
// buttons, but disable some of them.
disableButtons?: AllowedButtons[];

// Whether to show the progress text in popover. (default: false)
showProgress?: boolean;
// Template for the progress text. You can use the following placeholders in the template:
// - {{current}}: The current step number
// - {{total}}: Total number of steps
progressText?: string;

// Text to show in the buttons. `doneBtnText`
// is used on the last step of a tour.
nextBtnText?: string;
prevBtnText?: string;
doneBtnText?: string;

// Called after the popover is rendered.
// PopoverDOM is an object with references to
// the popover DOM elements such as buttons
// title, descriptions, body, container etc.
onPopoverRender?: (popover: PopoverDOM, options: { config: Config; state: State, driver: Driver }) => void;

// Hooks to run before and after highlighting
// each step. Each hook receives the following
// parameters:
// - element: The target DOM element of the step
// - step: The step object configured for the step
// - options.config: The current configuration options
// - options.state: The current state of the driver
// - options.driver: Current driver object
onHighlightStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
onHighlighted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
onDeselected?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;

// Hooks to run before and after the driver
// is destroyed. Each hook receives
// the following parameters:
// - element: Currently active element
// - step: The step object configured for the currently active
// - options.config: The current configuration options
// - options.state: The current state of the driver
// - options.driver: Current driver object
onDestroyStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
onDestroyed?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;

// Hooks to run on button clicks. Each hook receives
// the following parameters:
// - element: The current DOM element of the step
// - step: The step object configured for the step
// - options.config: The current configuration options
// - options.state: The current state of the driver
// - options.driver: Current driver object
onNextClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
onPrevClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
onCloseClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
};
Note: By overriding onNextClick, and onPrevClick hooks you control the navigation of the driver. This means that user won’t be able to navigate using the buttons and you will have to either call driverObj.moveNext() or driverObj.movePrevious() to navigate to the next/previous step.

You can use this to implement custom logic for navigating between steps. This is also useful when you are dealing with dynamic content and want to highlight the next/previous element based on some logic.

onNextClick and onPrevClick hooks can be configured at the step level as well. When configured at the driver level, you control the navigation for all the steps. When configured at the step level, you control the navigation for that particular step only.

Popover Configuration
The popover is the main UI element of Driver.js. It’s the element that highlights the target element, and shows the step content. You can configure the popover globally, or per step. Given below are some of the available configuration options.

type Popover = {
// Title and descriptions shown in the popover.
// You can use HTML in these. Also, you can
// omit one of these to show only the other.
title?: string;
description?: string;

// The position and alignment of the popover
// relative to the target element.
side?: "top" | "right" | "bottom" | "left";
align?: "start" | "center" | "end";

// Array of buttons to show in the popover.
// When highlighting a single element, there
// are no buttons by default. When showing
// a tour, the default buttons are "next",
// "previous" and "close".
showButtons?: ("next" | "previous" | "close")[];
// An array of buttons to disable. This is
// useful when you want to show some of the
// buttons, but disable some of them.
disableButtons?: ("next" | "previous" | "close")[];

// Text to show in the buttons. `doneBtnText`
// is used on the last step of a tour.
nextBtnText?: string;
prevBtnText?: string;
doneBtnText?: string;

// Whether to show the progress text in popover.
showProgress?: boolean;
// Template for the progress text. You can use
// the following placeholders in the template:
// - {{current}}: The current step number
// - {{total}}: Total number of steps
// Defaults to following if `showProgress` is true:
// - "{{current}} of {{total}}"
progressText?: string;

// Custom class to add to the popover element.
// This can be used to style the popover.
popoverClass?: string;

// Hook to run after the popover is rendered.
// You can modify the popover element here.
// Parameter is an object with references to
// the popover DOM elements such as buttons
// title, descriptions, body, etc.
onPopoverRender?: (popover: PopoverDOM, options: { config: Config; state: State, driver: Driver }) => void;

// Callbacks for button clicks. You can use
// these to add custom behavior to the buttons.
// Each callback receives the following parameters:
// - element: The current DOM element of the step
// - step: The step object configured for the step
// - options.config: The current configuration options
// - options.state: The current state of the driver
// - options.driver: Current driver object
onNextClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void
onPrevClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void
onCloseClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void
}
Drive Step Configuration
Drive step is the configuration object passed to the highlight method or the steps array of the drive method. You can configure the popover and the target element for each step. Given below are some of the available configuration options.

type DriveStep = {
// The target element to highlight.
// This can be a DOM element, or a CSS selector.
// If this is a selector, the first matching
// element will be highlighted.
element: Element | string;

// The popover configuration for this step.
// Look at the Popover Configuration section
popover?: Popover;

// Whether to disable interaction with the highlighted element. (default: false)
disableActiveInteraction?: boolean;

// Callback when the current step is deselected,
// about to be highlighted or highlighted.
// Each callback receives the following parameters:
// - element: The current DOM element of the step
// - step: The step object configured for the step
// - options.config: The current configuration options
// - options.state: The current state of the driver
// - options.driver: Current driver object
onDeselected?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
onHighlightStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
onHighlighted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
}
State
You can access the current state of the driver by calling the getState method. It’s also passed to the hooks and callbacks.

type State = {
// Whether the driver is currently active or not
isInitialized?: boolean;

// Index of the currently active step if using
// as a product tour and have configured the
// steps array.
activeIndex?: number;
// DOM element of the currently active step
activeElement?: Element;
// Step object of the currently active step
activeStep?: DriveStep;

// DOM element that was previously active
previousElement?: Element;
// Step object of the previously active step
previousStep?: DriveStep;

// DOM elements for the popover i.e. including
// container, title, description, buttons etc.
popover?: PopoverDOM;
}

Here is the list of methods provided by driver when you initialize it.

Note: We have omitted the configuration options for brevity. Please look at the configuration section for the options. Links are provided in the description below.

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Look at the configuration section for the options
// https://driverjs.com/docs/configuration#driver-configuration
const driverObj = driver({ /_ ... _/ });

// --------------------------------------------------
// driverObj is an object with the following methods
// --------------------------------------------------

// Start the tour using `steps` given in the configuration
driverObj.drive(); // Starts at step 0
driverObj.drive(4); // Starts at step 4

driverObj.moveNext(); // Move to the next step
driverObj.movePrevious(); // Move to the previous step
driverObj.moveTo(4); // Move to the step 4
driverObj.hasNextStep(); // Is there a next step
driverObj.hasPreviousStep() // Is there a previous step

driverObj.isFirstStep(); // Is the current step the first step
driverObj.isLastStep(); // Is the current step the last step

driverObj.getActiveIndex(); // Gets the active step index

driverObj.getActiveStep(); // Gets the active step configuration
driverObj.getPreviousStep(); // Gets the previous step configuration
driverObj.getActiveElement(); // Gets the active HTML element
driverObj.getPreviousElement(); // Gets the previous HTML element

// Is the tour or highlight currently active
driverObj.isActive();

// Recalculate and redraw the highlight
driverObj.refresh();

// Look at the configuration section for configuration options
// https://driverjs.com/docs/configuration#driver-configuration
driverObj.getConfig();
driverObj.setConfig({ /_ ... _/ });

driverObj.setSteps([ /* ... */ ]); // Set the steps

// Look at the state section of configuration for format of the state
// https://driverjs.com/docs/configuration#state
driverObj.getState();

// Look at the DriveStep section of configuration for format of the step
// https://driverjs.com/docs/configuration/#drive-step-configuration
driverObj.highlight({ /_ ... _/ }); // Highlight an element

driverObj.destroy(); // Destroy the tour

Theming
You can customize the look and feel of the driver by adding custom class to popover or applying CSS to different classes used by driver.js.

Styling Popover
You can set the popoverClass option globally in the driver configuration or at the step level to apply custom class to the popover and then use CSS to apply styles.

const driverObj = driver({
popoverClass: 'my-custom-popover-class'
});

// or you can also have different classes for different steps
const driverObj2 = driver({
steps: [
{
element: '#some-element',
popover: {
title: 'Title',
description: 'Description',
popoverClass: 'my-custom-popover-class'
}
}
],
})
Here is the list of classes applied to the popover which you can use in conjunction with popoverClass option to apply custom styles on the popover.

/_ Class assigned to popover wrapper _/
.driver-popover {}

/_ Arrow pointing towards the highlighted element _/
.driver-popover-arrow {}

/_ Title and description _/
.driver-popover-title {}
.driver-popover-description {}

/_ Close button displayed on the top right corner _/
.driver-popover-close-btn {}

/_ Footer of the popover displaying progress and navigation buttons _/
.driver-popover-footer {}
.driver-popover-progress-text {}
.driver-popover-prev-btn {}
.driver-popover-next-btn {}
Visit the example page for an example that modifies the popover styles.

Modifying Popover DOM
Alternatively, you can also use the onPopoverRender hook to modify the popover DOM before it is displayed. The hook is called with the popover DOM as the first argument.

type PopoverDOM = {
wrapper: HTMLElement;
arrow: HTMLElement;
title: HTMLElement;
description: HTMLElement;
footer: HTMLElement;
progress: HTMLElement;
previousButton: HTMLElement;
nextButton: HTMLElement;
closeButton: HTMLElement;
footerButtons: HTMLElement;
};

onPopoverRender?: (popover: PopoverDOM, opts: { config: Config; state: State }) => void;
Styling Page
Following classes are applied to the page when the driver is active.

/_ Applied to the `body` when the driver: _/
.driver-active {} /_ is active _/
.driver-fade {} /_ is animated _/
.driver-simple {} /_ is not animated _/
Following classes are applied to the overlay i.e. the lightbox displayed over the page.

.driver-overlay {}
Styling Highlighted Element
Whenever an element is highlighted, the following classes are applied to it.

.driver-active-element {}

Animated Tour
The following example shows how to create a simple tour with a few steps. Click the button below the code sample to see the tour in action.
Basic Animated Tour

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
showProgress: true,
steps: [
{ element: '#tour-example', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
{ element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
{ element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
{ element: 'code .line:nth-child(4) span:nth-child(7)', popover: { title: 'Create Driver', description: 'Simply call the driver function to create a driver.js instance', side: "left", align: 'start' }},
{ element: 'code .line:nth-child(18)', popover: { title: 'Start Tour', description: 'Call the drive method to start the tour and your tour will be started.', side: "top", align: 'start' }},
{ element: 'a[href="/docs/configuration"]', popover: { title: 'More Configuration', description: 'Look at this page for all the configuration options you can pass.', side: "right", align: 'start' }},
{ popover: { title: 'Happy Coding', description: 'And that is all, go ahead and start adding tours to your applications.' } }
]
});

driverObj.drive();

Styling Popover
You can either use the default class names and override the styles or you can pass a custom class name to the popoverClass option either globally or per step.

Alternatively, if want to modify the Popover DOM, you can use the onPopoverRender callback to get the popover DOM element and do whatever you want with it before popover is rendered.

We have added a few examples below but have a look at the theming section for detailed guide including class names to target etc.

Using CSS

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
popoverClass: 'driverjs-theme'
});

driverObj.highlight({
element: '#demo-theme',
popover: {
title: 'Style However You Want',
description: 'You can use the default class names and override the styles or you can pass a custom class name to the popoverClass option either globally or per step.'
}
});
Driver.js Website Theme
Here is the CSS used for the above example:

.driver-popover.driverjs-theme {
background-color: #fde047;
color: #000;
}

.driver-popover.driverjs-theme .driver-popover-title {
font-size: 20px;
}

.driver-popover.driverjs-theme .driver-popover-title,
.driver-popover.driverjs-theme .driver-popover-description,
.driver-popover.driverjs-theme .driver-popover-progress-text {
color: #000;
}

.driver-popover.driverjs-theme button {
flex: 1;
text-align: center;
background-color: #000;
color: #ffffff;
border: 2px solid #000;
text-shadow: none;
font-size: 14px;
padding: 5px 8px;
border-radius: 6px;
}

.driver-popover.driverjs-theme button:hover {
background-color: #000;
color: #ffffff;
}

.driver-popover.driverjs-theme .driver-popover-navigation-btns {
justify-content: space-between;
gap: 3px;
}

.driver-popover.driverjs-theme .driver-popover-close-btn {
color: #9b9b9b;
}

.driver-popover.driverjs-theme .driver-popover-close-btn:hover {
color: #000;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-left.driver-popover-arrow {
border-left-color: #fde047;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-right.driver-popover-arrow {
border-right-color: #fde047;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-top.driver-popover-arrow {
border-top-color: #fde047;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-bottom.driver-popover-arrow {
border-bottom-color: #fde047;
}

Using Hook to Modify

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
// Get full control over the popover rendering.
// Here we are adding a custom button that takes
// the user to the first step.
onPopoverRender: (popover, { config, state }) => {
const firstButton = document.createElement("button");
firstButton.innerText = "Go to First";
popover.footerButtons.appendChild(firstButton);

    firstButton.addEventListener("click", () => {
      driverObj.drive(0);
    });

},
steps: [
// ..
]
});

driverObj.drive();

Tour Progress
You can use showProgress option to show the progress of the tour. It is shown in the bottom left corner of the screen. There is also progressText option which can be used to customize the text shown for the progress.

Please note that showProgress is false by default. Also the default text for progressText is {{current}} of {{total}}. You can use {{current}} and {{total}} in your progressText template to show the current and total steps.

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
showProgress: true,
showButtons: ['next', 'previous'],
steps: [
{ element: '#tour-example', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
{ element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
{ element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
{ element: 'code .line:nth-child(4) span:nth-child(7)', popover: { title: 'Create Driver', description: 'Simply call the driver function to create a driver.js instance', side: "left", align: 'start' }},
{ element: 'code .line:nth-child(16)', popover: { title: 'Start Tour', description: 'Call the drive method to start the tour and your tour will be started.', side: "top", align: 'start' }},
]
});

driverObj.drive();

Async Tour
You can also have async steps in your tour. This is useful when you want to load some data from the server and then show the tour.

Asynchronous Tour

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
showProgress: true,
steps: [
{
popover: {
title: 'First Step',
description: 'This is the first step. Next element will be loaded dynamically.'
// By passing onNextClick, you can override the default behavior of the next button.
// This will prevent the driver from moving to the next step automatically.
// You can then manually call driverObj.moveNext() to move to the next step.
onNextClick: () => {
// .. load element dynamically
// .. and then call
driverObj.moveNext();
},
},
},
{
element: '.dynamic-el',
popover: {
title: 'Async Element',
description: 'This element is loaded dynamically.'
},
// onDeselected is called when the element is deselected.
// Here we are simply removing the element from the DOM.
onDeselected: () => {
// .. remove element
document.querySelector(".dynamic-el")?.remove();
}
},
{ popover: { title: 'Last Step', description: 'This is the last step.' } }
]

});

driverObj.drive();
Show me an Example
Note: By overriding onNextClick, and onPrevClick hooks you control the navigation of the driver. This means that user won’t be able to navigate using the buttons and you will have to either call driverObj.moveNext() or driverObj.movePrevious() to navigate to the next/previous step.

You can use this to implement custom logic for navigating between steps. This is also useful when you are dealing with dynamic content and want to highlight the next/previous element based on some logic.

onNextClick and onPrevClick hooks can be configured at driver level as well as step level. When configured at the driver level, you control the navigation for all the steps. When configured at the step level, you control the navigation for that particular step only.

Confirm on Exit
You can use the onDestroyStarted hook to add a confirmation dialog or some other logic when the user tries to exit the tour. In the example below, upon exit we check if there are any tour steps left and ask for confirmation before we exit.

Confirm on Exit

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
showProgress: true,
steps: [
{ element: '#confirm-destroy-example', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
{ element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
{ element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
{ popover: { title: 'Happy Coding', description: 'And that is all, go ahead and start adding tours to your applications.' } }
],
// onDestroyStarted is called when the user tries to exit the tour
onDestroyStarted: () => {
if (!driverObj.hasNextStep() || confirm("Are you sure?")) {
driverObj.destroy();
}
},
});

driverObj.drive();
Show me an Example
Note: By overriding the onDestroyStarted hook, you are responsible for calling driverObj.destroy() to exit the tour.

Prevent Tour Exit
You can also prevent the user from exiting the tour using allowClose option. This option is useful when you want to force the user to complete the tour before they can exit.

In the example below, you won’t be able to exit the tour until you reach the last step.
Prevent Exit

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
showProgress: true,
allowClose: false,
steps: [
{ element: '#prevent-exit', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
{ element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
{ element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
{ popover: { title: 'Happy Coding', description: 'And that is all, go ahead and start adding tours to your applications.' } }
],
});

driverObj.drive();

Styling Overlay
You can customize the overlay opacity and color using overlayOpacity and overlayColor options to change the look of the overlay.

Note: In the examples below we have used highlight method to highlight the elements. The same configuration applies to the tour steps as well.

Overlay Color
Here are some driver.js examples with different overlay colors.

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
overlayColor: 'red'
});

driverObj.highlight({
popover: {
title: 'Pass any RGB Color',
description: 'Here we have set the overlay color to be red. You can pass any RGB color to overlayColor option.'
}
});

Popover Position
You can control the popover position using the side and align options. The side option controls the side of the element where the popover will be shown and the align option controls the alignment of the popover with the element.

Note: Popover is intelligent enough to adjust itself to fit in the viewport. So, if you set side to left and align to start, but the popover doesn’t fit in the viewport, it will automatically adjust itself to fit in the viewport. Consider highlighting and scrolling the browser to the element below to see this in action.

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver();
driverObj.highlight({
element: '#left-start',
popover: {
title: 'Animated Tour Example',
description: 'Here is the code example showing animated tour. Let\'s walk you through it.',
side: "left",
align: 'start'
}
});

Popover Buttons
You can use the showButtons option to choose which buttons to show in the popover. The default value is ['next', 'previous', 'close'].

Note: When using the highlight method to highlight a single element, the only button shown is the close button. However, you can use the showButtons option to show other buttons as well. But the buttons won’t do anything. You will have to use the onNextClick and onPreviousClick callbacks to implement the functionality.

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
showButtons: [
'next',
'previous',
'close'
],
steps: [
{
element: '#first-element',
popover: {
title: 'Popover Title',
description: 'Popover Description'
}
},
{
element: '#second-element',
popover: {
title: 'Popover Title',
description: 'Popover Description'
}
}
]
});

driverObj.drive();

Simple Highlight
Product tours is not the only usecase for Driver.js. You can use it to highlight any element on the page and show a popover with a description. This is useful for providing contextual help to the user e.g. help the user fill a form or explain a feature.

Example below shows how to highlight an element and simply show a popover.

Highlight Me
Here is the code for above example:

const driverObj = driver({
popoverClass: "driverjs-theme",
stagePadding: 4,
});

driverObj.highlight({
element: "#highlight-me",
popover: {
side: "bottom",
title: "This is a title",
description: "This is a description",
}
})
You can also use it to show a simple modal without highlighting any element.

Show Popover
Here is the code for above example:

const driverObj = driver();

driverObj.highlight({
popover: {
description: "<img src='https://i.imgur.com/EAQhHu5.gif' style='height: 202.5px; width: 270px;' /><span style='font-size: 15px; display: block; margin-top: 10px; text-align: center;'>Yet another highlight example.</span>",
}
})
Focus on the input below and see how the popover is shown.

Enter your Name
Your Education
Your Age
Your Address
Submit
Here is the code for the above example.

const driverObj = driver({
popoverClass: "driverjs-theme",
stagePadding: 0,
onDestroyed: () => {
document?.activeElement?.blur();
}
});

const nameEl = document.getElementById("name");
const educationEl = document.getElementById("education");
const ageEl = document.getElementById("age");
const addressEl = document.getElementById("address");
const formEl = document.querySelector("form");

nameEl.addEventListener("focus", () => {
driverObj.highlight({
element: nameEl,
popover: {
title: "Name",
description: "Enter your name here",
},
});
});

educationEl.addEventListener("focus", () => {
driverObj.highlight({
element: educationEl,
popover: {
title: "Education",
description: "Enter your education here",
},
});
});

ageEl.addEventListener("focus", () => {
driverObj.highlight({
element: ageEl,
popover: {
title: "Age",
description: "Enter your age here",
},
});
});

addressEl.addEventListener("focus", () => {
driverObj.highlight({
element: addressEl,
popover: {
title: "Address",
description: "Enter your address here",
},
});
});

formEl.addEventListener("blur", () => {
driverObj.destroy();
});
