import React from 'react';
import type { Entry } from '../../../types/entries';

interface StatementPreviewProps {
  selection: Entry;
}

const StatementPreview: React.FC<StatementPreviewProps> = ({ selection }) => {
  const { subject, verb, object, adverbial } = selection.atoms;
  const adverbialText =
    adverbial && adverbial.length > 0 ? adverbial.join(' ') : '';
  const fullStatement = `${subject} ${verb} ${object}${
    adverbialText ? ' ' + adverbialText : ''
  }`;

  return (
    <div className='mt-4 p-2 border-t border-gray-200 bg-gray-50'>
      <p className='text-sm text-gray-600'>
        Current Statement: {fullStatement}
      </p>
    </div>
  );
};

export default StatementPreview;
