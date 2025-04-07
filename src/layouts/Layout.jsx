import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingBar from 'react-top-loading-bar';
import { useSpring, animated } from '@react-spring/web';

const Layout = ({ children, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const loadingBarRef = useRef(null);

  const props = useSpring({
    opacity: showContent ? 1 : 0,
    config: { duration: 250 },
  });

  useEffect(() => {
    Main();
    const handleLoading = async () => {
      setIsLoading(true);
      loadingBarRef.current.continuousStart();

      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoading(false);
      loadingBarRef.current.complete();
      setShowContent(true);
    };

    handleLoading();

    // Clean up loading bar state on unmount
    return () => {
      loadingBarRef.current?.complete();
    };
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <LoadingBar color="#696CFF" height={4} ref={loadingBarRef} />
      <div className="layout-container">
        <Sidebar />
        <div className="layout-page">
          <Navbar user={user} />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {/* <animated.div style={props}> */}
                {  children}
              {/* </animated.div> */}
            </div>
            {/* <Footer /> */}
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </div>
  );
};

export default Layout;
