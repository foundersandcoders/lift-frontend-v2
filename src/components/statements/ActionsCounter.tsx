import React from 'react';

/**
 * Props:
 * - count: The total number of actions.
 * - expanded?: whether the actions are expanded (to style differently).
 *
 * Behavior:
 * - Displays a small pill with "no actions" if count is 0,
 *   or "1 action" if count is 1, or "X actions" otherwise.
 */
interface ActionsCounterProps {
  count: number;
  expanded?: boolean;
}

const ActionsCounter: React.FC<ActionsCounterProps> = ({
  count,
  expanded = false,
}) => {
  const baseClasses =
    'inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors cursor-pointer';
  const normalClasses = 'bg-gray-100 text-gray-600';
  const expandedClasses = 'bg-blue-100 text-blue-600';

  const displayText =
    count === 0
      ? 'no actions'
      : `${count} ${count === 1 ? 'action' : 'actions'}`;

  return (
    <span
      className={`${baseClasses} ${expanded ? expandedClasses : normalClasses}`}
    >
      {displayText}
    </span>
  );
};

export default ActionsCounter;
