import { useContext, useRef } from 'react';
import { NotificationDispatchContext } from '../contexts/notificationContext';

export function useNotify() {
  const dispatch = useContext(NotificationDispatchContext);
  const notificationTimerRef = useRef(null); // ✅ 使用 useRef 替代模块级变量

  return (payload, duration = 5000) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    dispatch({ type: 'SET', payload });

    if (duration > 0) {
      // 允许 duration <= 0 的通知不自动消失
      notificationTimerRef.current = setTimeout(() => {
        dispatch({ type: 'CLEAR' });
        notificationTimerRef.current = null; // 清理 ref
      }, duration);
    }
  };
}
