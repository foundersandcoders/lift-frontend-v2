'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';
import subjects from '../../../data/subjects.json';

interface SubjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onAddDescriptor: (descriptor: string) => void;
  username: string;
}

interface SubjectOption {
  label: string;
  value: string;
  user: string;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  value,
  onChange,
  onAddDescriptor,
  username,
}) => {
  const [open, setOpen] = React.useState(false);
  const [newDescriptor, setNewDescriptor] = React.useState('');
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [localSubjects, setLocalSubjects] = React.useState(subjects);

  const userSubject = localSubjects.find(
    (subject) => subject.subject === username
  );
  const userDescriptors = userSubject?.descriptors || [];
  const options: SubjectOption[] = [
    { label: username, value: username, user: username },
    ...userDescriptors.map((descriptor) => ({
      label: `${username}'s ${descriptor}`,
      value: `${username}'s ${descriptor}`,
      user: username,
    })),
  ];

  const handleAddNewDescriptor = () => {
    if (newDescriptor) {
      onAddDescriptor(newDescriptor);
      setLocalSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject.subject === username
            ? {
                ...subject,
                descriptors: [...subject.descriptors, newDescriptor],
              }
            : subject
        )
      );
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
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Search descriptors...' />
          <CommandList>
            <CommandEmpty>No descriptor found.</CommandEmpty>
            <CommandGroup heading={username}>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandItem
            onSelect={() => setIsAddingNew(true)}
            className='text-sm text-muted-foreground'
          >
            <Plus className='mr-2 h-4 w-4' />
            {`${options[0].user}'s...`}
          </CommandItem>
        </Command>
        {isAddingNew && (
          <div className='p-2 border-t'>
            <div className='flex items-center space-x-2'>
              <Input
                value={newDescriptor}
                onChange={(e) => setNewDescriptor(e.target.value)}
                placeholder={`Add new descriptor for ${options[0].user}`}
                className='flex-grow'
              />
              <Button onClick={handleAddNewDescriptor} size='sm'>
                Add
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SubjectSelector;
