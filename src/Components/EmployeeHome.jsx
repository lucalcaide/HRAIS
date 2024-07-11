import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap-icons/font/bootstrap-icons.css"; 

const EmployeeHome = () => {
  const [employee, setEmployee] = useState({});
  const [leave, setLeave] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Fetch employee data
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/home/${id}`)
      .then(result => {
        setEmployee(result.data[0]);
      })
      .catch(err => console.log(err));

    // Fetch leave data with date filters
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/leave/${id}`, {
      params: {
        startDate,
        endDate
      }
    })
      .then(response => {
        setLeave(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave data:', error);
      });

    // Fetch attendance data
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/attendance/${id}`)
      .then(response => {
        if (response.data.Status) {
          setAttendance(response.data.Result);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to fetch attendance records.");
      });

    // Update date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [id, startDate, endDate]);

  const handleDateChange = () => {
    setCurrentPage(1);
  };

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

  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString(undefined, options);
  };

  const filteredAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
  
    return (!start || recordDate >= start) && (!end || recordDate <= end);
  });
  
  const filteredLeave = leave.filter(record => {
    const recordDate = new Date(record.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
  
    return (!start || recordDate >= start) && (!end || recordDate <= end);
  });  

  const calculateTotalLate = (records) => {
    return records.reduce((total, record) => total + record.late, 0);
  };

  const calculateTotalOvertime = (records) => {
    return records.reduce((total, record) => total + record.overtime, 0);
  };

  const calculateTotalLeave = (records) => {
    return records.length;
  };

  const calculateTotalPendingLeave = (records) => {
    return records.filter(record => record.status === 'pending').length;
  };

  const calculateTotalFulfilledLeave = (records) => {
    return records.filter(record => record.status === 'fulfilled').length;
  };

  const calculateTotalRejectedLeave = (records) => {
    return records.filter(record => record.status === 'rejected').length;
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
                  {employee.image ? (
                    <img
                      src={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Images/${employee.image}`}
                      className="rounded-circle"
                      alt="Employee"
                      style={{ width: '45px', height: '45px' }}
                    />
                  ) : (
                    <div className="rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'gray' }} />
                  )}
                  Hi, {employee.fname || "Employee"}
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
        <div className="d-flex justify-content-around mt-3">
          <div
            className="col-md-10"
            style={{
              backgroundColor: "#0b283b",
              padding: "20px",
              boxShadow: "10 20px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: "30px",
                color: "wheat",
              }}
            >
              Welcome, {employee.fname} {employee.lname}!
            </span>
            <br />
            <span
              style={{
                fontFamily: "Montserrat",
                fontWeight: 'bold',
                color: '#ccc',
                fontSize: "26px",
              }}
            >
              Today is {formatDateTime(currentDateTime)}
            </span>
          </div>
        </div>

        <div className="d-flex justify-content-around mt-3">
          <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
            <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="fs-4 bi-calendar-check me-2"></i>Set Date: </span>
            <div className="input-group mt-3 d-flex justify-content-start">
                <div className="d-flex align-items-center me-3">
                  <label htmlFor="startDate" className="me-3" style={{ fontSize: '18px',fontWeight:'bold',fontFamily:'Montserrat' }}>FROM</label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-control form-control-lg rounded-3"
                    style={{fontSize: '20px', fontFamily:'Montserrat'}}
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); handleDateChange(); }}
                  />
                </div>
                <div className="d-flex align-items-center me-3">
                  <label htmlFor="endDate" className="me-3" style={{ fontSize: '18px',fontWeight:'bold',fontFamily:'Montserrat' }}>TO</label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control form-control-lg rounded-3"
                    style={{fontSize: '20px', fontFamily:'Montserrat'}}
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); handleDateChange(); }}
                  />
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-around mt-3">
          <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
            <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="fs-4 bi-calendar-check me-2"></i>Your Attendance: </span>  
            <div className="container">
            <div className="d-flex justify-content-around mt-3">
              <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="bi bi-clock"></i> Total Late: <span style={{ color: 'wheat', fontWeight:'bold' }}>{calculateTotalLate(filteredAttendance)} min(s)</span></span>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="d-flex justify-content-around mt-3">
              <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="bi bi-alarm"></i> Total Overtime: <span style={{ color: 'wheat', fontWeight:'bold' }}>{calculateTotalOvertime(filteredAttendance)} min(s)</span></span>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="d-flex justify-content-around mt-3">
              <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="bi bi-check"></i> Total Present: <span style={{ color: 'wheat', fontWeight:'bold' }}>{filteredAttendance.length} day(s)</span></span>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="d-flex justify-content-around mt-3">
          <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
            <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="fs-4 bi-calendar-check me-2"></i>Your Leave Requests:</span>
              <div className="container">
                <div className="d-flex justify-content-around mt-3">
                  <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
                    <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="bi bi-file-earmark-check"></i> Total Leave: <span style={{ color: 'wheat', fontWeight:'bold' }}>{calculateTotalLeave(filteredLeave)} request(s)</span></span>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="d-flex justify-content-around mt-3">
                  <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
                    <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="bi bi-hourglass-split"></i> Total Pending Leave: <span style={{ color: 'wheat', fontWeight:'bold' }}>{calculateTotalPendingLeave(filteredLeave)} request(s)</span></span>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="d-flex justify-content-around mt-3">
                  <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
                    <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="bi bi-check-circle"></i> Total Fulfilled Leave: <span style={{ color: 'wheat', fontWeight:'bold' }}>{calculateTotalFulfilledLeave(filteredLeave)} request(s)</span></span>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="d-flex justify-content-around mt-3">
                  <div className="col-md-10" style={{ backgroundColor: '#0b283b', color: "#ccc", padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
                    <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="bi bi-x-circle"></i> Total Rejected Leave: <span style={{ color: 'wheat', fontWeight:'bold' }}>{calculateTotalRejectedLeave(filteredLeave)} request(s)</span></span>
                  </div>
                </div>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeHome;
