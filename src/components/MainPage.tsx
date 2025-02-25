'use client';

import React from 'react';
import StatementList from './statements/StatementList';
import { useStatements } from '../hooks/useStatements';

const MainPage: React.FC = () => {
  const { data } = useStatements();
  const { username } = data;
  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 '>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Statement builder for {username}
      </h1>
      <div className='container mx-auto px-4'>
        <StatementList username={username} />
      </div>
    </main>
  );
};

export default MainPage;
