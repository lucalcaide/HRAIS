import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeAttendance = () => {
  const [employee, setEmployee] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const attendancePerPage = 10;

  useEffect(() => {
    // Fetch employee details
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee/${id}`)
      .then(response => {
        if (response.data.Status) {
          const employee = response.data.Result[0];
          setEmployee(employee);
          setEmployeeName(`${employee.fname} ${employee.mname} ${employee.lname}`);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to fetch employee details.");
      });

    // Fetch attendance records
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/${id}`)
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
  }, [id]);

  const handleFullDetailsClick = () => {
    if (employee && employee.id) {
      const fullDetailsLink = `/employee/full_details/${id}`;
      return (
        <Link to={fullDetailsLink} className="btn btn-primary">
          Full Details
        </Link>
      );
    } else {
      return (
        <span className="text-danger">Employee ID not available</span>
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hoursInt = parseInt(hours);
    const period = hoursInt >= 12 ? 'PM' : 'AM';
    const formattedHours = hoursInt % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDateChange = () => {
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const filteredAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || recordDate >= start) && (!end || recordDate <= end) && 
           (!statusFilter || record.status === statusFilter);
  });

  const totalRecords = filteredAttendance.length;

  const indexOfLastRecord = currentPage * attendancePerPage;
  const indexOfFirstRecord = indexOfLastRecord - attendancePerPage;
  const currentAttendance = showAll ? filteredAttendance : filteredAttendance.slice(indexOfFirstRecord, indexOfLastRecord);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAttendance.length / attendancePerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
      
      <div>
        <button className="btn btn-back-color rounded-pill ms-5 mt-5" style={{ marginRight: '10px' }} onClick={handleBack}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>
      </div>
      <div className="container mt-5">
      <div className="d-flex justify-content-start">
          <span className="mb-3" style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat', marginTop:'80px' }}>My Attendance</span>
        </div>

        <div className="input-group mt-3 d-flex justify-content-start">
          <div className="d-flex align-items-center me-3">
            <label htmlFor="startDate" className="me-2" style={{ fontSize: '18px',fontWeight:'bold',fontFamily:'Montserrat' }}>FROM</label>
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
            <label htmlFor="endDate" className="me-2" style={{ fontSize: '18px',fontWeight:'bold',fontFamily:'Montserrat' }}>TO</label>
            <input
              type="date"
              id="endDate"
              className="form-control form-control-lg rounded-3"
              style={{fontSize: '20px', fontFamily:'Montserrat'}}
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); handleDateChange(); }}
            />
          </div>
          <div className="d-flex align-items-center me-3">
            <label htmlFor="statusFilter" className="me-2" style={{ fontSize: '18px',fontWeight:'bold',fontFamily:'Montserrat' }}>STATUS</label>
            <select
              id="statusFilter"
              className="form-control form-control-lg rounded-3"
              style={{fontSize: '20px', fontFamily:'Montserrat'}}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); handleDateChange(); }}
            >
              <option value="">All</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-start mt-3">
          <div style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>
            <span>Total Records: {totalRecords}</span>
          </div>
        </div>

        <div className="pagination mt-3 d-flex justify-content-end" style={{ display: showAll ? 'none' : 'flex' }}>
          
          <button className="btn btn-color rounded-3" onClick={handleResetFilter}>Reset Filter</button>
          
          <button
            onClick={prevPage}
            className="btn btn-color ms-4"
            disabled={currentPage === 1}
          >
            <i className="bi bi-caret-left-fill me-2" style={{ fontSize: '20px' }}></i>
            Previous
          </button>

          <span className="btn btn-color" style={{ margin: '0 3px', fontSize: '18px' }}>
            Page {currentPage} of {Math.ceil(filteredAttendance.length / attendancePerPage)}
          </span>

          <button
            onClick={nextPage}
            className="btn btn-color"
            disabled={currentPage === Math.ceil(filteredAttendance.length / attendancePerPage)}
          >
            Next
            <i className="bi bi-caret-right-fill ms-2" style={{ fontSize: '20px' }}></i>
          </button>

          <button
            className="btn btn-color rounded-3"
            style={{ marginLeft: '20px' }}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Paginated" : "Show All"}
          </button>
        </div>

        {filteredAttendance.length === 0 ? (
          <div className="text-center mt-3" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily:'Montserrat', marginTop: '20px', minHeight: 'calc(100vh - 500px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           No Result Found.
         </div>
        ) : (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th className="text-center">DATE</th>
                <th className="text-center">TIME IN</th>
                <th className="text-center">TIME OUT</th>
                <th className="text-center">STATUS</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentAttendance.map(record => (
                <tr key={record.id}>
                  <td className="text-center">{formatDate(record.date)}</td>
                  <td className="text-center">{formatTime(record.time_in)}</td>
                  <td className="text-center">{formatTime(record.time_out)}</td>
                  <td className="text-center">{record.status}</td>
                  <td className="text-center">
                    <Link to={`/employee_attendance/view_full_attendance_details/${record.id}`} className="btn btn-outline-dark me-2" style={{ fontWeight: 'bold' }}>
                      Full Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ToastContainer
          position="top-center"
          style={{
            fontSize: '20px',
            width: '500px',
            padding: '20px',
            borderRadius: '10px',
          }}
        />
      </div>
    </div>
  )
}

export default EmployeeAttendance;
