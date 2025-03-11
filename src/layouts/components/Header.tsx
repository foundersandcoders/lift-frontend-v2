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
      <div className='container mx-auto flex items-center justify-between'>
        {/* Left side: Logo and Title */}
        <div className='flex items-center'>
          <img src='/lift_logo.png' alt='Logo' className='h-10 mr-2' />
          <h1 className='text-2xl font-bold'>Beacons</h1>
        </div>
        
        {/* Right side: User info & dashboard trigger */}
        {data.username ? (
          <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
            <DialogTrigger asChild>
              <div className='flex items-center border-2 border-white rounded-full px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer hover:bg-pink-600 transition-colors'>
                <span className='hidden sm:inline mr-2'>Logged as: </span>
                <span className='mr-2 text-sm sm:text-base'>{data.username}</span>
                <SmallCircularQuestionCounter size={20} />
              </div>
            </DialogTrigger>
            <UserDataModal
              onOpenChange={setIsDashboardOpen}
            />
          </Dialog>
        ) : (
          <div className='flex items-center border-2 border-white rounded-full px-3 py-1.5 sm:px-4 sm:py-2 cursor-default'>
            <span className='hidden sm:inline mr-2'>Not logged in</span>
            <span className='sm:hidden mr-2'>Guest</span>
            <SmallCircularQuestionCounter size={20} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
