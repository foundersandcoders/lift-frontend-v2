import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from './radix-compatibility';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  singleButton?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  singleButton = false,
}: ConfirmationDialogProps) {
  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50">
      <div className="bg-white max-w-md rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-brand-pink p-3 flex items-center">
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        
        {/* Body */}
        <div className='bg-gray-50 p-4'>
          <p className='text-sm text-gray-800'>{description}</p>
        </div>
        
        {/* Footer */}
        <div className='p-4 bg-gray-50 flex justify-end space-x-2'>
          {singleButton ? (
            <Button variant='default' onClick={onConfirm} className="inline-flex items-center">
              <span>OK</span>
            </Button>
          ) : (
            <>
              <Button variant='outline' onClick={onClose} className="inline-flex items-center">
                <span>Cancel</span>
              </Button>
              <Button variant='destructive' onClick={onConfirm} className="inline-flex items-center">
                <span>Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
