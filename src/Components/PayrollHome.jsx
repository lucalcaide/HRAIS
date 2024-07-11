import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const PayrollHome = () => {
    const [pendingLeaveTotal, setPendingLeaveTotal] = useState(0);
    const [fulfilledLeaveTotal, setFulfilledLeaveTotal] = useState(0);
    const [rejectedLeaveTotal, setRejectedLeaveTotal] = useState(0);
    const [pendingAttendanceTotal, setPendingAttendanceTotal] = useState(0);
    const [fulfilledAttendanceTotal, setFulfilledAttendanceTotal] = useState(0);
    const [rejectedAttendanceTotal, setRejectedAttendanceTotal] = useState(0);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchPendingLeaveCount();
      fetchFulfilledLeaveCount();
      fetchRejectedLeaveCount();
      fetchPendingAttendanceCount();
      fetchFulfilledAttendanceCount();
      fetchRejectedAttendanceCount();
    
  
      // Update date and time every second
      const intervalId = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
  
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
  
  
    const fetchPendingLeaveCount = () => {
      axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/pending_leave_count").then((result) => {
        if (result.data.Status) {
          setPendingLeaveTotal(result.data.Result[0].pendingLeaveCount);
        }
      });
    };
  
    const fetchFulfilledLeaveCount = () => {
      axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/fulfilled_leave_count").then((result) => {
        if (result.data.Status) {
          setFulfilledLeaveTotal(result.data.Result[0].fulfilledLeaveCount);
        }
      });
    };
  
    const fetchRejectedLeaveCount = () => {
      axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/rejected_leave_count").then((result) => {
        if (result.data.Status) {
          setRejectedLeaveTotal(result.data.Result[0].rejectedLeaveCount);
        }
      });
    };

    const fetchPendingAttendanceCount = () => {
      axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/pending_count").then((result) => {
        if (result.data.Status) {
          setPendingAttendanceTotal(result.data.Result);
        }
      });
    };
  
    const fetchFulfilledAttendanceCount = () => {
      axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth//fulfilled_count").then((result) => {
        if (result.data.Status) {
          setFulfilledAttendanceTotal(result.data.Result);
        }
      });
    };
  
    const fetchRejectedAttendanceCount = () => {
      axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/rejected_count").then((result) => {
        if (result.data.Status) {
          setRejectedAttendanceTotal(result.data.Result);
        }
      });
    };
  
    const handleBack = () => {
      navigate(-1); // Navigate back in the history
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
  
    return (
      <div>
        <div className="dashboard-container" style={{ fontFamily: 'Montserrat' }}>
          <div className="ms-5 mt-3">
            <button className="btn btn-back-color rounded-pill mt-3" onClick={handleBack}>
              <i className="bi bi-arrow-left-circle"></i>
            </button>
          </div>
  
          <div
            className="dashboard-container mt-3"
            style={{ fontFamily: "Montserrat" }}
          >
            <div className="d-flex justify-content-around mt-2">
              <div
                className="col-md-10"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
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
                    color: "white",
                  }}
                >
                  Welcome to Payroll Dashboard!
                </span>
                
                <span
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight:'bold',
                    color:'#ccc',
                    fontSize: "26px",
                    marginLeft: "60px",
                  }}
                >
                Today is {formatDateTime(currentDateTime)}
                </span>
              </div>
            </div>
          </div>
  
          <div className="dashboard-container" style={{ fontFamily: 'Montserrat' }}>
        <div className="d-flex justify-content-around mt-3">
          <div className="col-md-10" style={{ backgroundColor: 'white', padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
            <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="fs-4 bi-calendar-check me-2"></i>Attendance</span>
            <div className="d-flex justify-content-start">
              <div className="col-md-2 me-2">
                <div className="card attendance-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title">PENDING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{pendingAttendanceTotal}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-2 me-2">
                <div className="card attendance-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px', marginLeft: '120px' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title">FULFILLED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{fulfilledAttendanceTotal}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-2 me-2">
                <div className="card attendance-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px', marginLeft: '250px' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title">REJECTED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{rejectedAttendanceTotal}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
        <div className="dashboard-container mt-4" style={{ fontFamily: 'Montserrat' }}>
          <div className="d-flex justify-content-around mt-3">
            <div className="col-md-10" style={{ backgroundColor: 'white', padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}><i className="fs-4 bi-calendar3 me-2"></i>Leave</span>
              <div className="d-flex justify-content-start">
                <div className="col-md-2 me-2">
                  <div className="card leave-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">PENDING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{pendingLeaveTotal}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 me-2">
                  <div className="card leave-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px',  marginLeft:'120px' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">FULFILLED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{fulfilledLeaveTotal}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 me-2">
                  <div className="card leave-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px', marginLeft:'250px' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">REJECTED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{rejectedLeaveTotal}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
  
      </div>
    </div>
    );
  };

export default PayrollHome
