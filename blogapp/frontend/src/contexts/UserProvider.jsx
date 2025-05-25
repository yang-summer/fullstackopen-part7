import { useReducer } from 'react';
import PropTypes from 'prop-types';
import { initialUserState, userReducer } from '../reducers/userReducer';
import { UserContext, UserDispatchContext } from './userContext';

export function UserProdiver({ children }) {
  const [user, dispatch] = useReducer(userReducer, initialUserState);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

UserProdiver.propTypes = {
  children: PropTypes.element,
};
