import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Search } from './components/Search';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isRegistering, setIsRegistering] = useState(false);

  if (isAuthenticated) {
    return <Search />;
  }

  return (
    <>
      {isRegistering ? (
        <Register onSwitch={() => setIsRegistering(false)} />
      ) : (
        <Login onSwitch={() => setIsRegistering(true)} />
      )}
    </>
  );
}

export default App;