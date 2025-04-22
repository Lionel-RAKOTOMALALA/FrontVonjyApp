import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import useUserStore from "../store/userStore"; // Import du store utilisateur

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, fetchUser, loading, accessToken } = useUserStore(); // Récupération des données et actions du store

  useEffect(() => {
    // Si l'utilisateur n'est pas encore chargé et qu'un token est présent, on appelle fetchUser
    if (!user && accessToken) {
      fetchUser();
    }
  }, [user, accessToken, fetchUser]);

  console.log('ROLE IN PROTECTED ROUTE');
  console.log(user?.role);
  console.log('====================================');

  // Affiche un écran de chargement pendant que les données utilisateur sont récupérées
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si l'utilisateur n'a pas le rôle approprié, redirige en conséquence
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={user?.role === "simple" ? "/map" : "/commune"} />;
  }

  return children;
};

export default ProtectedRoute;