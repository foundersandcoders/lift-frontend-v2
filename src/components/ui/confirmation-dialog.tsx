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
            <Button variant='outline' onClick={onConfirm}>
              OK
            </Button>
          ) : (
            <>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={onConfirm}>
                Delete
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
