import { useEffect, useState } from 'react';
import { getCurrentUser } from '../utils/auth';


const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const handler = async () => {
            setLoading(true);
            const user = await getCurrentUser(); 
            setLoading(false);
        };
        handler();
    }, []);

    return <>{loading ? null : children}</>;
};

export default MainWrapper;
