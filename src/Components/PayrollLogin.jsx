import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Snackbar, SnackbarContent, Button } from '@mui/material';

const PayrollLogin = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/payroll/payrolllogin', values)
      .then(result => {
        if (result.data.loginStatus) {
          navigate('/payrolldashboard/terms_and_agreements');
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleForgotPassword = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className='login-page'>
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='p-3 rounded w-30 border-0'>
          <div className='text-warning'>
            {error && (
              <div className='alert alert-danger' role='alert'>
                {error}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <h1 className="display-4 mb-4" style={{ fontSize: '45px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>Welcome to</h1>
            <img src={"/Images/r.c. logo nobg.png"} alt="Company Logo" className="mb-4 mx-auto d-block" style={{ width: '90px' }} />
            <span style={{ fontSize: '25px', fontFamily: 'Montserrat' }}>R.C. RAMOS CONSTRUCTION CORPORATION</span>
            <p className="mt-3" style={{ fontSize: '18px', fontFamily: 'Montserrat', fontStyle: 'italic' }}>
              You are logging in as <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>payroll</span>
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Montserrat' }}> Please login to continue.</p>
            <hr className="my-4" />
          </div>

          <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
            <div className='mb-3' style={{ width: '350px' }}>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope" style={{ fontSize: '20px' }}></i>
                </span>
                <input
                  style={{ fontSize: '20px', fontFamily: 'Montserrat' }}
                  type='email'
                  name='email'
                  placeholder='Email'
                  autoComplete='off'
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  className='form-control transition-input'
                />
              </div>
            </div>
            <div className='mb-3' style={{ width: '350px' }}>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock" style={{ fontSize: '20px' }}></i>
                </span>
                <input
                  style={{ fontSize: '20px', fontFamily: 'Montserrat' }}
                  type='password'
                  name='password'
                  placeholder='Password'
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  className='form-control transition-input'
                />
              </div>
            </div>
            <button className='btn btn-success w-50 rounded-2 mb-2' style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Login</button>
          </form>
          
          <div className='text-center'>
            <button className='btn btn-link' style={{ fontSize: '18px', fontFamily: 'Montserrat', color: 'black' }} onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          <div className='text-center'>
            <span style={{ fontSize: '18px', fontFamily: 'Montserrat', marginRight: '10px' }}>Visit Us:</span>
            <a href="https://www.facebook.com/rc.ramos.2020" target="_blank" rel="noopener noreferrer" className='mx-2'>
              <i className="bi bi-facebook" style={{ fontSize: '30px', color: '#4267B2' }}></i>
            </a>
            <a href="https://www.linkedin.com/company/r-c-ramos-construction-corporation/" target="_blank" rel="noopener noreferrer" className='mx-2'>
              <i className="bi bi-linkedin" style={{ fontSize: '30px', color: '#0A66C2' }}></i>
            </a>
          </div>

          <div className='text-center mt-5'>
            <Link to="/" className='btn btn-color rounded-5'>
              <span className="start-btn-text" style={{ fontStyle: 'Montserrat' }}>Go to start page</span>
            </Link>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
          message={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Please contact HR for further assistance.
              <Button color="inherit" size="small" onClick={handleSnackbarClose} style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff8800' }}>
                OKAY
              </Button>
            </span>
          }
          className='rounded-4'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', padding: '16px', fontSize: '18px' }}
        />
      </Snackbar>
    </div>
  );
};

export default PayrollLogin;
