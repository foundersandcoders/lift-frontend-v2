'use client';

import StatementBuilder from './components/StatementBuilder';
import StatementWizard from './components/StatementWizard';

const USERNAME = 'Eve';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12'>
      <div className='container mx-auto px-4 max-w-3xl'>
        <h1 className='text-3xl font-bold mb-8 text-center'>
          Statement Builders for {USERNAME}
        </h1>

        <div className='bg-white rounded-xl shadow-lg p-6  '>
          <StatementWizard onComplete={() => {}} username={USERNAME} />
          <StatementBuilder onAddStatement={() => {}} username={USERNAME} />
        </div>
      </div>
    </main>
  );
}
