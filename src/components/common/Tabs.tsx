import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  return (
    <div className="w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === TabsContent) {
            return React.cloneElement(child, {
              hidden: child.props.value !== value,
            });
          }
          if (child.type === TabsList) {
            return React.cloneElement(child, {
              selectedValue: value,
              onValueChange,
            });
          }
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps & { selectedValue?: string; onValueChange?: (value: string) => void }> = ({
  className = '',
  children,
  selectedValue,
  onValueChange,
}) => {
  return (
    <div className={`flex space-x-2 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child, {
            isSelected: child.props.value === selectedValue,
            onClick: () => onValueChange?.(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps & { isSelected?: boolean; onClick?: () => void }> = ({
  value,
  children,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none ${
        isSelected
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps & { hidden?: boolean }> = ({ value, children, hidden }) => {
  if (hidden) return null;
  return <div className="py-4">{children}</div>;
};
