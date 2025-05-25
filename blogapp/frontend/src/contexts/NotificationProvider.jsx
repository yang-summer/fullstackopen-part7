import { useReducer } from 'react';
import PropTypes from 'prop-types';
import { NotificationContext, NotificationDispatchContext } from './notificationContext';
import { notificationReducer, initialNotificationState } from '../reducers/notificationReducer';

export function NotificationProdiver({ children }) {
  const [notification, dispatch] = useReducer(notificationReducer, initialNotificationState);

  return (
    <NotificationContext.Provider value={notification}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}

NotificationProdiver.propTypes = {
  children: PropTypes.element,
};
