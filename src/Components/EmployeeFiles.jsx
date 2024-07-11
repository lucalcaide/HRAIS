import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons CSS

const EmployeeFiles = () => {
  const [employee, setEmployee] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/files/${id}`)
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const getLinkStyle = (path) => {
    return location.pathname === path
      ? {
          color: 'white',
          fontWeight: 'bold',
          borderBottom: '3px solid #ff8800',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }
      : {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        };
  };

  return (
    <div>
      <nav className="p-3 navbar navbar-expand-lg navbar-dark empprofile" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
        <div className="d-flex align-items-center">
          <img
            src="/Images/r.c. logo.jpeg"
            className="logo-size rounded-circle me-3"
            alt="Logo"
          />
          <div className="d-flex flex-column">
            <p
              className="m-0"
              style={{
                fontFamily: 'Castoro Titling',
                fontSize: '20px',
                color: 'white',
              }}
            >
              R.C. RAMOS CONSTRUCTION CORPORATION
            </p>
            <p
              className="m-0"
              style={{
                fontFamily: 'Castoro Titling',
                fontSize: '14px',
                color: '#ccc',
              }}
            >
              HUMAN RESOURCE & ATTENDANCE INFORMATION SYSTEM
            </p>
          </div>
        </div>

        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex justify-content-end w-100">
              <div className="d-flex">
                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link
                    className="nav-link"
                    style={getLinkStyle(`/employee_home/${id}`)}
                    to={`/employee_home/${id}`}
                  >
                    <i className="bi bi-house-door" style={{ fontSize: '2rem' }}></i>
                    Home
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link
                    className="nav-link"
                    style={getLinkStyle(`/employee_files/${id}`)}
                    to={`/employee_files/${id}`}
                  >
                    <i className="bi bi-file-earmark" style={{ fontSize: '2rem' }}></i>
                    201 Files
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link
                    className="nav-link"
                    style={getLinkStyle(`/employee_attendance/${id}`)}
                    to={`/employee_attendance/${id}`}
                  >
                    <i className="bi bi-calendar-check" style={{ fontSize: '2rem' }}></i>
                    Attendance
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '20px' }}>
                  <Link
                    className="nav-link"
                    style={getLinkStyle(`/employee_leave/${id}`)}
                    to={`/employee_leave/${id}`}
                  >
                    <i className="bi bi-calendar3" style={{ fontSize: '2rem' }}></i>
                    Leave
                  </Link>
                </li>

                <li className="nav-item" style={{ fontSize: '15px', marginRight: '60px' }}>
                  <Link
                    className="nav-link"
                    style={getLinkStyle(`/employee_profile/${id}`)}
                    to={`/employee_profile/${id}`}
                  >
                    <i className="bi bi-person" style={{ fontSize: '2rem' }}></i>
                    Profile
                  </Link>
                </li>
              </div>

              <li className="nav-item dropdown d-flex align-items-center" style={{ fontSize: '20px' }}>
                <div className="dropdown-toggle nav-link d-flex align-items-center" onClick={toggleDropdown}>
                  <img
                    src={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Images/${employee.image}`}
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

      <div className="container" style={{ paddingTop: '100px' }}>
        <div className="d-flex justify-content-start">
          <span className="mb-3" style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat', marginTop:'80px' }}>My 201 Files</span>
        </div>

        <div className="row">
          <div className="col-12 mb-4">
            <div className="card h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ backgroundColor: '#0b283b', borderRadius: '15px' }}>
                <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '30px', color: 'wheat' }}>RESUME</h5>
                {employee.resume ? (
                  <div>
                    <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' , marginTop:'20px' }}>Filename: {employee.resume}</p>
                    <a href={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Resumes/${employee.resume}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat' }} className="btn btn-light rounded-pill mt-3">
                      Open
                    </a>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' }}>No resume uploaded...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ backgroundColor: '#0b283b', borderRadius: '15px' }}>
                <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '30px', color: 'wheat' }}>JOB OFFER</h5>
                {employee.job_offer ? (
                  <div>
                    <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' , marginTop:'20px' }}>Filename: {employee.job_offer}</p>
                    <a href={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/JobOffers/${employee.job_offer}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat' }} className="btn btn-light rounded-pill mt-3">
                    Open
                    </a>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' }}>No job offer uploaded...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ backgroundColor: '#0b283b', borderRadius: '15px' }}>
                <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '30px', color: 'wheat' }}>VALID IDs</h5>
                {employee.valid_id ? (
                  <div>
                    <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' , marginTop:'20px' }}>Filename: {employee.valid_id}</p>
                    <a href={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/ValidIDs/${employee.valid_id}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat' }} className="btn btn-light rounded-pill mt-3">
                    Open
                    </a>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' }}>No valid IDs uploaded...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ backgroundColor: '#0b283b', borderRadius: '15px' }}>
                <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '30px', color: 'wheat' }}>CONTRACT</h5>
                {employee.contract ? (
                  <div>
                    <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' , marginTop:'20px' }}>Filename: {employee.contract}</p>
                    <a href={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Contracts/${employee.contract}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat' }} className="btn btn-light rounded-pill mt-3">
                    Open
                    </a>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' }}>No contract uploaded...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ backgroundColor: '#0b283b', borderRadius: '15px' }}>
                <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '30px', color: 'wheat' }}>APPLICATION FORM</h5>
                {employee.application_form ? (
                  <div>
                    <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic', marginTop:'20px' }}>Filename: {employee.application_form}</p>
                    <a href={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/ApplicationForms/${employee.application_form}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat' }} className="btn btn-light rounded-pill mt-3">
                    Open
                    </a>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' }}>No application form uploaded...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ backgroundColor: '#0b283b', borderRadius: '15px' }}>
                <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '30px', color: 'wheat' }}>DISCIPLINARY FORM</h5>
                {employee.disciplinary_form ? (
                  <div>
                    <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic', marginTop:'20px' }}>Filename: {employee.disciplinary_form}</p>
                    <a href={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/DisciplinaryForms/${employee.disciplinary_form}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat' }} className="btn btn-light rounded-pill rounded-pill mt-3">
                    Open
                    </a>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Montserrat', fontSize: '18px', color: '#ccc', fontStyle:'italic' }}>No disciplinary form uploaded...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFiles;
