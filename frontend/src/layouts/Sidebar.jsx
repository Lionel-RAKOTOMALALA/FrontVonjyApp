import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import menuData from '../data/menuData.json'
import VonjyLogo from '../assets/VonjyLogo.svg';
import { Avatar } from '@mui/material';
import useUserStore from '../store/userStore'; // Import du store utilisateur

const Sidebar = () => {
    const { logout } = useUserStore(); // Récupération de la fonction logout depuis le store
    const navigate = useNavigate(); // Hook pour la navigation

    const handleLogout = async () => {
        await logout(); // Appeler la fonction logout du store
        navigate('/auth/login'); // Rediriger vers la page de connexion 
    };
 
    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
                <span className="app-brand-logo demo">
                    <img src={VonjyLogo} width="78useUserStorepx" alt="sneat-logo" aria-label='Sneat logo image' />
                </span>
            </div>

            <div className="menu-inner-shadow"></div>
            <div className='px-3 mx-3 rounded-3 my-3 d-flex align-items-center' style={{ backgroundColor: '#F1F3F5' }}>
                <Avatar sx={{ bgcolor: "#C3CDD5", color: '#697988' }}>SU</Avatar>
                <p className='p-4 text-dark fw-bold m-0'>Super admin</p>
            </div>
            <ul className="menu-inner py-1">
                {menuData.map((section) => (
                    <React.Fragment key={section.header}>
                        {section.header && (
                            <li className="menu-header small text-uppercase">
                                <span className="menu-header-text">{section.header}</span>
                            </li>
                        )}
                        {section.items.map(MenuItem)}
                    </React.Fragment>
                ))}

                {/* Bouton de Déconnexion */}
                <li className="menu-item mt-auto">
                    <div
                        onClick={handleLogout}
                        className="menu-link"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        tabIndex={0}
                        role="button"
                        aria-label="Déconnexion"
                    >
                        <i className="menu-icon tf-icons bx bx-power-off"></i>
                        <div>Déconnexion</div>
                    </div>
                </li>
            </ul>
        </aside>
    );
};

const MenuItem = (item) => {
    const location = useLocation();
    const isActive = location.pathname === item.link;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuActive = hasSubmenu && item.submenu.some(subitem => location.pathname === subitem.link);

    return (
        <li
            key={item.text}
            className={`menu-item ${isActive || isSubmenuActive ? 'active' : ''} ${hasSubmenu && isSubmenuActive ? 'open' : ''} ${item.isBottom ? 'mt-auto' : ''}`}
        >

            <NavLink
                aria-label={`Navigate to ${item.text} ${!item.available ? 'Pro' : ''}`}
                to={item.link}
                className={`menu-link ${item.submenu ? 'menu-toggle' : ''}`}
                target={item.link.includes('http') ? '_blank' : undefined}
            >
                <i className={`menu-icon tf-icons ${item.icon}`}></i>
                <div>{item.text}</div> 
            </NavLink>
            {item.submenu && (
                <ul className="menu-sub">
                    {item.submenu.map(subitem => (
                        <MenuItem key={subitem.text} {...subitem} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Sidebar;
