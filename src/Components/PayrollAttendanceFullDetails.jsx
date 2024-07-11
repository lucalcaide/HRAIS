import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const PayrollAttendanceFullDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const [isEditingExtra, setIsEditingExtra] = useState(false);
  const [isEditingHoursWorked, setIsEditingHoursWorked] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingLate, setIsEditingLate] = useState(false);
  const [newExtra, setNewExtra] = useState('');
  const [newHoursWorked, setNewHoursWorked] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newLate, setNewLate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/details/${id}`)
      .then(response => {
        if (response.data.Status) {
          setDetails(response.data.Result);
          setNewExtra(response.data.Result.extra);
          setNewHoursWorked(response.data.Result.hours_worked);
          setNewStatus(response.data.Result.status);
          setNewLate(response.data.Result.late);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to fetch attendance details.");
      });
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditExtraClick = () => {
    setIsEditingExtra(true);
  };

  const handleSaveExtraClick = () => {
    axios.post(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/update/${id}`, { extra: newExtra })
      .then(response => {
        if (response.data.Status) {
          toast.success("Extra minutes updated successfully!");
          setDetails(response.data.Result);
          setIsEditingExtra(false);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to update extra minutes.");
      });
  };

  const handleEditHoursWorkedClick = () => {
    setIsEditingHoursWorked(true);
  };

  const handleSaveHoursWorkedClick = () => {
    axios.post(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/update/${id}`, { hours_worked: newHoursWorked })
      .then(response => {
        if (response.data.Status) {
          toast.success("Hours worked updated successfully!");
          setDetails(response.data.Result);
          setIsEditingHoursWorked(false);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to update hours worked.");
      });
  };

  const handleEditStatusClick = () => {
    setIsEditingStatus(true);
  };

  const handleSaveStatusClick = () => {
    axios.post(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/update/${id}`, { status: newStatus })
      .then(response => {
        if (response.data.Status) {
          toast.success("Status updated successfully!");
          setDetails(response.data.Result);
          setIsEditingStatus(false);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to update status.");
      });
  };

  const handleEditLateClick = () => {
    setIsEditingLate(true);
  };

  const handleSaveLateClick = () => {
    axios.post(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/attendance/update/${id}`, { late: newLate })
      .then(response => {
        if (response.data.Status) {
          toast.success("Late minutes updated successfully!");
          setDetails(response.data.Result);
          setIsEditingLate(false);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error("Failed to update late minutes.");
      });
  };

  const handleExtraChange = (event) => {
    setNewExtra(event.target.value);
  };

  const handleHoursWorkedChange = (event) => {
    setNewHoursWorked(event.target.value);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleLateChange = (event) => {
    setNewLate(event.target.value);
  };

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

  const handlePrint = () => {
    const printContents = document.getElementById('attendance-table').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleExportToExcel = () => {
    const attendanceData = [
      [ 'Name', 'Date', 'Time In', 'Time Out', 'Status', 'Rate Per Hour', 'Rate Per Minute', 'Hours Worked', 'Late', 'Extra', 'Earnings', 'Tardiness', 'Overtime', 'Total Amount to Pay'],
      [ details.name, formatDate(details.date), formatTime(details.time_in), formatTime(details.time_out), details.status, `₱${details.rate_per_hour}`, `₱${details.rate_per_minute}`, `${details.hours_worked} hours`, `${details.late} minutes`, `${details.extra} minutes`, `₱${details.earnings}`, `- ₱${details.tardiness}`, `+ ₱${details.overtime}`, `₱${details.total_amount_pay}`]
    ];

    const ws = XLSX.utils.aoa_to_sheet(attendanceData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Details');
    XLSX.writeFile(wb, `${details.name}_${formatDate(details.date)}_attendance_details.xlsx`);
  };

  return (
    <div>
      <div className='d-flex justify-content-center mt-3'>
        <span className="mb-3" style={{ fontSize: '35px', fontFamily: 'Montserrat' }}>ATTENDANCE FULL DETAILS</span>
      </div>

      <button className="btn btn-back-color rounded-pill ms-5" style={{ marginRight: '10px' }} onClick={handleBack}>
        <i className="bi bi-arrow-left-circle"></i>
      </button>

      <button className="btn btn-back-color rounded-pill" style={{ marginRight: '10px' }} onClick={handlePrint}>
        <i className="bi bi-printer"></i>
      </button>

      <button className="btn btn-back-color rounded-pill" style={{ marginRight: '10px' }} onClick={handleExportToExcel}>
        <i className="bi bi-file-earmark-excel"></i>
      </button>

      <div id="print-area" className='container mt-1'>
        <div className='row justify-content-center mt-3'>
          <div className='col-md-12' id="attendance-table">
            <table className="table table-bordered" style={{ borderRadius: '15px', overflow: 'hidden', borderCollapse: 'separate', borderSpacing: '0' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} colSpan="2">Attendance Full Details</th>
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
                  <td style={{ fontSize: '24px', padding: '10px' }}>
                    {isEditingStatus ? (
                      <>
                        <select value={newStatus} onChange={handleStatusChange} style={{ fontSize: '20px', width: '150px' }}>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="rejected">Rejected</option>
                          <option value="pending">Pending</option>
                        </select>
                        <button onClick={handleSaveStatusClick} className="btn btn-outline-success ms-2">Save</button>
                      </>
                    ) : (
                      <>
                        {details.status}
                        <button onClick={handleEditStatusClick} className="btn btn-outline-dark ms-2 print-hide-actions">Edit</button>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" style={{ fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4' }}>Payroll Calculation</td>
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
                  <td style={{ fontSize: '24px', padding: '10px' }}>
                    {isEditingHoursWorked ? (
                      <>
                        <input
                          type="number"
                          value={newHoursWorked}
                          onChange={handleHoursWorkedChange}
                          style={{ fontSize: '20px', width: '100px' }}
                        />
                        <button onClick={handleSaveHoursWorkedClick} className="btn btn-outline-success ms-2">Save</button>
                      </>
                    ) : (
                      <>
                        {`${details.hours_worked} hours`}
                        <button onClick={handleEditHoursWorkedClick} className="btn btn-outline-dark ms-2 print-hide-actions">Edit</button>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Late:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>
                    {isEditingLate ? (
                      <>
                        <input
                          type="number"
                          value={newLate}
                          onChange={handleLateChange}
                          style={{ fontSize: '20px', width: '100px' }}
                        />
                        <button onClick={handleSaveLateClick} className="btn btn-outline-success ms-2">Save</button>
                      </>
                    ) : (
                      <>
                        {`${details.late} minutes`}
                        <button onClick={handleEditLateClick} className="btn btn-outline-dark ms-2 print-hide-actions">Edit</button>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Extra:</td>
                  <td style={{ fontSize: '24px', padding: '10px' }}>
                    {isEditingExtra ? (
                      <>
                        <input
                          type="number"
                          value={newExtra}
                          onChange={handleExtraChange}
                          style={{ fontSize: '20px', width: '100px' }}
                        />
                        <button onClick={handleSaveExtraClick} className="btn btn-outline-success ms-2">Save</button>
                      </>
                    ) : (
                      <>
                        {`${details.extra} minutes`}
                        <button onClick={handleEditExtraClick} className="btn btn-outline-dark ms-2 print-hide-actions">Edit</button>
                      </>
                    )}
                  </td>
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
                  <td style={{ fontSize: '25px', padding: '10px', fontWeight: 'bold' }}>{`₱${details.total_amount_pay}`}</td>
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
  );
};


export default PayrollAttendanceFullDetails;
