import './index.css';
import MainWrapper from './layouts/MainWrapper';
import { useLocation } from "react-router-dom";
import { useAuthStore } from './store/auth'; 
import AppRoutes from "./router/AppRoutes";
import { Blank } from "./layouts/Blank";  
import TokenTimer from './utils/tokenTimer';

function App() {
  const location = useLocation();
  const isAuthPath = location.pathname.includes("auth") || location.pathname.includes("error") || location.pathname.includes("under-maintenance") | location.pathname.includes("blank");

  const { user, isLoggedIn } = useAuthStore(state => ({
    user: state.user(),
    isLoggedIn: state.isLoggedIn(),
  })); 

  return (
    <MainWrapper>
      {/* TokenTimer affichera et suivra la durée restante du token */}
      <TokenTimer />

      {isAuthPath ? (
        <AppRoutes user={user} isLoggedIn={isLoggedIn}>
          <Blank />
        </AppRoutes>
      ) : (
        <AppRoutes user={user} isLoggedIn={isLoggedIn} />
      )}
    </MainWrapper>
  );
}

export default App;
