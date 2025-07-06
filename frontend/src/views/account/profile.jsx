import { useState, useEffect } from 'react';
import { AccountWrapper } from '../../components/wrapper/AccountWrapper';
import Button from '@mui/material/Button';
import Layout from "../../layouts/Layout";
import { useAuthStore } from '../../store/auth'; // Import du store
import { updateProfile, getCurrentUser } from '../../utils/auth'; // Import de la fonction updateProfile et getCurrentUser

export const Profile = () => { 
    const user = useAuthStore((state) => state.user()); // Récupère les infos de l'utilisateur depuis le store

    const [formData, setFormData] = useState({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        // Récupérer les données actuelles de l'utilisateur au chargement du composant
        const fetchUserData = async () => {
            const { data, error } = await getCurrentUser();
            if (error) {
                setError(error);
            } else {
                setFormData({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    email: data.email || '',
                    username: data.username || '',
                });
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const dataToUpdate = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            username: formData.username,
        };
    
        try {
            const {  error } = await updateProfile(dataToUpdate);
            if (error) {
                setError(error);
                setSuccess(null);
            } else {
                setSuccess('Profile updated successfully!');
                setError(null);
            }
        } catch (err) {
            setError('Failed to update profile');
            setSuccess(null);
        }
    };

    return (
        <Layout user={user}>
            <AccountWrapper title="Account">
                <div className="card mb-4">
                    <h5 className="card-header">Profile Details</h5>
                    <div className="card-body">
                        <div className="d-flex align-items-start align-items-sm-center gap-4">
                            <img
                                src="../assets/img/avatars/1.png"
                                alt="user-avatar"
                                className="d-block rounded"
                                height="100"
                                width="100"
                                aria-label="Account image"
                                id="uploadedAvatar"
                            />
                            <div className="button-wrapper">
                                <label
                                    htmlFor="upload"
                                    className="btn btn-primary me-2 mb-4"
                                    tabIndex="0"
                                >
                                    <span className="d-none d-sm-block">
                                        Upload new photo
                                    </span>
                                    <i className="bx bx-upload d-block d-sm-none"></i>
                                    <input
                                        type="file"
                                        id="upload"
                                        className="account-file-input"
                                        hidden
                                        accept="image/png, image/jpeg"
                                    />
                                </label>
                                <p className="text-muted mb-0">
                                    Allowed JPG, GIF or PNG. Max size of 800K
                                </p>
                            </div>
                        </div>
                    </div>
                    <hr className="my-0" />
                    <div className="card-body">
                        <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName} 
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={formData.lastName} 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="email" className="form-label">E-mail</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email} 
                                        onChange={handleChange}
                                        placeholder="john.doe@example.com"
                                    />
                                </div> 
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username} 
                                        onChange={handleChange}
                                        placeholder="username"
                                    />
                                </div>  
                            </div>
                            <div className="mt-2">
                                <Button type="submit" variant="contained" color="primary" sx={{ marginRight: 2 }}>
                                    Save changes
                                </Button>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                {success && <p style={{ color: 'green' }}>{success}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </AccountWrapper>
        </Layout>
    );
};

export default Profile;
