import { Route, Routes, Navigate } from "react-router-dom";
import Login from '../views/authentication';
import Logout from '../views/logout';
import NotFound from '../views/misc/notfound';
import Layout from "../layouts/Layout";
import PrivateRoute from "../layouts/PrivateRoute";
import ProtectedRoute from "../layouts/ProtectedRoute";
import Commune from '../views/dashboard/commune/CommuneViews';
import Fokontany from '../views/dashboard/fokontany/FokontanyViews';
import Responsable from '../views/dashboard/responsable/ResponsableViews';
import Service from '../views/dashboard/service/ServiceViews';
import ChefService from '../views/dashboard/chef-service/ChefServiceViews';
import User from '../views/dashboard/user/UserViews';
import Annuaire from '../views/dashboard/annuaire/AnnuaireViews';

import Acteur from '../views/dashboard/acteur/ActeurViews';
import Client from '../views/client/Index';

const AppRoutes = () => {
    const isLoggedIn = localStorage.getItem("access_token"); // Vérifie si l'utilisateur est connecté

    return (
        <Routes>
            <Route path="/" element={
                isLoggedIn
                    ? <Navigate to="/annuaire" replace />
                    : <Navigate to="/auth/login" replace />
            } />
            {/* Routes pour les rôles "super" */}
            <Route path="/commune" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Layout>
                            <Commune />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />
            <Route path="/fokontany" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Layout>
                            <Fokontany />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />
            <Route path="/responsable" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Layout>
                            <Responsable />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />
            <Route path="/service" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Layout>
                            <Service />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />
            <Route path="/chef-service" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Layout>
                            <ChefService />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />
            <Route path="/acteur" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Layout>
                            <Acteur />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />
            <Route path="/users" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super"]}>
                        <Layout>
                            <User />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />
            <Route path="/annuaire" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Layout>
                            <Annuaire />
                        </Layout>
                    </ProtectedRoute>
                </PrivateRoute>
            } />

            {/* Route pour les rôles "simple" */}
            <Route path="/map" element={
                <PrivateRoute>
                    <ProtectedRoute allowedRoles={["super", "simple"]}>
                        <Client />
                    </ProtectedRoute>
                </PrivateRoute>
            } />

            {/* Route de connexion accessible uniquement aux utilisateurs non connectés */}
            <Route path="/auth/login" element={
                isLoggedIn
                    ? <Navigate to="/commune" replace /> // Redirection si connecté
                    : <Login /> // Page de connexion si non connecté
            } />

            {/* Route de déconnexion */}
            <Route path="/logout" element={<Logout />} />

            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;