export const initialUserState = null;

export function userReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      return action.payload.user;
    }
    case 'LOGOUT': {
      return null;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
