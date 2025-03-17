import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Heart,
  MessageCircleHeart,
} from 'lucide-react';
import {
  SimpleDropdownMenu as DropdownMenu,
  SimpleDropdownMenuTrigger as DropdownMenuTrigger,
  SimpleDropdownMenuContent as DropdownMenuContent,
  SimpleDropdownMenuItem as DropdownMenuItem,
  SimpleDropdownMenuSeparator as DropdownMenuSeparator,
} from '../../../components/ui/simple-dropdown';
import ActionForm from './ActionForm';
import { ConfirmationDialog } from '../../../components/ui/confirmation-dialog';
import type { Action } from '../../../types/entries';
import { CheckCircle2, XCircle } from 'lucide-react';
import GratitudeModal from '../../../components/modals/GratitudeModal';
import { markGratitudeSent } from '../../../features/email/api/gratitudeApi';
import { useEntries } from '../hooks/useEntries';
import { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from '../../../components/ui/better-tooltip';

export interface ActionLineProps {
  statementId: string;
  actions: Action[];
  onEditAction: (
    actionId: string,
    updated: { text: string; dueDate?: string }
  ) => void;
  onDeleteAction: (actionId: string) => void;
  onAddAction: (newAction: { text: string; dueDate?: string }) => void;
  onToggleResolved?: (actionId: string) => void;
  onGratitudeSent?: (actionId: string, message: string) => void;
}

const ActionLine: React.FC<ActionLineProps> = ({
  statementId,
  actions,
  onEditAction,
  onDeleteAction,
  onAddAction,
  onToggleResolved,
  onGratitudeSent,
}) => {
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [actionDeleteConfirmation, setActionDeleteConfirmation] = useState<{
    isOpen: boolean;
    actionId: string | null;
  }>({ isOpen: false, actionId: null });

  // State for gratitude modal
  const [gratitudeModal, setGratitudeModal] = useState<{
    isOpen: boolean;
    action: Action | null;
  }>({ isOpen: false, action: null });
  
  // Get entries data to check for manager email
  const { data } = useEntries();
  const hasManagerEmail = data.managerEmail && data.managerEmail.trim() !== '';

  // --- Handlers for Editing ---
  const handleStartEdit = (action: Action) => {
    setEditingActionId(action.id);
  };

  const handleSaveEdit = (
    actionId: string,
    data: { text: string; dueDate?: string }
  ) => {
    onEditAction(actionId, data);
    setEditingActionId(null);
  };

  const handleCancelEdit = () => {
    setEditingActionId(null);
  };

  // --- Handlers for Adding New Action ---
  const handleStartAdd = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = (data: { text: string; dueDate?: string }) => {
    onAddAction(data);
    setIsAddingNew(false);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
  };

  // --- Handlers for Deleting an Action with Confirmation ---
  const confirmDeleteAction = (actionId: string) => {
    setActionDeleteConfirmation({ isOpen: true, actionId });
  };

  const handleConfirmDeleteAction = () => {
    if (actionDeleteConfirmation.actionId) {
      onDeleteAction(actionDeleteConfirmation.actionId);
    }
    setActionDeleteConfirmation({ isOpen: false, actionId: null });
  };

  const handleCancelDeleteAction = () => {
    setActionDeleteConfirmation({ isOpen: false, actionId: null });
  };

  return (
    <div className='ml-1 pl-3 border-gray-200 space-y-2 mt-2'>
      {actions.map((action) => {
        const isEditing = editingActionId === action.id;
        if (!isEditing) {
          let dueDateText: string | null = null;
          if (action.byDate) {
            const dueDateObj = parse(action.byDate, 'yyyy-MM-dd', new Date());
            if (!isNaN(dueDateObj.getTime())) {
              dueDateText = format(dueDateObj, 'dd/MM/yyyy');
            }
          }
          return (
            <div
              key={action.id}
              className={`flex items-center justify-between p-2 rounded border shadow-sm transition-colors bg-gray-50 hover:bg-gray-100 ${
                action.completed ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              {/* Text is placed on the left, taking up all remaining space with "flex-1". */}
              <span className='flex-1'>{action.action}</span>

              {/* Right side holds icons and dropdown menu. */}
              <div className='flex items-center space-x-4'>
                {/* Show resolved icon if action.completed is true. */}
                {action.completed && (
                  <CheckCircle2 size={18} className='text-green-600' />
                )}

                {/* Show gratitude sent icon with tooltip */}
                {action.gratitudeSent && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='relative inline-flex items-center cursor-pointer'>
                        <MessageCircleHeart
                          size={18}
                          className='text-pink-500'
                        />
                        {/* Small dot indicator */}
                        <span className="absolute top-0 right-0 block w-2 h-2 bg-pink-500 border border-white rounded-full"></span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='p-2 bg-black text-white rounded max-w-xs'>
                      <div className="text-center">
                        <p className="font-semibold mb-1">Gratitude Sent</p>
                        {action.gratitudeSentDate && (
                          <p className="text-xs opacity-80">
                            {new Date(action.gratitudeSentDate).toLocaleDateString()}
                          </p>
                        )}
                        {action.gratitudeMessage && (
                          <p className="text-xs italic mt-1 max-w-xs break-words">
                            "{action.gratitudeMessage}"
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Show due date if present. */}
                {dueDateText && (
                  <span className='text-sm text-gray-500'>
                    Due: {dueDateText}
                  </span>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={18} className='text-gray-500' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => handleStartEdit(action)}>
                      <Edit2 className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => confirmDeleteAction(action.id)}
                      className='text-red-600'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onToggleResolved && onToggleResolved(action.id)
                      }
                    >
                      {action.completed ? (
                        <>
                          <XCircle className='mr-2 h-4 w-4' />
                          Unresolve
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className='mr-2 h-4 w-4' />
                          Mark as resolved
                        </>
                      )}
                    </DropdownMenuItem>

                    {/* Only hide gratitude option for actions that already had gratitude sent */}
                    {!action.gratitudeSent && (
                      <>
                        <DropdownMenuSeparator />
                        {/* Determine if manager email is set */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full">
                              <DropdownMenuItem
                                onClick={() => {
                                  if (hasManagerEmail) {
                                    setGratitudeModal({ isOpen: true, action });
                                  }
                                }}
                                className={`${hasManagerEmail ? 'text-pink-600' : 'text-pink-300 cursor-not-allowed'}`}
                                disabled={!hasManagerEmail}
                              >
                                <Heart className='mr-2 h-4 w-4' />
                                Send gratitude
                              </DropdownMenuItem>
                            </div>
                          </TooltipTrigger>
                          {!hasManagerEmail && (
                            <TooltipContent className='p-2 bg-black text-white rounded'>
                              Manager's email is required to send gratitude
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        } else {
          // Editing mode remains unchanged
          return (
            <ActionForm
              key={action.id}
              initialText={action.action}
              initialDueDate={action.byDate || ''}
              onSave={(data) => handleSaveEdit(action.id, data)}
              onCancel={handleCancelEdit}
            />
          );
        }
      })}
      {!isAddingNew ? (
        <div
          className='cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 p-2 rounded transition-colors'
          onClick={handleStartAdd}
        >
          <span className='flex-1'>+ Add Action</span>
        </div>
      ) : (
        <ActionForm onSave={handleSaveNew} onCancel={handleCancelNew} />
      )}
      {actionDeleteConfirmation.isOpen && (
        <ConfirmationDialog
          isOpen={actionDeleteConfirmation.isOpen}
          onClose={handleCancelDeleteAction}
          onConfirm={handleConfirmDeleteAction}
          title='Delete Action'
          description='Are you sure you want to delete this action? This action cannot be undone.'
        />
      )}

      {/* Gratitude Modal */}
      {gratitudeModal.isOpen && gratitudeModal.action && (
        <GratitudeModal
          onClose={() => setGratitudeModal({ isOpen: false, action: null })}
          statementId={statementId}
          action={gratitudeModal.action}
          onGratitudeSent={async (stmtId, actionId, message) => {
            try {
              // Call the API to mark gratitude as sent
              await markGratitudeSent(stmtId, actionId, message);

              // Update local state via the parent component
              if (onGratitudeSent) {
                onGratitudeSent(actionId, message);
              }

              // Close the modal
              setGratitudeModal({ isOpen: false, action: null });
            } catch (error) {
              console.error('Error marking gratitude as sent:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default ActionLine;
