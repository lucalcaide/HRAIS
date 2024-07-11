import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons CSS

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hoursInt = parseInt(hours);
    const period = hoursInt >= 12 ? 'PM' : 'AM';
    const formattedHours = hoursInt % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
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
              </div>

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

      <div className="container mt-5" style={{ paddingTop: '100px' }}>
        <div className="d-flex justify-content-start">
          <span className="mb-3" style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat', marginTop: '80px' }}>My Profile</span>
        </div>

        <div className="card" style={{ backgroundColor: '#f8f9fa', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div className="d-flex align-items-center">
            <img
              src={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Images/${employee.image}`}
              className="rounded-circle"
              alt="Employee"
              style={{ width: '150px', height: '150px', marginRight: '20px', border: '2px solid #000' }}
            />
            <div>
              <h2 style={{ fontFamily: 'Montserrat', fontSize: '40px',  fontWeight: 'bold', color: '#333' }}>{employee.fname} {employee.lname}</h2>
              <p style={{ fontFamily: 'Montserrat', fontSize: '20px', color: '#777' }}>{employee.position} at {employee.department} </p>
              <p style={{ fontFamily: 'Montserrat', fontSize: '20px', color: '#777' }}>Employee ID: {employee.emp_no}</p>
              
              <div className='mt-4'>
                <Link to={`/employee_change_password/` + id} className='btn btn-color-password rounded-3'>
                  <span style={{ fontStyle: 'Montserrat' }}>Change Password</span>
                </Link>
              </div>

            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6 d-flex flex-column">
            <div className="card mb-4 flex-fill" style={{ backgroundColor: '#0b283b', borderRadius: '15px', padding: '20px', color: 'white' }}>
              <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '20px', color: 'wheat' }}>Personal Information</h5>
              <div className="card-body">
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Full Name: <span style={{ color: 'wheat' }}>{employee.lname}, {employee.fname} {employee.mname}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Birthday: <span style={{ color: 'wheat' }}>{formatDate(employee.birth_date)}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Gender: <span style={{ color: 'wheat' }}>{employee.gender}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Contact Number: <span style={{ color: 'wheat' }}>{employee.phone_number}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Home Address: <span style={{ color: 'wheat' }}>{employee.perma_address}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Email Address: <span style={{ color: 'wheat' }}>{employee.email}</span></p>
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column">
            <div className="card mb-4 flex-fill" style={{ backgroundColor: '#0b283b', borderRadius: '15px', padding: '20px', color: 'white' }}>
              <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '20px', color: 'wheat' }}>Job Information</h5>
              <div className="card-body">
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>ID Number: <span style={{ color: 'wheat' }}>{employee.emp_no}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Department: <span style={{ color: 'wheat' }}>{employee.department}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Project/Unit: <span style={{ color: 'wheat' }}>{employee.project}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Position: <span style={{ color: 'wheat' }}>{employee.position}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Joined on: <span style={{ color: 'wheat' }}>{formatDate(employee.date_hired)}</span></p>
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column">
            <div className="card mb-4 flex-fill" style={{ backgroundColor: '#0b283b', borderRadius: '15px', padding: '20px', color: 'white' }}>
              <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '20px', color: 'wheat' }}>Payroll Information</h5>
              <div className="card-body">
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Paid Every: <span style={{ color: 'wheat' }}>{employee.pay_frequency}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Daily Rate: <span style={{ color: 'wheat' }}>₱{employee.rate_per_day}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Hourly Rate: <span style={{ color: 'wheat' }}>₱{employee.rate_per_hour}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Salary: <span style={{ color: 'wheat' }}>₱{employee.salary}</span></p>
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column">
            <div className="card mb-4 flex-fill" style={{ backgroundColor: '#0b283b', borderRadius: '15px', padding: '20px', color: 'white' }}>
              <h5 className="card-title" style={{ fontFamily: 'Montserrat', fontSize: '20px', color: 'wheat' }}>Employment Status</h5>
              <div className="card-body">
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Status: <span style={{ color: 'wheat' }}>{employee.employee_status}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Terminated on: <span style={{ color: 'wheat' }}>{employee.employee_status === 'Active' ? 'No Date' : formatDate(employee.term_date)}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Start Time: <span style={{ color: 'wheat' }}>{employee.start_time ? formatTime(employee.start_time) : 'N/A'}</span></p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '18px' }}>Out Time: <span style={{ color: 'wheat' }}>{employee.out_time ? formatTime(employee.out_time) : 'N/A'}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
