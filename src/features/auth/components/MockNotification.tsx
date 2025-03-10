import React, { useState, useEffect } from 'react';
import { AlertCircle, Mail, CheckCircle, X } from 'lucide-react';

// Simple mock notification component to show auth events during testing
export const MockNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'email' | 'click' | 'error';
    message: string;
    detail?: string;
  }>>([]);

  useEffect(() => {
    // Listen for mock email sent events
    const handleMockEmail = (e: CustomEvent) => {
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'email',
          message: `Magic link sent to ${e.detail.email}`,
          detail: `${e.detail.mockLink}`
        }
      ]);
    };

    // Listen for mock link clicked events
    const handleMockClick = () => {
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'click',
          message: 'Magic link clicked',
        }
      ]);
    };

    // Add event listeners
    window.addEventListener('mockMagicLinkSent', handleMockEmail as EventListener);
    window.addEventListener('mockMagicLinkClicked', handleMockClick);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mockMagicLinkSent', handleMockEmail as EventListener);
      window.removeEventListener('mockMagicLinkClicked', handleMockClick);
    };
  }, []);

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`rounded-lg p-4 shadow-lg flex items-start gap-3 ${
            notification.type === 'error' 
              ? 'bg-red-100 text-red-800' 
              : notification.type === 'email'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {notification.type === 'error' && <AlertCircle size={18} />}
            {notification.type === 'email' && <Mail size={18} />}
            {notification.type === 'click' && <CheckCircle size={18} />}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">MOCK: {notification.message}</p>
            {notification.detail && (
              <p className="text-xs mt-1 opacity-80 font-mono">{notification.detail}</p>
            )}
          </div>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MockNotification;