import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from './dialog';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Pass headerTitle so the shared DialogContent renders the pink header */}
      <DialogContent headerTitle={title} className='sm:max-w-md p-0'>
        {/* Optionally hide the description for screen readers */}
        <DialogDescription className='sr-only'>{description}</DialogDescription>
        <div className='bg-gray-50 p-4'>
          <p className='text-sm text-gray-800'>{description}</p>
        </div>
        <DialogFooter className='p-4 bg-gray-50 sm:rounded-b-lg'>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
