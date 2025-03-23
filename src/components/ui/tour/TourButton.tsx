import 'intro.js/introjs.css';
import './tour.css'; // Import our custom tour styles
import { useTour } from './useTour';
import { HelpCircle } from 'lucide-react';

// Tour button component
export function TourButton(): JSX.Element {
  const { startTour } = useTour();

  return (
    <button
      onClick={startTour}
      className='ml-4 text-white hover:bg-pink-600 transition-colors border-2 border-white rounded-full px-3 py-1 flex items-center'
      aria-label='Start Tour'
    >
      <HelpCircle className="w-4 h-4 mr-1" /> 
      Tour
    </button>
  );
}
