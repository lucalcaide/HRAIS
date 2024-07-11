import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateNewPass = () => {
  const { id } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/create_new_password/${id}`, {
        newPassword,
        confirmPassword,
      });

      if (response.data.Status) {
        setSuccess("Password updated successfully!");
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError("An error occurred while updating the password");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <div className="container mt-5">
      <button className="btn btn-back-color rounded-pill mb-5" style={{ marginRight: '10px' }} onClick={handleBack}>
        <i className="bi bi-arrow-left-circle"></i>
      </button>
      <h2 className='mb-5' style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>Create New Password</h2>
      <div className="d-flex justify-content-center flex-column align-items-center mt-3">
        <div className="d-flex flex-column align-items-center">

          <form onSubmit={handleSubmit} onReset={() => { // Reset form fields when the reset button is clicked
              setNewPassword('');
              setConfirmPassword('');
              setError('');
              setSuccess('');
            }} style={{ width: '500px', maxWidth: '500px', border: '5px solid #ccc', borderRadius: '20px', padding: '50px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label" style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>New Password</label>
              <input
                style={{ fontSize: '20px', fontFamily: 'Montserrat', fontWeight: 'bold' }}
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>Confirm New Password</label>
              <input
                style={{ fontSize: '20px', fontFamily: 'Montserrat', fontWeight: 'bold' }}
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className='btn btn-color rounded-pill'>Submit Password</button>
              <button type="reset" className='btn btn-outline-secondary rounded-pill'>Reset</button>
            </div>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
          </form>
        </div>
      </div>
    </div>
  
  );
};

export default CreateNewPass;
