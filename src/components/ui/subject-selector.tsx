import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';
import descriptorsData from '../../../data/descriptors.json';
import type { DescriptorsData } from '../../../types/statements';

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
  // Build the subject options using the entered name and descriptors from descriptors.json.
  const subjectTiles: SubjectOption[] = useMemo(() => {
    const data = descriptorsData as DescriptorsData;
    const baseOption = { label: username, value: username };
    const descriptorOptions = data.descriptors.map((descriptor) => ({
      label: `${username}'s ${descriptor}`,
      value: `${username}'s ${descriptor}`,
    }));
    return [baseOption, ...descriptorOptions];
  }, [username]);

  // Local state for search, popover open state, and adding a new descriptor.
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDescriptor, setNewDescriptor] = useState('');

  // Filter the options based on the search text.
  const options = useMemo(() => {
    return subjectTiles.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [subjectTiles, search]);

  const handleAddNewDescriptor = () => {
    if (newDescriptor.trim()) {
      onAddDescriptor(newDescriptor);
      onChange(`${username}'s ${newDescriptor}`);
      setNewDescriptor('');
      setIsAddingNew(false);
      setOpen(false);
    }
  };

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
          {options.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => {
                  console.log('Option clicked:', option.value);
                  onChange(option.value === value ? '' : option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center px-2 py-2 hover:bg-gray-100 rounded',
                  { 'bg-gray-100': option.value === value }
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
          ))}
        </ul>

        {/* Add New Descriptor Button */}
        <button
          onClick={() => {
            console.log('Add new clicked');
            setIsAddingNew(true);
          }}
          className='mt-4 flex w-full items-center text-sm text-muted-foreground hover:bg-gray-100 px-2 py-2 rounded'
        >
          <Plus className='mr-2 h-4 w-4' />
          {`${username}'s...`}
        </button>

        {/* New Descriptor Input */}
        {isAddingNew && (
          <div className='mt-4 border-t pt-2'>
            <Input
              value={newDescriptor}
              onChange={(e) => setNewDescriptor(e.target.value)}
              placeholder={`Add new descriptor for ${username}`}
              className='mb-2'
            />
            <Button onClick={handleAddNewDescriptor} size='sm'>
              Add
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SubjectSelector;
