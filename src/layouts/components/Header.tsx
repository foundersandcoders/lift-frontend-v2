// src/components/Header.tsx
import React, { useState } from 'react';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import SmallCircularQuestionCounter from '../../components/ui/questionCounter/smallCircularQuestionCounter';
import UserDataModal from '../../components/modals/UserDataModal';

const Header: React.FC = () => {
  const { data } = useEntries();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <header className='bg-brand-pink text-white p-4 shadow-md sticky top-0 z-50'>
      <div className='container mx-auto'>
        {/* Mobile: Stacked layout / Desktop: Single row with 3 items */}
        <div className='flex flex-wrap items-center'>
          {/* Mobile: Top row with logo and login / Desktop: with 3-column layout */}
          <div className='flex w-full min-[580px]:w-auto items-center justify-between min-[580px]:justify-start'>
            {/* Logo - always left */}
            <img
              src='/lift_logo.png'
              alt='Logo'
              className='h-8 sm:h-10 mr-2 shrink-0'
            />

            {/* Login - right on mobile, disappears on desktop (reappears in its desktop position) */}
            <div className='min-[580px]:hidden'>
              {data.username ? (
                <Dialog
                  open={isDashboardOpen}
                  onOpenChange={setIsDashboardOpen}
                >
                  <DialogTrigger asChild>
                    <button className='flex items-center shrink-0 border-2 border-white rounded-full px-2 py-1 sm:px-4 sm:py-2 cursor-pointer hover:bg-pink-600 transition-colors'>
                      <span className='hidden sm:inline mr-2'>Logged as: </span>
                      <span className='mr-2 text-xs sm:text-base truncate max-w-[100px] sm:max-w-[150px]'>
                        {data.username}
                      </span>
                      <SmallCircularQuestionCounter size={18} />
                    </button>
                  </DialogTrigger>
                  <UserDataModal onOpenChange={setIsDashboardOpen} />
                </Dialog>
              ) : (
                <div className='flex shrink-0 items-center border-2 border-white rounded-full px-2 py-1 sm:px-4 sm:py-2 cursor-default'>
                  <span className='hidden sm:inline mr-2'>Not logged in</span>
                  <span className='sm:hidden mr-2 text-xs'>Guest</span>
                  <SmallCircularQuestionCounter size={18} />
                </div>
              )}
            </div>
          </div>

          {/* Title - bottom row on mobile, center column on desktop */}
          <h1 className='text-xl sm:text-2xl font-bold w-full min-[580px]:w-auto min-[580px]:flex-1 text-left min-[580px]:text-center mt-2 min-[580px]:mt-0'>
            Beacons
          </h1>

          {/* Login - hidden on mobile (appears in mobile top row), right on desktop */}
          <div className='hidden min-[580px]:block'>
            {data.username ? (
              <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
                <DialogTrigger asChild>
                  <button className='flex items-center shrink-0 border-2 border-white rounded-full px-2 py-1 sm:px-4 sm:py-2 cursor-pointer hover:bg-pink-600 transition-colors'>
                    <span className='hidden sm:inline mr-2'>Logged as: </span>
                    <span className='mr-2 text-xs sm:text-base truncate max-w-[100px] sm:max-w-[150px]'>
                      {data.username}
                    </span>
                    <SmallCircularQuestionCounter size={18} />
                  </button>
                </DialogTrigger>
                <UserDataModal onOpenChange={setIsDashboardOpen} />
              </Dialog>
            ) : (
              <div className='flex shrink-0 items-center border-2 border-white rounded-full px-2 py-1 sm:px-4 sm:py-2 cursor-default'>
                <span className='hidden sm:inline mr-2'>Not logged in</span>
                <span className='sm:hidden mr-2 text-xs'>Guest</span>
                <SmallCircularQuestionCounter size={18} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
