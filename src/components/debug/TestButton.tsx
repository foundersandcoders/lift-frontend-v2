// TestStatementButton.tsx
import React from 'react';
import { Button } from '../ui/button';
import type { Entry } from '../../../types/entries';
import { useEntries } from '../../features/statements/hooks/useEntries'; // CHANGE: Import useEntries to update context

const TestStatementButton: React.FC = () => {
  // Create a valid test statement with one sample action.
  const createTestStatement = (): Entry => ({
    id: Date.now().toString(), // unique id based on current time
    input: 'Alice supports the project', // full statement text
    isPublic: true,
    atoms: {
      subject: 'Alice',
      verb: 'supports',
      object: 'the project',
    },
    category: 'wellbeing',
    actions: [
      {
        id: 'a' + Date.now().toString(),
        creationDate: new Date().toISOString(),
        byDate: '', // Optional due date field
        action: 'Review the project plan',
        completed: false,
      },
    ],
  });

  // CHANGE: Get the context's setData function to update entries.
  const { setData } = useEntries();

  const handleClick = () => {
    const testStatement = createTestStatement();
    // console.log('Test statement created:', testStatement);

    setData({ type: 'ADD_ENTRY', payload: testStatement });
  };

  return (
    <Button onClick={handleClick} variant='outline' className='px-4 py-2'>
      Create Test Statement
    </Button>
  );
};

export default TestStatementButton;
