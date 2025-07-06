import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { DashboardPage } from "../views/DashboardPage"; 
import Layout from "../layouts/Layout"; 
import { useEffect } from 'react';

const Home = () => {
    const [isLoggedIn, user] = useAuthStore((state) => [
      state.isLoggedIn,
      state.user,
    ]);
  
    return (
        <div>
            {isLoggedIn() ? (
            <LoggedInView user={user()} />
            ) : (
            <LoggedOutView />
            )}
        </div>
        );
    };
  
  const LoggedInView = ({ user }) => { 
    return (
      <Layout user={user}>
        <DashboardPage user={user} />
      </Layout>
    );
  };

export const LoggedOutView = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/login');
    }, [navigate]);

    return null;
};

export default Home;
