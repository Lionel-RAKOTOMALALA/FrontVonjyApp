import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../store/userStore"; // Import du store utilisateur
import SplashScreen from "./SplashScreen";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, fetchUser, loading, accessToken } = useUserStore(); // Récupération des données et actions du store
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(false);

  useEffect(() => {
    // Si l'utilisateur n'est pas encore chargé et qu'un token est présent, on appelle fetchUser
    if (!user && accessToken) {
      fetchUser();
    }

    // Met en place un délai de 5 minutes avant d'afficher l'écran de chargement
    const timer = setTimeout(() => {
      setIsLoadingDelayed(true);
    }, 500); // 5 minutes en millisecondes

    // Nettoyage du timer lors du démontage du composant
    return () => clearTimeout(timer);
  }, [user, accessToken, fetchUser]);

  console.log('ROLE IN PROTECTED ROUTE');
  console.log(user?.role);
  console.log('====================================');

  // Affiche un écran de chargement pendant 5 minutes si l'utilisateur est encore en chargement
  if (loading || !isLoadingDelayed) {
    return (<div><SplashScreen /></div>);
  }

  // Si l'utilisateur n'a pas le rôle approprié, redirige en conséquence
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={user?.role === "simple" ? "/map" : "/users"} />;
  }

  return children;
};

export default ProtectedRoute;
