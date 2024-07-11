import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [departmentTotal, setDepartmentTotal] = useState(0);
  const [projectTotal, setProjectTotal] = useState(0);
  const [positionTotal, setPositionTotal] = useState(0);
  const [pendingLeaveTotal, setPendingLeaveTotal] = useState(0);
  const [fulfilledLeaveTotal, setFulfilledLeaveTotal] = useState(0);
  const [rejectedLeaveTotal, setRejectedLeaveTotal] = useState(0);
  const [activeEmployeeTotal, setActiveEmployeeTotal] = useState(0);
  const [inactiveEmployeeTotal, setInactiveEmployeeTotal] = useState(0);
  const [newEmployeeTotal, setNewEmployeeTotal] = useState(0);
  const [pendingAttendanceTotal, setPendingAttendanceTotal] = useState(0);
  const [fulfilledAttendanceTotal, setFulfilledAttendanceTotal] = useState(0);
  const [rejectedAttendanceTotal, setRejectedAttendanceTotal] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    adminCount();
    employeeCount();
    departmentCount();
    projectCount();
    positionCount();
    fetchPendingLeaveCount();
    fetchFulfilledLeaveCount();
    fetchRejectedLeaveCount();
    fetchNewEmployeeCount();
    fetchEmployeeStatusCounts();
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

  const adminCount = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/admin_count").then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const employeeCount = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee_count").then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const fetchEmployeeStatusCounts = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee_status_counts").then((result) => {
      if (result.data.Status) {
        setActiveEmployeeTotal(result.data.Result.activeCount);
        setInactiveEmployeeTotal(result.data.Result.inactiveCount);
      }
    });
  };

  const fetchNewEmployeeCount = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/new_employee_count").then((result) => {
      if (result.data.Status) {
        setNewEmployeeTotal(result.data.Result);
      }
    });
  };

  const departmentCount = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/department_count").then((result) => {
      if (result.data.Status) {
        setDepartmentTotal(result.data.Result[0].department);
      }
    });
  };

  const projectCount = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/project_count").then((result) => {
      if (result.data.Status) {
        setProjectTotal(result.data.Result[0].project);
      }
    });
  };

  const positionCount = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/position_count").then((result) => {
      if (result.data.Status) {
        setPositionTotal(result.data.Result[0].position);
      }
    });
  };

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
          <Link to="/dashboard/createadmin" className='btn btn-color rounded-pill ms-3 mt-3 no-underline'>
            <i className="bi bi-plus-circle me-1"></i> <span className="btn-text" style={{ fontStyle: 'Montserrat' }}>Admin</span>
          </Link>
          <Link to="/dashboard/createrecruitment" className='btn btn-color rounded-pill ms-2 mt-3 no-underline'>
            <i className="bi bi-plus-circle me-1"></i> <span className="btn-text" style={{ fontStyle: 'Montserrat' }}>Recruitment</span>
          </Link>
          <Link to="/dashboard/createpayroll" className='btn btn-color rounded-pill ms-2 mt-3 no-underline'>
            <i className="bi bi-plus-circle me-1"></i> <span className="btn-text" style={{ fontStyle: 'Montserrat' }}>Payroll</span>
          </Link>
        </div>

        <div className="dashboard-container mt-3" style={{ fontFamily: "Montserrat" }}>
          <div className="d-flex justify-content-around mt-2">
            <div className="col-md-10" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", padding: "20px", boxShadow: "10 20px 6px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
              <span style={{ fontFamily: "Montserrat", fontWeight: "bold", fontSize: "30px", color: "white" }}>Welcome to Admin Dashboard!</span>
              <span style={{ fontFamily: "Montserrat", fontWeight: 'bold', color: '#ccc', fontSize: "26px", marginLeft: "60px" }}>
                Today is {formatDateTime(currentDateTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-around mt-3">
          <div className="col-md-10" style={{ backgroundColor: 'white', padding: '20px', boxShadow: '10 20px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <i className="bi-graph-up-arrow me-2"></i>
            <span style={{ fontFamily: 'Montserrat', fontSize: '20px' }}>Statistics</span>
            <div className="d-flex justify-content-between">
              <div className="col-md-2 me-2">
               
                  <div className="card stat-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">ADMIN</h4>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="total-label">Total:</span>
                        <span>{adminTotal}</span>
                      </div>
                    </div>
                  </div>
                

                <Link to="/dashboard/position" className="no-underline">
                  <div className="card stat-card border-5 rounded-3 shadow-sm dashboard-card mt-2" style={{ borderBlockColor: '#ff8800' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">POSITION</h4>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="total-label">Total:</span>
                        <span>{positionTotal}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-3 me-2">
                <Link to="/dashboard/employee" className="no-underline">
                  <div className="card stat-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">EMPLOYEE</h4>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="total-label">Total:</span>
                        <span>{employeeTotal}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="card border-2 rounded-2 shadow-sm mt-2" style={{ backgroundColor: 'rgba(0, 128, 0, 0.6)' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title" style={{ color: 'wheat' }}>ACTIVE EMPLOYEE</h4>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="total-label">Total:</span>
                      <span style={{ color: 'wheat', fontSize: "18px" }}>{activeEmployeeTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 me-2">
                <Link to="/dashboard/department" className="no-underline">
                  <div className="card stat-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">DEPARTMENT</h4>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="total-label">Total:</span>
                        <span>{departmentTotal}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="card border-2 rounded-2 shadow-sm mt-2" style={{ backgroundColor: 'rgba(255, 0, 0, 0.6)' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title" style={{ color: 'wheat' }}>INACTIVE EMPLOYEE</h4>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="total-label">Total:</span>
                      <span style={{ color: 'wheat', fontSize: "18px" }}>{inactiveEmployeeTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 me-2">
                <Link to="/dashboard/project" className="no-underline">
                  <div className="card stat-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800' }}>
                    <div className="card-body text-center">
                      <h4 className="card-title">PROJECT/UNIT</h4>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="total-label">Total:</span>
                        <span>{projectTotal}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="card border-2 rounded-2 shadow-sm mt-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title" style={{ color: 'wheat' }}>NEW HIRES</h4>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="total-label">Total:</span>
                      <span style={{ color: 'wheat', fontSize: "18px" }}>{newEmployeeTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link to="/dashboard/attendance" className="no-underline">
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
      </Link>

      <Link to="/dashboard/leave" className="no-underline">
      <div className="dashboard-container" style={{ fontFamily: 'Montserrat' }}>
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
                <div className="card leave-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px', marginLeft: '120px' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title">FULFILLED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{fulfilledLeaveTotal}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-2 me-2">
                <div className="card leave-card border-5 rounded-3 shadow-sm dashboard-card" style={{ borderBlockColor: '#ff8800', width: '270px', height: '70px', marginLeft: '250px' }}>
                  <div className="card-body text-center">
                    <h4 className="card-title">REJECTED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{rejectedLeaveTotal}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Link>

    </div>
  );
};

export default Home;
