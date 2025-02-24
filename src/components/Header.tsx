import React from 'react';
import { useStatements } from '../hooks/useStatements';

const Header: React.FC = () => {
  const { data } = useStatements();

  return (
    <header className='bg-brand-pink text-white p-4 shadow-md'>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='flex items-center'>
          {/* Replace the src with your logo path */}
          <img
            src='../../public/lift_logo.png'
            alt='Logo'
            className='h-10 mr-2'
          />
          <h1 className='text-2xl font-bold'>Nassport</h1>
        </div>
        <div>
          {data.username ? (
            <>
              <span className='mr-4'>Logged as: {data.username}</span>
              {data.managerEmail && (
                <span className='text-sm'>{data.managerEmail}</span>
              )}
            </>
          ) : (
            <span>Welcome to Nassport</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
