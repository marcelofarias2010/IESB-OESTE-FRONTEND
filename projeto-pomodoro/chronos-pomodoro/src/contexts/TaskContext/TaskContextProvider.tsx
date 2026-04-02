import { useReducer, useState } from 'react';
import { TaskContext } from '.';
import { initialTaskState } from './initialTaskState';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, setState] = useState(initialTaskState);

  const [numero, dispatch] = useReducer((state, action) => {
    console.log(state, action);

    switch (action) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      case 'INITIAL_STATE':
        return 0;
    }

    return state; // estado atual (não altera)
  }, 0);

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  return (
    <TaskContext.Provider value={{ state, setState }}>
      <h1>O número é: {numero}</h1>
      <button onClick={() => dispatch('INCREMENT')}>Incrementar</button>
      <button onClick={() => dispatch('DECREMENT')}>Decrementar</button>
      <button onClick={() => dispatch('INITIAL_STATE')}>ZERAR</button>
    </TaskContext.Provider>
  );
}
