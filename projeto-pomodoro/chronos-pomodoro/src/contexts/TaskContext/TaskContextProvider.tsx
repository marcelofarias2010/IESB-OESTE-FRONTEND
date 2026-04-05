import { useReducer, useState } from 'react';
import { TaskContext } from '.';
import { initialTaskState } from './initialTaskState';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, setState] = useState(initialTaskState);

  type ActionType = {
    type: string;
    payload?: number;
  };

  const [myState, dispatch] = useReducer(
    (state, action: ActionType) => {
      console.log(state, action);
      switch (action.type) {
        case 'INCREMENT': {
          if (!action.payload) return state;

          return {
            ...state,
            secondsRemaing: state.secondsRemaing + action.payload,
          };
        }
        case 'DECREMENT': {
          if (!action.payload) return state;

          return {
            ...state,
            secondsRemaing: state.secondsRemaing - action.payload,
          };
        }
        case 'RESET': {
          return {
            secondsRemaing: 0,
          };
        }
      }

      return state; // estado atual (não altera)
    },
    {
      secondsRemaing: 0,
    },
  );
  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  return (
    <TaskContext.Provider value={{ state, setState }}>
      <h1>O estado é: {JSON.stringify(myState)}</h1>
      <button onClick={() => dispatch({ type: 'INCREMENT', payload: 10 })}>
        Incrementar +10
      </button>
      <button onClick={() => dispatch({ type: 'INCREMENT', payload: 20 })}>
        Incrementar +20
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT', payload: 50 })}>
        Decrementar -50
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>RESET</button>
    </TaskContext.Provider>
  );
}
