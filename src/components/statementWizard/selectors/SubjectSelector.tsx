import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Input } from '../../ui/input';
import descriptorsData from '../../../../data/descriptors.json';

interface SubjectOption {
  label: string;
  value: string;
}

interface SubjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onAddDescriptor: (descriptor: string) => void;
  username: string;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  value,
  onChange,
  onAddDescriptor,
  username,
}) => {
  const subjectTiles: SubjectOption[] = useMemo(() => {
    const baseOption = { label: username, value: username };
    const descriptorOptions = descriptorsData.descriptors.flatMap(
      (descriptor) =>
        descriptor.options.map((option) => ({
          label: `${username}'s ${option}`,
          value: `${username}'s ${option}`,
        }))
    );
    return [baseOption, ...descriptorOptions];
  }, [username]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDescriptor, setNewDescriptor] = useState('');

  const options = useMemo(() => {
    return subjectTiles.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [subjectTiles, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          {value || username}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-4'>
        {/* Search Input */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search descriptors...'
          className='mb-4'
        />
        {/* Options List */}
        <ul className='max-h-60 overflow-y-auto'>
          {options.map((option) => {
            // Log each option's value, the current selected value, and the comparison result.
            console.log(
              'Rendering option:',
              option.value,
              'Current value:',
              value,
              'Selected:',
              option.value === value
            );
            return (
              <li key={option.value}>
                <button
                  onClick={() => {
                    console.log('Option clicked:', option.value);
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center px-2 py-2 hover:bg-gray-100 rounded',
                    { 'bg-red-200': option.value === value } // Selected background
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 transition-opacity',
                      option.value === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Optionally, code for adding a new descriptor */}
        <button
          onClick={() => setIsAddingNew(true)}
          className='mt-4 flex w-full items-center text-sm text-muted-foreground hover:bg-gray-100 px-2 py-2 rounded'
        >
          <Plus className='mr-2 h-4 w-4' />
          {`${username}'s...`}
        </button>
        {isAddingNew && (
          <div className='mt-4 border-t pt-2'>
            <Input
              value={newDescriptor}
              onChange={(e) => setNewDescriptor(e.target.value)}
              placeholder={`Add new descriptor for ${username}`}
              className='mb-2'
            />
            <Button
              onClick={() => {
                if (newDescriptor.trim()) {
                  onAddDescriptor(newDescriptor);
                  onChange(`${username}'s ${newDescriptor}`);
                  setNewDescriptor('');
                  setIsAddingNew(false);
                  setOpen(false);
                }
              }}
              size='sm'
            >
              Add
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SubjectSelector;
