import { AuthProvider } from './contexts/AuthContext/AuthProvider';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <AuthProvider>
      <MessagesContainer>
        <MainRouter />
      </MessagesContainer>
    </AuthProvider>
  );
}
