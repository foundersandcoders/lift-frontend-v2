import React from 'react';
import type { Entry } from '../../../types/entries';
import { getVerbName } from '../../../utils/verbUtils';

interface StatementPreviewProps {
  selection: Entry;
}

const StatementPreview: React.FC<StatementPreviewProps> = ({ selection }) => {
  const { subject, verb, object, adverbial } = selection.atoms;

  return (
    <div className='mt-4 p-2 border-t border-gray-200 bg-gray-50'>
      <p className='text-sm text-gray-600 mb-2'>Current Statement:</p>
      <div className='flex flex-wrap gap-2'>
        {subject && (
          <span className={`px-2 py-1 rounded bg-subjectSelector text-black`}>
            {subject}
          </span>
        )}
        {verb && (
          <span className={`px-2 py-1 rounded bg-verbSelector text-black`}>
            {getVerbName(verb)}
          </span>
        )}
        {object && (
          <span className={`px-2 py-1 rounded bg-objectInput text-black`}>
            {object}
          </span>
        )}
        {adverbial &&
          adverbial.length > 0 &&
          adverbial.map((word, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded bg-gray-400 text-black`}
            >
              {word}
            </span>
          ))}
      </div>
    </div>
  );
};

export default StatementPreview;
