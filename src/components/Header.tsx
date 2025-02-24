import React from 'react';

interface HeaderProps {
  username?: string;
  employerEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ username, employerEmail }) => {
  return (
    <header className='bg-primary text-primary-foreground p-4 shadow-md'>
      <div className='container mx-auto flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Nassport</h1>
        <div>
          {username && <span className='mr-4'>Welcome, {username}</span>}
          {employerEmail && <span className='text-sm'>{employerEmail}</span>}
        </div>
      </div>
    </header>
  );
};

export default Header;
