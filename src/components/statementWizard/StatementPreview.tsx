import React from 'react';
import type { Entry } from '../../../types/entries';

// Mapping from atom to background classes based on your wizard border colors.
const atomBgClasses: Record<string, string> = {
  subject: 'bg-subjectSelector', // derived from border-subjectSelector
  verb: 'bg-verbSelector', // derived from border-verbSelector
  object: 'bg-objectInput', // derived from border-objectInput
  adverbial: 'bg-gray-400', // using the complement color as default
};

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
          <span
            className={`px-2 py-1 rounded ${atomBgClasses.subject} text-black`}
          >
            {subject}
          </span>
        )}
        {verb && (
          <span
            className={`px-2 py-1 rounded ${atomBgClasses.verb} text-black`}
          >
            {verb}
          </span>
        )}
        {object && (
          <span
            className={`px-2 py-1 rounded ${atomBgClasses.object} text-black`}
          >
            {object}
          </span>
        )}
        {adverbial &&
          adverbial.length > 0 &&
          adverbial.map((word, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded ${atomBgClasses.adverbial} text-black`}
            >
              {word}
            </span>
          ))}
      </div>
    </div>
  );
};

export default StatementPreview;
