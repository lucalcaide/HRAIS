import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAttendance = () => {
  const { id } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const attendancePerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee details
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee/${id}`)
      .then(response => {
        if (response.data.Status) {
          const employee = response.data.Result[0];
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

  const handleDelete = (recordId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attendance record?");
    if (confirmDelete) {
      axios.delete(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/delete/${recordId}`)
        .then(response => {
          if (response.data.Status) {
            toast.success("Attendance record deleted successfully!");
            setAttendance(attendance.filter(record => record.id !== recordId));
          } else {
            toast.error(response.data.Error);
          }
        })
        .catch(err => {
          toast.error("Failed to delete attendance record.");
        });
    }
  };

  const handleDateChange = () => {
    setCurrentPage(1); // Reset to the first page on date change
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

  return (
    <div>
      <div>
        <button className="btn btn-back-color rounded-pill ms-5 mt-3" style={{ marginRight: '10px' }} onClick={handleBack}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>
      </div>
      <div className="container mt-3">
        <h2 className="mb-4" style={{ fontSize: '35px', fontFamily: 'Montserrat' }}>
          Attendance Records for : <span style={{ fontWeight: 'bold', }}>{employeeName}</span>
        </h2>

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
                    <Link to={`/dashboard/attendance/view_full_attendance_details/${record.id}`} className="btn btn-outline-dark me-2" style={{ fontWeight: 'bold' }}>
                      Full Details
                    </Link>
                    <button onClick={() => handleDelete(record.id)} className="btn btn-outline-danger" style={{ fontWeight: 'bold' }}>
                      Delete
                    </button>
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
  );
};

export default ViewAttendance;
