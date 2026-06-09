// src/pages/History/index.tsx

import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState, useCallback } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { showMessage } from '../../adapters/showMessage';
import { fetchTasks, clearTasks, type ApiTask } from '../../services/api';

export function History() {
  const { state, dispatch } = useTaskContext();
  const [isLoading, setIsLoading] = useState(true);
  const hasTasks = state.tasks.length > 0;

  const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>({
    tasks: sortTasks({ tasks: state.tasks }),
    field: 'startDate',
    direction: 'desc',
  });

  // Carrega tasks da API ao abrir o histórico
  useEffect(() => {
    document.title = 'Histórico - Chronos Pomodoro';

    fetchTasks()
      .then((apiTasks: ApiTask[]) => {
        const convertedTasks = apiTasks.map((t: ApiTask) => ({
          id: t.id,
          name: t.name,
          duration: t.duration,
          type: t.type,
          startDate: new Date(t.startDate),
          completeDate: t.completeDate ? new Date(t.completeDate) : undefined,
          interruptDate: t.interruptDate ? new Date(t.interruptDate) : undefined,
        }));

        dispatch({
          type: TaskActionTypes.LOAD_TASKS,
          payload: { tasks: convertedTasks },
        });
      })
      .catch(() => {
        showMessage.error('Não foi possível carregar o histórico da API.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    setSortTaskOptions(prevState => ({
      ...prevState,
      tasks: sortTasks({
        tasks: state.tasks,
        direction: prevState.direction,
        field: prevState.field,
      }),
    }));
  }, [state.tasks]);

  useEffect(() => {
    return () => {
      showMessage.dismiss();
    };
  }, []);

  const handleClearHistory = useCallback(() => {
    clearTasks()
      .then(() => {
        dispatch({ type: TaskActionTypes.RESET_STATE });
        showMessage.success('Histórico apagado com sucesso');
      })
      .catch(() => {
        showMessage.error('Erro ao apagar histórico na API.');
      });
  }, [dispatch]);

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';
    setSortTaskOptions({
      tasks: sortTasks({
        direction: newDirection,
        tasks: sortTasksOptions.tasks,
        field,
      }),
      direction: newDirection,
      field,
    });
  }

  function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm('Tem certeza?', confirmation => {
      if (confirmation) handleClearHistory();
    });
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          {hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton
                icon={<TrashIcon />}
                color='red'
                aria-label='Apagar todo o histórico'
                title='Apagar histórico'
                onClick={handleResetHistory}
              />
            </span>
          )}
        </Heading>
      </Container>

      <Container>
        {isLoading && (
          <p style={{ textAlign: 'center' }}>Carregando histórico...</p>
        )}

        {!isLoading && hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortTasks({ field: 'name' })} className={styles.thSort}>Tarefa ↕</th>
                  <th onClick={() => handleSortTasks({ field: 'duration' })} className={styles.thSort}>Duração ↕</th>
                  <th onClick={() => handleSortTasks({ field: 'startDate' })} className={styles.thSort}>Data ↕</th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {sortTasksOptions.tasks.map(task => {
                  const taskTypeDictionary = {
                    workTime: 'Foco',
                    shortBreakTime: 'Descanso curto',
                    longBreakTime: 'Descanso longo',
                  };
                  return (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.duration}min</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{getTaskStatus(task, state.activeTask)}</td>
                      <td>{taskTypeDictionary[task.type]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !hasTasks && (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}
