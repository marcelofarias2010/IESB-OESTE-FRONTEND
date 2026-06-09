import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import { AuthProvider } from './contexts/AuthContext';
import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <AuthProvider>
      <TaskContextProvider>
        <MessagesContainer>
          <MainRouter />
        </MessagesContainer>
      </TaskContextProvider>
    </AuthProvider>
  );
}