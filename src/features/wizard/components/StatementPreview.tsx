import React from 'react';
import type { Entry, Step } from '@/types/entries';
import { getVerbName } from '@/lib/utils/verbUtils';
import { MailPlus, MailX } from 'lucide-react';
import statementsCategories from '@/data/statementsCategories.json';

interface StatementPreviewProps {
  selection: Entry & {
    currentStep?: Step;
  };
}

const StatementPreview: React.FC<StatementPreviewProps> = ({ selection }) => {
  const { subject, verb, object, adverbial } = selection.atoms;
  const { isPublic, category } = selection;

  // Get the current step from the wizard
  const currentStep = selection.currentStep ?? 'privacy';

  // Determine if we're using a preset question (indicated by the complement step being present)
  const isPresetQuestion = !selection.currentStep || selection.currentStep === 'complement' || Boolean(selection.presetId);
  
  // For custom statements, only show preview if we have at least a category
  // For preset questions, show if we have a subject
  const hasContent = isPresetQuestion ? Boolean(subject.trim()) : Boolean(category.trim());

  // Only show privacy icon if we've reached or passed that step
  const showPrivacyIcon =
    currentStep === 'privacy' || currentStep === 'complement';

  // Only show category if:
  // - For custom statements: on category step or beyond
  // - For preset statements: don't show category at all (it's predetermined)
  const showCategory = 
    !isPresetQuestion && (
      (currentStep === 'category') || 
      (currentStep === 'subject') || 
      (currentStep === 'verb') || 
      (currentStep === 'object') || 
      (currentStep === 'privacy')
    );
    
  // Only show subject if we're on subject step or beyond
  const showSubject = 
    (currentStep === 'subject') || 
    (currentStep === 'verb') || 
    (currentStep === 'object') || 
    (currentStep === 'category' && isPresetQuestion) || 
    (currentStep === 'privacy') || 
    (currentStep === 'complement');

  // Get category display name from ID
  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return '';

    // Handle uncategorized variations
    const normalized = categoryId.toLowerCase();
    if (normalized === 'uncategorized' || normalized === 'uncategorised') {
      return 'Uncategorised';
    }

    // Find matching category in the list
    const categoryObj = statementsCategories.categories.find(
      (cat) => cat.id.toLowerCase() === normalized
    );

    return categoryObj ? categoryObj.name : categoryId;
  };

  if (!hasContent) return null;

  return (
    <div className='w-full pl-2 pr-4 mt-0 mb-3 flex flex-wrap gap-1.5 items-center justify-start'>
      {/* Statement label */}
      {/* <div className='flex items-center mr-1 text-gray-500'>
        <FileText size={12} className='mr-1' />
        <span className='text-xs font-medium'>Statement:</span>
      </div> */}

      {/* Statement parts in the correct order */}
      
      {/* Category (first for custom statements, hidden for preset questions) */}
      {showCategory && category && !selection.presetId && (
        <span className='px-1.5 py-0.5 text-xs rounded bg-categorySelector text-black flex items-center gap-1'>
          <span className='mr-1'>📁</span>
          {getCategoryName(category)}
        </span>
      )}
      
      {/* Subject (second step for custom) */}
      {showSubject && subject && (
        <span className='px-1.5 py-0.5 text-xs rounded bg-subjectSelector text-black'>
          {subject}
        </span>
      )}
      
      {/* Verb */}
      {verb && (currentStep === 'verb' || currentStep === 'object' || currentStep === 'privacy' || currentStep === 'complement') && (
        <span className='px-1.5 py-0.5 text-xs rounded bg-verbSelector text-black'>
          {getVerbName(verb)}
        </span>
      )}
      
      {/* Object */}
      {object && (currentStep === 'object' || currentStep === 'privacy' || currentStep === 'complement') && (
        <span className='px-1.5 py-0.5 text-xs rounded bg-objectInput text-black'>
          {object}
        </span>
      )}

      {/* Privacy indicator (only show after privacy step) */}
      {showPrivacyIcon && (
        <span
          className={`ml-0.5 px-1.5 py-0.5 flex-shrink-0 rounded flex items-center ${
            isPublic ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
          }`}
        >
          {isPublic ? <MailPlus size={16} /> : <MailX size={16} />}
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
        
      {/* Description preview */}
      {selection.description && (currentStep === 'description' || currentStep === 'privacy' || currentStep === 'complement') && (
        <div className='w-full mt-2 px-2'>
          <p className='text-xs text-gray-500 italic truncate'>{selection.description}</p>
        </div>
      )}
    </div>
  );
};

export default StatementPreview;
