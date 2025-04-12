import { Route, Routes, Navigate } from "react-router-dom"; 
import { DashboardPage } from "../views/DashboardPage";  
import Login from '../views/authentication'; 
import Profile from '../views/account/profile';
import Security from '../views/account/security';
import Logout from '../views/logout';
import NotFound from '../views/misc/notfound';
import Layout from "../layouts/Layout";
import PrivateRoute from "../layouts/PrivateRoute"; 
import Chauffeur from '../views/dashboard/chauffeur/ChauffeurViews';
import Commune from '../views/dashboard/commune/CommuneViews';
import Fokontany from '../views/dashboard/fokontany/FokontanyViews';
import Responsable from '../views/dashboard/responsable/ResponsableViews';
import Service from '../views/dashboard/service/ServiceViews';
import ChefService from '../views/dashboard/chef-service/ChefServiceViews';
import Map from '../views/map/MapViews'; 

import Composant from '../views/userInterface';

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
            <Route path="/responsable" element={<Layout user={user}><Responsable user={user}/></Layout>}/>
            <Route path="/service" element={<Layout user={user}><Service user={user}/></Layout>}/>
            <Route path="/chef-service" element={<Layout user={user}><ChefService user={user}/></Layout>}/>
            <Route path="/composant" element={<Layout user={user}><Composant user={user}/></Layout>}/>

            <Route path="/map" element={<Map />}/> 


            <Route path="/auth/login" element={isLoggedIn ? <Navigate to="/" />: <Login /> } />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
export default AppRoutes; 