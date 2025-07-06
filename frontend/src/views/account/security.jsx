import Layout from '../../layouts/Layout';
import { AccountWrapper } from '../../components/wrapper/AccountWrapper';
import PasswordChecklist from 'react-password-checklist';
import { updateProfile } from '../../utils/auth'; // Assurez-vous que cette fonction est correctement importée
import { useState } from 'react';

function Security({ user }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await updateProfile({
        current_password: currentPassword,
        password: newPassword,
        password2: confirmPassword,
      });

      if (response.error) {
        // Extrait les messages d'erreur de l'objet
        const errorMessages = Object.values(response.error).flat().join(', ');
        setError(errorMessages);
        setSuccess(null);
      } else {
        setSuccess('Mot de passe changé avec succès !');
        setError(null);
        // Réinitialiser les champs du formulaire
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError('Échec du changement de mot de passe');
      setSuccess(null);
    }
  };

  return (
    <Layout user={user}>
      <AccountWrapper title="Security">
        <div className="card mb-4">
          <h5 className="card-header">Change Password</h5>
          <div className="card-body">
            <form id="formAccountSettings" method="POST" onSubmit={handleSubmit}>
              <div className="row">
                <div className="mb-3 col-md-6 form-password-toggle">
                  <label className="form-label" htmlFor="currentPassword">Current Password</label>
                  <div className="input-group input-group-merge">
                    <input
                      className="form-control"
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                    />
                    <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-md-6 form-password-toggle">
                  <label className="form-label" htmlFor="newPassword">New Password</label>
                  <div className="input-group input-group-merge">
                    <input
                      className="form-control"
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                    />
                    <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                  </div>
                  {/* Affiche les critères de complexité du mot de passe */}
                  <PasswordChecklist
                    rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
                    minLength={8}
                    value={formData.newPassword}
                    valueAgain={formData.confirmPassword}
                    messages={{
                      minLength: "Le mot de passe doit comporter au moins 8 caractères.",
                      specialChar: "Le mot de passe doit contenir au moins un symbole.",
                      number: "Le mot de passe doit contenir au moins un chiffre.",
                      capital: "Le mot de passe doit contenir au moins une lettre majuscule.",
                      match: "Les mots de passe doivent correspondre.",
                    }}
                  />
                </div>
                <div className="mb-3 col-md-6 form-password-toggle">
                  <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="input-group input-group-merge">
                    <input
                      className="form-control"
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                    />
                    <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                  </div>
                </div>
                <div className="col-12 mt-1">
                  <button type="submit" className="btn btn-primary me-2">Save changes</button>
                  <button type="reset" className="btn btn-label-secondary">Cancel</button>
                </div>
              </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </div>
        </div>
      </AccountWrapper>
    </Layout>
  );
}

export default Security;
