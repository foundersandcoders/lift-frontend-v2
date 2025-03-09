// src/components/Header.tsx
import React, { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import { Dialog, DialogTrigger } from './ui/dialog';
import SmallCircularQuestionCounter from './ui/questionCounter/smallCircularQuestionCounter';
import UserDataModal from './UserDataModal';

const Header: React.FC = () => {
  const { data } = useEntries();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <header className='bg-brand-pink text-white p-4 shadow-md'>
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
              <div className='flex items-center border-2 border-white rounded-full px-4 py-2 cursor-pointer hover:bg-pink-600 transition-colors'>
                <span className='mr-2'>Logged as: {data.username}</span>
                <SmallCircularQuestionCounter />
              </div>
            </DialogTrigger>
            <UserDataModal 
              isOpen={isDashboardOpen} 
              onOpenChange={setIsDashboardOpen} 
            />
          </Dialog>
        ) : (
          <div className='flex items-center border-2 border-white rounded-full px-4 py-2 cursor-default'>
            <span className='mr-2'>Not logged</span>
            <SmallCircularQuestionCounter />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
