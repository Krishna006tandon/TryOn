import { AuthProvider } from './contexts/AuthContext.jsx';
import AuthWrapper from './components/AuthWrapper.jsx';

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;

