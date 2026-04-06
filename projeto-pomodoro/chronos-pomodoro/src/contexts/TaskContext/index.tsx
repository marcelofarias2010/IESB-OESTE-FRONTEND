import { useContext } from 'react';
import { TaskContext } from './TaskContext';

export { TaskContext } from './TaskContext';
export { TaskContextProvider } from './TaskContextProvider';

export function useTaskContext() {
  return useContext(TaskContext);
}
