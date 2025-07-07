import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LoadingBar from 'react-top-loading-bar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, user }) => {
  const [, setIsLoading] = useState(true);
  const [, setShowContent] = useState(false);
  const loadingBarRef = useRef(null);


  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  useEffect(() => {
    // Main();

    const currentLoadingBar = loadingBarRef.current;

    const handleLoading = async () => {
      setIsLoading(true);
      currentLoadingBar?.continuousStart();

      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoading(false);
      currentLoadingBar?.complete();
      setShowContent(true);
    };

    handleLoading();

    return () => {
      currentLoadingBar?.complete();
    };
  }, []);


  return (
    <div className="layout-wrapper layout-content-navbar">
      <LoadingBar color="#696CFF" height={4} ref={loadingBarRef} />
      <div className="layout-container">
        {/* Afficher la Sidebar sauf sur /map */}
        {!isMapPage && <Sidebar />}

        <div
          className="layout-page"
          style={{ paddingLeft: isMapPage ? 0 : undefined }} // Padding conditionnel
        >
          <Navbar user={user} />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {children}
            </div>
          </div>
        </div>

        <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </div>
  );

};

export default Layout;
