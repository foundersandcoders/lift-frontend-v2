// src/components/Header.tsx
import React, { useState } from 'react';
import { useEntries } from '../../features/statements/hooks/useEntries';
import SmallCircularQuestionCounter from '../../components/ui/questionCounter/smallCircularQuestionCounter';
import UserDataModal from '../../components/modals/UserDataModal';
// import { Tooltip, TooltipTrigger, TooltipContent } from '../../components/ui/better-tooltip';

const Header: React.FC = () => {
  const { data } = useEntries();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Debug output to make sure username is correct
  //console.log("Header rendering with username:", data.username);

  // Function to open the modal directly
  const openModal = () => {
    console.log('Opening modal directly');
    setIsDashboardOpen(true);
  };

  return (
    <header className='bg-brand-pink text-white py-3 px-2 sm:p-4 shadow-md sticky top-0 z-50'>
      <div className='px-1 sm:px-4 md:container md:mx-auto'>
        {/* Simplified header layout */}
        <div className='flex items-center justify-between'>
          {/* Left section: Logo and Title */}
          <div className='flex items-center'>
            <img src='/lift_logo.png' alt='Logo' className='h-8 sm:h-10 mr-2' />
            <h1 className='text-3xl md:text-4xl font-bold'>Beacons</h1>
          </div>

          {/* Right section: Login button and Tour button */}
          <div className='flex items-center relative'>
            {data.username ? (
              <div className='flex items-center'>
                <button
                  onClick={openModal}
                  className='flex items-center border-2 border-white rounded-full px-2 py-1 sm:px-4 sm:py-2 cursor-pointer hover:bg-pink-600 transition-colors'
                >
                  <span className='mr-2 text-xs sm:text-base truncate max-w-[100px] sm:max-w-[150px]'>
                    {data.username}
                  </span>
                  <SmallCircularQuestionCounter size={18} />
                </button>
              </div>
            ) : (
              <div className='flex items-center border-2 border-white rounded-full px-2 py-1 sm:px-4 sm:py-2'>
                <span className='mr-2 text-xs sm:text-base'>Not logged in</span>
                <SmallCircularQuestionCounter size={18} />
              </div>
            )}

            {/* Render the user data modal when open */}
            {isDashboardOpen && (
              <UserDataModal onOpenChange={setIsDashboardOpen} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
