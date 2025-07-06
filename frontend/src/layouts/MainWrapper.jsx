import { useEffect, useState } from 'react';


const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const handler = async () => {
            setLoading(true);
            setLoading(false);
        };
        handler();
    }, []);

    return <>{loading ? null : children}</>;
};

export default MainWrapper;
