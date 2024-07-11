import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAttendance = () => {
  const [employee, setEmployee] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState({
    emp_id: id,
    name: "",
    date: "",
    time_in: "",
    time_out: "",
    status: "",
    start_time: "",
    out_time: "",
    rate_per_hour: ""
  });

  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee/${id}`)
      .then(response => {
        if (response.data.Status) {
          const employee = response.data.Result[0];
          const fullName = `${employee.fname} ${employee.mname} ${employee.lname}`;
          setEmployeeName(fullName);
          setAttendanceData(prevData => ({
            ...prevData,
            name: fullName,
            start_time: employee.start_time,
            out_time: employee.out_time,
            rate_per_hour: employee.rate_per_hour
          }));
          setEmployee(employee);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to fetch employee details.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData({
      ...attendanceData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if attendance record for the specified date already exists
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/exists/${id}/${attendanceData.date}`)
      .then(response => {
        if (response.data.Status) {
          if (response.data.Exists) {
            toast.error("Attendance already exists.");
          } else {
            // If no existing record, add the new attendance
            axios.post('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/add_attendance', attendanceData)
              .then(response => {
                if (response.data.Status) {
                  toast.success("Attendance added successfully!");
                  navigate(`/dashboard/attendance/view_all_attendance/${id}`);
                } else {
                  toast.error(response.data.Error);
                }
              })
              .catch(err => toast.error("Failed to add attendance."));
          }
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to check attendance records.");
      });
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

  return (
    <div>
      <div>
        <button className="btn btn-back-color rounded-pill ms-5 mt-3" style={{ marginRight: '10px' }} onClick={handleBack}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>
      </div>

      <div className="container mt-2">
        <div className="d-flex justify-content-start align-items-center">
          <h2 className="mb-4" style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>Add Attendance</h2>
        </div>
        <div style={{ border: '5px solid #ccc', padding: '25px', borderRadius: '10px' }}>
          <form onSubmit={handleSubmit} onReset={() => {
            setAttendanceData({
              emp_id: id,
              name: employeeName,
              date: "",
              time_in: "",
              time_out: "",
              status: "",
              start_time: employee.start_time,
              out_time: employee.out_time,
              rate_per_hour: employee.rate_per_hour
            });
          }}>
            <div className="mb-3">
              <label htmlFor="employee_name" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Name</label>
              <input
                style={{ fontStyle: 'italic', fontSize: '22px', fontFamily: 'Montserrat' }}
                type="text"
                className="form-control"
                id="employee_name"
                name="name"
                value={employeeName}
                readOnly
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="start_time" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Start Time</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="text"
                className="form-control"
                id="start_time"
                name="start_time"
                value={formatTime(attendanceData.start_time)}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="out_time" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Out Time</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="text"
                className="form-control"
                id="out_time"
                name="out_time"
                value={formatTime(attendanceData.out_time)}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="rate_per_hour" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Hourly Rate</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="int"
                className="form-control"
                id="rate_per_hour"
                name="rate_per_hour"
                value={attendanceData.rate_per_hour}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Date</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={attendanceData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="time_in" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Time in</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="time"
                className="form-control"
                id="time_in"
                name="time_in"
                value={attendanceData.time_in}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="time_out" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Time out</label>
              <input
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                type="time"
                className="form-control"
                id="time_out"
                name="time_out"
                value={attendanceData.time_out}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label" style={{ fontSize: '18px', fontFamily: 'Montserrat' }}>Status</label>
              <select
                style={{ fontSize: '22px', fontFamily: 'Montserrat' }}
                className="form-control"
                id="status"
                name="status"
                value={attendanceData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-color rounded-pill mt-3">Add Attendance</button>
              <button type="reset" className="btn btn-outline-secondary rounded-pill mt-3">Reset Form</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        style={{
          fontSize: '20px',
          width: '500px', // Adjust width as needed
          padding: '20px', // Adjust padding as needed
          borderRadius: '10px', // Adjust border radius as needed
        }}
      />
    </div>
  );
};

export default AddAttendance;
