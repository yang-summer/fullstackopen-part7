export const initialNotificationState = { type: null, content: null };

export function notificationReducer(state, action) {
  switch (action.type) {
    case 'SET': {
      return {
        type: action.payload.type,
        content: action.payload.content,
      };
    }
    case 'CLEAR': {
      return {
        ...state,
        content: null,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
