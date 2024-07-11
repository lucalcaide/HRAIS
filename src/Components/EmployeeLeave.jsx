import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; 
import { Snackbar, SnackbarContent, Button } from '@mui/material';
import * as XLSX from 'xlsx';

const EmployeeLeave = () => {
  const [employee, setEmployee] = useState({});
  const [leaveData, setLeaveData] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const recordsPerPage = 20;

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/home/${id}`)
      .then(result => {
        setEmployee(result.data[0]);
      })
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/leave/${id}`)
      .then(response => {
        setLeaveData(response.data);
        setTotalPages(Math.ceil(response.data.length / recordsPerPage));
      })
      .catch(error => {
        console.error('Error fetching leave data:', error);
      });
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return leaveData.slice(startIndex, endIndex);
  };

  const handleCancelLeave = (leaveId, status) => {
    if (status === 'fulfilled' || status === 'rejected') {
      setSnackbarMessage("You cannot cancel a leave that has been updated.");
      setSnackbarOpen(true);
      return;
    }
    if (window.confirm("Are you sure to cancel this leave request?")) {
      axios.delete(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/leave/${id}/${leaveId}`)
        .then(() => {
          setLeaveData(prevData => prevData.filter(leave => leave.id !== leaveId));
          setTotalPages(Math.ceil((leaveData.length - 1) / recordsPerPage));
          alert("Leave request canceled successfully.");
        })
        .catch(error => {
          console.error('Error cancelling leave request:', error);
        });
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-link ${currentPage === i ? 'active' : ''}`}
          style={{ color: '#0b283b' }}
        >
          {i}
        </button>
      );
    }
    return (
      <nav aria-label="Page navigation" className='print-hide-actions'>
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ color: '#0b283b ' }}
            >
              Previous
            </button>
          </li>
          {pages.map((page, index) => (
            <li className="page-item" key={index}>
              {page}
            </li>
          ))}
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ color: '#0b283b'}}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePrint = () => {
    const printContents = document.getElementById('employee-table').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(leaveData.map(leave => ({
      Name: leave.name,
      "Start Date": new Date(leave.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      "End Date": new Date(leave.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      Status: leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
      Reason: leave.reason,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leaves");
    XLSX.writeFile(wb, "Leave_Records.xlsx");
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
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-3" style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat', marginTop:'80px' }}> My Leave</h2>
          <div>
            
            <Link to={`/employee_leave_list/${id}`} className="btn btn-outline-dark rounded-pill" style={{ marginRight: '10px' }}>Request leave</Link>
            <button onClick={handlePrint} className="btn btn-outline-dark rounded-pill" style={{ marginRight: '10px' }}> <i className="bi bi-printer"></i> </button>
            <button onClick={handleExport} className="btn btn-outline-dark rounded-pill"><i className='bi bi-file-earmark-excel'></i></button>
          </div>
        </div>
        {leaveData.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>No Leave Available.</p>
          </div>
        ) : (
          <div id="employee-table">
            <table className="table table-striped" style={{ fontFamily: 'Montserrat'}}>
              <thead>
                <tr>
                  <th>Leave Number</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th className='print-hide-actions'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map(leave => (
                  <tr key={leave.id}>
                    <td>{leave.leave_no}</td>
                    <td>{leave.name}</td>
                    <td>{new Date(leave.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>{new Date(leave.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>
                      {leave.status === 'pending' && <span style={{fontStyle:'italic'}}><i className="bi bi-dash-circle text-warning"></i> Pending</span>}
                      {leave.status === 'fulfilled' && <span style={{fontStyle:'italic'}}><i className="bi bi-check-circle text-success"></i> Fulfilled</span>}
                      {leave.status === 'rejected' && <span style={{fontStyle:'italic'}}><i className="bi bi-x-circle text-danger me-1"></i> Rejected</span>}
                    </td>
                    <td>{leave.reason}</td>
                    <td className='print-hide-actions'>
                      <button 
                        className="btn btn-outline-secondary rounded-3"
                        onClick={() => handleCancelLeave(leave.id, leave.status)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

      >
        <SnackbarContent
          message={
            <span style={{ display: 'flex', alignItems: 'center'}}>
              {snackbarMessage}
              <Button color="inherit" size="small" onClick={handleSnackbarClose} style={{ fontSize:'16px', fontWeight:'bold',color:'#ff8800'}}> 
                OKAY
              </Button>
            </span>
          }
          className='rounded-4'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', padding: '16px', fontSize: '18px' }} //
        />
      </Snackbar>
    </div>
  );
};

export default EmployeeLeave;
