import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateRecruitment = () => {
  const [values, setValues] = useState({
    email: '',
    fname: '',
    lname: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    axios.post('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/createrecruitment', values)
      .then(result => {
        if (result.data.Status) {
          toast.success('Recruitment created successfully!');
          setTimeout(() => {
            navigate('/dashboard'); // Redirect to the dashboard after creation
          }, 2000); // Delay for 2 seconds
        } else {
          setError(result.data.Error);
          toast.error(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='card p-4 shadow-sm rounded-5' style={{ maxWidth: '600px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className='mt-3 mb-3' style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>Create New Recruitment</h2>
          <p style={{ fontSize: '16px', fontFamily: 'Montserrat', color: '#666' }}>
            Create a new <span style={{ fontWeight: 'bold' }}>recruitment</span> account by filling in the details below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-envelope" style={{ fontSize: '20px', color: '#666' }}></i>
              </span>
              <input
                style={{ fontSize: '16px', fontFamily: 'Montserrat' }}
                type='email'
                name='email'
                placeholder='Email'
                autoComplete='off'
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                className='form-control'
              />
            </div>
          </div>
          <div className='mb-3'>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-person" style={{ fontSize: '20px', color: '#666' }}></i>
              </span>
              <input
                style={{ fontSize: '16px', fontFamily: 'Montserrat' }}
                type='text'
                name='fname'
                placeholder='First Name'
                onChange={(e) => setValues({ ...values, fname: e.target.value })}
                className='form-control'
              />
            </div>
          </div>
          <div className='mb-3'>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-person" style={{ fontSize: '20px', color: '#666' }}></i>
              </span>
              <input
                style={{ fontSize: '16px', fontFamily: 'Montserrat' }}
                type='text'
                name='lname'
                placeholder='Last Name'
                onChange={(e) => setValues({ ...values, lname: e.target.value })}
                className='form-control'
              />
            </div>
          </div>
          <div className='mb-3'>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-lock" style={{ fontSize: '20px', color: '#666' }}></i>
              </span>
              <input
                style={{ fontSize: '16px', fontFamily: 'Montserrat' }}
                type='password'
                name='password'
                placeholder='Password'
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className='form-control'
              />
            </div>
          </div>
          <div className='mb-3'>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-lock" style={{ fontSize: '20px', color: '#666' }}></i>
              </span>
              <input
                style={{ fontSize: '16px', fontFamily: 'Montserrat' }}
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
                className='form-control'
              />
            </div>
          </div>
          <button className='btn btn-primary w-100 mb-3' style={{ fontSize: '16px', fontFamily: 'Montserrat' }}>Create Recruitment</button>
        </form>
        <div className='text-center'>
          <Link to="/dashboard" className='btn btn-link' style={{ fontSize: '16px', fontFamily: 'Montserrat', color: '#007bff', textDecoration: 'none' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        style={{
          fontSize: '20px',
          width: '500px', // Adjust width as needed
          padding: '20px', // Adjust padding as needed
          borderRadius: '10px', // Adjust border radius as needed
        }}
      />
    </div>
  );
}

export default CreateRecruitment;
