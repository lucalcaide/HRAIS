import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EmpChangePass = () => {
    const [employee, setEmployee] = useState({});
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
  
    useEffect(() => {
        axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/detail/${id}`)
            .then(result => {
                setEmployee(result.data[0]);
            })
            .catch(err => console.log(err));
    }, [id]);
  
    const handleLogout = () => {
        axios.get('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/logout')
            .then(result => {
                if (result.data.Status) {
                    localStorage.removeItem("valid");
                    navigate('/employeelogin');
                }
            }).catch(err => console.log(err));
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
    
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
    
        axios.post(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/change-password/${id}`, {
            currentPassword,
            newPassword
        }).then(response => {
            if (response.data.success) {
                alert("Password changed successfully.");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert("Failed to change password.");
            }
        }).catch(err => {
            alert("An error occurred. Please try again.");
        });
    };
  
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
  
    return (
        <div>
            <nav className="p-3 navbar navbar-expand-lg navbar-dark empprofile">
        <div className="d-flex align-items-center">
          <img
            src="/Images/r.c. logo.jpeg"
            className="logo-size rounded-circle me-3"
            alt="Logo"
          />
          <h4 className="m-0" style={{ fontFamily: 'Castoro Titling', fontSize: '20px', color: 'white' }}>R.C. Ramos Construction Corporation</h4>
        </div>

        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex justify-content-end w-100">
              <div className="d-flex">
                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link className={`nav-link ${location.pathname === `/employee_home/${id}` ? 'active' : ''} d-flex flex-column align-items-center`} to={`/employee_home/${id}`}>
                    <i className="bi bi-house-door" style={{ fontSize: '2rem' }}></i>
                    Home
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link className={`nav-link ${location.pathname === `/employee_files/${id}` ? 'active' : ''} d-flex flex-column align-items-center`} to={`/employee_files/${id}`}>
                    <i className="bi bi-file-earmark" style={{ fontSize: '2rem' }}></i>
                    201 Files
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link className={`nav-link ${location.pathname === `/employee_biometrics/${id}` ? 'active' : ''} d-flex flex-column align-items-center`} to={`/employee_biometrics/${id}`}>
                    <i className="bi bi-fingerprint" style={{ fontSize: '2rem' }}></i>
                    Biometrics
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link className={`nav-link ${location.pathname === `/employee_attendance/${id}` ? 'active' : ''} d-flex flex-column align-items-center`} to={`/employee_attendance/${id}`}>
                    <i className="bi bi-calendar-check" style={{ fontSize: '2rem' }}></i>
                    Attendance
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link className={`nav-link ${location.pathname === `/employee_leave/${id}` ? 'active' : ''} d-flex flex-column align-items-center`} to={`/employee_leave/${id}`}>
                    <i className="bi bi-calendar3" style={{ fontSize: '2rem' }}></i>
                    Leave
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '60px' }}>
                  <Link className={`nav-link ${location.pathname === `/employee_profile/${id}` ? 'active' : ''} d-flex flex-column align-items-center`} to={`/employee_profile/${id}`}>
                    <i className="bi bi-person" style={{ fontSize: '2rem' }}></i>
                    Profile
                  </Link>
                </li>
              </div>

              <li className="nav-item dropdown d-flex align-items-center" style={{ fontSize: '20px' }}>
                <div className="dropdown-toggle nav-link d-flex align-items-center" onClick={toggleDropdown}>
                  <img
                    src={`http://localhost:3000/Images/${employee.image}`}
                    className="rounded-circle"
                    alt="Employee"
                    style={{ width: '45px', height: '45px' }}
                  />
                  Hi, {employee.fname}
                </div>
                {dropdownVisible && (
                  <div className="dropdown-menu dropdown-menu-end">
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    
            <div className="container mt-5">
            <h2 className='mb-5' style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>Change Password</h2>
                <div className="d-flex justify-content-center flex-column align-items-center mt-3">
                    <div className="d-flex flex-column align-items-center">
                        
                    <form onSubmit={handleChangePassword} onReset={() => { // Reset form fields when the reset button is clicked
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                        }} style={{ width: '500px', maxWidth: '500px', border: '5px solid #ccc', borderRadius: '20px', padding: '50px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label" style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>Current Password</label>
                                <input
                                    style={{ fontSize: '20px', fontFamily: 'Montserrat', fontWeight:'bold' }}
                                    type="password"
                                    className="form-control"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label" style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>New Password</label>
                                <input
                                    style={{ fontSize: '20px', fontFamily: 'Montserrat', fontWeight:'bold' }}
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
                                    style={{ fontSize: '20px', fontFamily: 'Montserrat', fontWeight:'bold' }}
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
                                <button type="reset" className='btn btn-outline-secondary rounded-pill'>Reset</button> {/* Add reset button */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpChangePass;
