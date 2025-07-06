import './index.css';
import  { useEffect } from 'react';
import MainWrapper from './layouts/MainWrapper';
import { useLocation } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import { Blank } from "./layouts/Blank";  
import { useAuthStore } from './store/auth';

function App() {
  const location = useLocation();
  const isAuthPath = location.pathname.includes("auth") || location.pathname.includes("error") || location.pathname.includes("under-maintenance") | location.pathname.includes("blank");

  const { user, isLoggedIn } = useAuthStore(state => ({
    user: state.user(),
    isLoggedIn: state.isLoggedIn(),
  })); 

  useEffect(() => {

    initializeAuth();
  }, [ isAuthPath]);
  return (
  <MainWrapper>
    {isAuthPath ? (
      <AppRoutes user={user} isLoggedIn={isLoggedIn}>
        <Blank/>
      </AppRoutes>
    ) : (
    //  isLoggedIn ? (
          <AppRoutes user={user} isLoggedIn={isLoggedIn} />
   //   ) : (
    //    <Navigate to="/auth/login" />
   //   )
    )}
  </MainWrapper>

  );
}

export default App;