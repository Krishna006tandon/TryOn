import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import AuthWrapper from './components/AuthWrapper.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

