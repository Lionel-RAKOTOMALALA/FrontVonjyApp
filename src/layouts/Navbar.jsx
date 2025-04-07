// Navbar.jsx
import { Link } from 'react-router-dom'; 

const Navbar = ({ user }) => {
  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a aria-label='toggle for sidebar' className="nav-item nav-link px-0 me-xl-4" href="#">
          <i className="bx bx-menu bx-sm"></i>
        </a>
      </div>

      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse"> 
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a aria-label='dropdown profile avatar' className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
              <div className="avatar avatar-online">
                <img src="../assets/img/avatars/1.png" className="w-px-40 h-auto rounded-circle" alt="avatar-image" aria-label='Avatar Image' />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a aria-label='go to profile' className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img src="../assets/img/avatars/1.png" className="w-px-40 h-auto rounded-circle" alt='avatar-image' aria-label='Avatar Image' />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-medium d-block">a</span>
                      <small className="text-muted">Admin</small>
                    </div>
                  </div>
                </a>
              </li> 
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <Link to={"/logout"} className="dropdown-item" >
                  <i className="bx bx-power-off me-2"></i> 
                    <span className="align-middle">Log Out</span> 
                </Link> 
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
 