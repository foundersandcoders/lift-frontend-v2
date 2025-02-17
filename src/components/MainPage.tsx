'use client';

import React from 'react';
import StatementBuilder from './StatementBuilder';
import StatementWizard from './StatementWizard';
import StatementList from './statements/StatementList';

interface MainPageProps {
  username: string;
}

const MainPage: React.FC<MainPageProps> = ({ username }) => {
  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 '>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Statement Builders for {username}
      </h1>
      <div className='container mx-auto px-4'>
        <StatementList username={username} />

        <div className='flex flex-col justify-center max-w-3xl mx-auto'>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <StatementWizard username={username} />
            <StatementBuilder username={username} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
