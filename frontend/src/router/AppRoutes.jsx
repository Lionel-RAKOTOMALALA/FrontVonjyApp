import { Route, Routes, Navigate } from "react-router-dom"; 
import { DashboardPage } from "../views/DashboardPage";  
import Login from '../views/authentication/login';
import Register from '../views/authentication/register';
import Profile from '../views/account/profile';
import Security from '../views/account/security';
import Logout from '../views/logout';
import NotFound from '../views/misc/notfound';
import Layout from "../layouts/Layout";
import PrivateRoute from "../layouts/PrivateRoute"; 
import Chauffeur from '../views/dashboard/chauffeur/ChauffeurViews';
import Commune from '../views/dashboard/commune/CommuneViews';
import Fokontany from '../views/dashboard/fokontany/FokontanyViews';
import Service from '../views/dashboard/service/ServiceViews';
import ChefService from '../views/dashboard/chef-service/ChefServiceViews';
import Map from '../views/map/MapViews';

import { WithoutMenuPage } from "../pages/layouts/WithoutMenuPage";

const AppRoutes = ({user, isLoggedIn}) => { 
 
    return (
        <Routes> 
            <Route path="/" element={
                <PrivateRoute>
                    <Layout user={user}>
                        <DashboardPage user={user} />
                    </Layout>
                </PrivateRoute>}/>
            <Route path="/account/profile" element={<Profile user={user}/>}/>
            <Route path="/account/security" element={<Security user={user}/>}/>
 
            <Route path="/chauffeur" element={<Layout user={user}><Chauffeur user={user}/></Layout>}/>
            <Route path="/commune" element={<Layout user={user}><Commune user={user}/></Layout>}/>
            <Route path="/fokontany" element={<Layout user={user}><Fokontany user={user}/></Layout>}/>
            <Route path="/service" element={<Layout user={user}><Service user={user}/></Layout>}/>
            <Route path="/chef-service" element={<Layout user={user}><ChefService user={user}/></Layout>}/>

            <Route path="/map" element={<Layout><Map /></Layout>}/>


            <Route path="/auth/login" element={isLoggedIn ? <Navigate to="/" />: <Login /> } />
            <Route path="/auth/register" element={isLoggedIn ? <Navigate to="/" />: <Register /> } />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
export default AppRoutes; 