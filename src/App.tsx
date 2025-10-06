import { Toaster } from 'sonner';
import LoginForm from './pages/auth/login';

function App() {
  return (
    <>
      <LoginForm />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
