import { Navigate } from "react-router-dom";
import useUserStore from "../store/userStore"; // Import du store utilisateur

const PrivateRoute = ({ children }) => {
  const { accessToken } = useUserStore();

  // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
  if (!accessToken) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default PrivateRoute;