import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Notification } from '../../types';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  return (
    <div
      className={`
        max-w-sm w-full border rounded-lg shadow-lg p-4 mb-3
        transform transition-all duration-300 ease-in-out
        animate-slide-in-right
        ${getStyles()}
      `}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          {getIcon()}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{notification.message}</p>
          {notification.timestamp && (
            <p className="mt-1 text-xs opacity-75">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onRemove(notification.id)}
            className={`
              inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
              hover:bg-white/20 transition-colors
              ${getIconColor()}
            `}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { state, dispatch } = useApp();

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  if (state.notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
