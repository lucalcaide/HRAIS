import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeAttendanceFullDetails = () => {
  const [employee, setEmployee] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState({});

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/attendance/details/${id}`)
      .then(response => {
        if (response.data.Status) {
          setDetails(response.data.Result);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to fetch attendance details.");
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  const handleBack = () => {
    navigate(-1);
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
            <div className="d-flex align-items-center">
              <button className="btn btn-back-color rounded-pill ms-5" style={{ marginRight: '10px' }} onClick={handleBack}>
                <i className="bi bi-arrow-left-circle"></i> Return to Attendance
              </button>
            </div>
          </ul>
        </div>
      </div>
    </nav>

    <div>
    <button className="btn btn-back-color rounded-pill ms-5 mt-5" style={{ marginRight: '10px' }}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>
    </div>
    <div>
      <div className='d-flex justify-content-center mt-5'>
        <span className="mb-3" style={{ fontSize: '35px', fontFamily: 'Montserrat' }}>ATTENDANCE FULL DETAILS</span>
      </div>
      <div id="print-area" className='container mt-1'>
        <div className='row justify-content-center mt-3'>
          <div className='col-md-12' id="attendance-table">
            <table className="table table-bordered" style={{ borderRadius: '15px', overflow: 'hidden', borderCollapse: 'separate', borderSpacing: '0' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} colSpan="2">Your Attendance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat', width: '200px' }}>Name & Schedule:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{details.name} - {formatTime(details.start_time)} to  {formatTime(details.out_time)}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Date:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{formatDate(details.date)}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Time In:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{formatTime(details.time_in)}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Time Out:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{formatTime(details.time_out)}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Status:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{(details.status)}</td>
                </tr>
                <tr>
                  <th colSpan="2" style={{ fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4' }}>Payroll Calculation</th>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Rate Per Hour:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>₱{details.rate_per_hour}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Rate Per Minute:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>₱{details.rate_per_minute}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Hours Worked:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{(details.hours_worked)}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Late:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{details.late} minutes</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Extra:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>{(details.extra)} minutes</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Earnings:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>₱{details.earnings}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Tardiness:</td>
                  <td style={{ fontSize: '24px', padding: '10px', color: 'red' }}>- ₱{details.tardiness}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Overtime:</td>
                  <td style={{ fontSize: '24px', padding: '10px', color: 'green' }}>+ ₱{details.overtime}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Total Amount to Pay:</td>
                  <td style={{ fontSize: '25px', padding: '10px', fontWeight: 'bold' }}>{(details.total_amount_pay)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', backgroundColor: '#ded4d4' }}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
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
  );
};

export default EmployeeAttendanceFullDetails;
