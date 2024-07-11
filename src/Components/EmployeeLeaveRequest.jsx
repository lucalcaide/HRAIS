import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

const EmployeeLeaveRequest = () => {
  const [employee, setEmployee] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('pending');
  const [leaveNumber, setLeaveNumber] = useState(''); // State for leave number

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/home/${id}`)
      .then(result => {
        setEmployee(result.data[0]);
        setName(result.data[0].fname + ' ' + result.data[0].lname);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const leaveData = {
      emp_id: id,
      name: name,
      start_date: startDate,
      end_date: endDate,
      status: status,
      reason: reason,
    };
  
    axios.post('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/leave', leaveData)
      .then(response => {
        alert('Leave request submitted successfully.');
        setLeaveNumber(response.data.leaveRequest.leave_no); // Set the leave number from the response
        setStartDate('');
        setEndDate('');
        setReason('');
      })
      .catch(error => {
        console.error('There was an error submitting the leave request!', error);
      });
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

      <div className="container mt-5">
        <div className="d-flex justify-content-start align-items-center">
          <h2 className="mb-4" style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>Leave Request</h2>
          <Link to={`/employee_leave/${id}`} className="btn btn-outline-dark rounded-pill" style={{ marginLeft: '20px' }}>My leave</Link>
        </div>

        <div style={{ border: '5px solid #ccc', padding: '25px', borderRadius: '10px' }}>
          <form onSubmit={handleSubmit} onReset={() => { 
            setStartDate('');
            setEndDate('');
            setReason('');
          }}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Your Name</label>
              <input
                style={{ fontStyle: 'italic', fontSize: '22px', fontFamily: 'Montserrat' }}
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="start_date" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Start Date</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="date"
                className="form-control"
                id="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="end_date" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>End Date</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="date"
                className="form-control"
                id="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="reason" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Reason</label>
              <textarea
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                className="form-control"
                id="reason"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-color rounded-pill mt-3">Submit Leave</button>
              <button type="reset" className="btn btn-outline-secondary rounded-pill mt-3">Reset Form</button>
            </div>
          </form>

          {leaveNumber && (
            <div className="mt-4">
              <h5>Your leave requested number: {leaveNumber}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequest;
