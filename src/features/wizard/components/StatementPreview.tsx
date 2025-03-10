import React from 'react';
import type { Entry, Step } from '@/types/entries';
import { getVerbName } from '@/lib/utils/verbUtils';
import { MailPlus, MailX, FileText } from 'lucide-react';

interface StatementPreviewProps {
  selection: Entry & {
    currentStep?: Step;
  };
}

const StatementPreview: React.FC<StatementPreviewProps> = ({ selection }) => {
  const { subject, verb, object, adverbial } = selection.atoms;
  const { isPublic } = selection;
  
  // Get the current step from the wizard
  const currentStep = selection.currentStep;

  // Only show the preview if we have at least a subject
  const hasContent = Boolean(subject.trim());

  // Only show privacy icon if we've reached or passed that step
  const showPrivacyIcon = currentStep === 'privacy' || currentStep === 'complement';

  if (!hasContent) return null;

  return (
    <div className='w-full pl-2 pr-4 mt-3 -mb-1 flex flex-wrap gap-1.5 items-center justify-start'>
      {/* Statement label */}
      <div className='flex items-center mr-1 text-gray-500'>
        <FileText size={12} className='mr-1' />
        <span className='text-xs font-medium'>Statement:</span>
      </div>
      
      {/* Statement parts */}
      {subject && (
        <span className='px-1.5 py-0.5 text-xs rounded bg-subjectSelector text-black'>
          {subject}
        </span>
      )}
      {verb && (
        <span className='px-1.5 py-0.5 text-xs rounded bg-verbSelector text-black'>
          {getVerbName(verb)}
        </span>
      )}
      {object && (
        <span className='px-1.5 py-0.5 text-xs rounded bg-objectInput text-black'>
          {object}
        </span>
      )}
      
      {/* Privacy indicator (only show after privacy step) */}
      {showPrivacyIcon && (
        <span className={`ml-0.5 flex-shrink-0 ${isPublic ? 'text-green-500' : 'text-gray-500'}`}>
          {isPublic ? <MailPlus size={14} /> : <MailX size={14} />}
        </span>
      )}
      
      {/* Adverbials */}
      {adverbial &&
        adverbial.length > 0 &&
        adverbial.map((word, index) => (
          <span
            key={index}
            className='px-1.5 py-0.5 text-xs rounded bg-gray-400 text-black'
          >
            {word}
          </span>
        ))}
    </div>
  );
};

export default StatementPreview;
