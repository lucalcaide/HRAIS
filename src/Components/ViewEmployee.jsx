import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import Webcam from 'react-webcam';

const ViewEmployee = () => {
  const [employee, setEmployee] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/detail/${id}`)
      .then(result => {
        setEmployee(result.data[0]);
      })
      .catch(err => console.log(err));
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

  const handleResetPassword = () => {
    const firstConfirmation = window.confirm(`Are you sure you want to reset ${employee.fname} ${employee.lname}'s password?`);
    if (firstConfirmation) {
      const secondConfirmation = window.confirm(`This action will make ${employee.fname} ${employee.lname} unable to access their account. Do you want to proceed?`);
      if (secondConfirmation) {
        axios.put(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/reset_password/${id}`)
          .then(response => {
            if (response.data.Status) {
              toast.success('Password reset successfully.');
            } else {
              toast.error(`Error: ${response.data.Error}`);
            }
          })
          .catch(err => console.log(err));
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    const printContents = document.getElementById('employee-table').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpdate = () => {
    if (!image) {
      toast.error('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    axios.put(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/update_employee_image/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      if (response.data.Status) {
        toast.success('Image updated successfully.');
        setEmployee({ ...employee, image: response.data.newImage });
      } else {
        toast.error(`Error: ${response.data.Error}`);
      }
    })
    .catch(err => console.log(err));
    window.location.reload();
  };

  const handleExportToExcel = () => {
    const employeeData = [
      ['Field', 'Value'],
      ['Employee Number', employee.emp_no],
      ['Full Name', `${employee.lname}, ${employee.fname} ${employee.mname}`],
      ['Gender', employee.gender],
      ['Phone Number', employee.phone_number],
      ['Address', employee.perma_address],
      ['Emergency Contact Name', employee.emergency_name],
      ['Relationship', employee.emergency_relationship],
      ['Phone Number', employee.emergency_phone_number],
      ['Joined on', formatDate(employee.date_hired)],
      ['Department', employee.department],
      ['Project/Unit', employee.project],
      ['Position', employee.position],
      ['Birthday', formatDate(employee.birth_date)],
      ['Email', employee.email],
      ['Paid Every', employee.pay_frequency],
      ['Daily Rate', `₱${employee.rate_per_day}`],
      ['Hourly Rate', `₱${employee.rate_per_hour}`],
      ['Salary', `₱${employee.salary}`],
      ['Status', employee.employee_status],
      ['Terminated on', employee.employee_status === 'Active' ? 'N/A' : formatDate(employee.term_date)],
      ['Time in', employee.start_time ? formatTime(employee.start_time) : 'N/A'],
      ['Time out', employee.out_time ? formatTime(employee.out_time) : 'N/A'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(employeeData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Details');
    XLSX.writeFile(wb, `${employee.emp_no}_employee_details.xlsx`);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
        setImage(file);
      });
    setShowCamera(false);
  };

  return (
    <div>
      <div className='d-flex justify-content-center mt-3'>
        <span className="mb-3" style={{ fontSize: '35px', fontFamily: 'Montserrat' }}>EMPLOYEE FULL INFORMATION</span>
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

      <button className="btn btn-back-color rounded-pill btn-text" style={{ marginRight: '10px' }} onClick={handleResetPassword}>
        Reset Password
      </button>
      
      <Link to={`/update_employee_password/` + id} className='btn btn-back-color rounded-pill'>
        <span className="btn-text" style={{ fontStyle: 'Montserrat' }}>Create New Password</span>
      </Link>

      <div id="print-area" className='container mt-1'>
        <div className='row'>
          <div className='col-md-4 text-center'>
          </div>

          <div className='row justify-content-center mt-3'>
            <div className='col-md-8' id="employee-table">
              <table className="table table-bordered" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <tbody>
                <tr>
                    <th colSpan="2" style={{fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4' }}>Employee Full Information</th>
                  </tr>
                  <tr>
                    <th style={{ width: '200px', fontFamily: 'Montserrat' }}>Image:</th>
                    <td>
                    <img
                        src={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Images/` + employee.image}
                        className='img-fluid rounded-circle mb-3 mt-3 emp_det_image ms-5'
                        alt="Employee"
                        style={{ border: '2px solid #000' }}
                      />
                      <input className="btn rounded-3 ms-3 print-hide-actions"
                        style={{ marginRight: '50px' }}
                        type="file" onChange={handleImageChange} />

                      <button className="btn btn-back-color rounded-3 ms-2 print-hide-actions" onClick={handleImageUpdate}>Update Image</button>
              
                      <button className="btn rounded-3 ms-4 print-hide-actions" onClick={() => setShowCamera(true)}>
        
                      <i className='bi bi-camera-fill' style={{ fontSize:'23px', marginRight:'5px'}}></i>Capture Image</button>
                      {showCamera && (
                        <div className="webcam-container" style={{ width: '200px', height: '200px' }}>
    
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={200}
                            height={200}
                            videoConstraints={{ width: 200, height: 200 }}
                          />
                          <button className="btn btn-back-color rounded-3 ms-2 print-hide-actions" onClick={capture}>Capture</button>
                        </div>
                      )}
                    </td>
                  </tr>
                  
                  <tr>
                    <th colSpan="2" style={{fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4' }}>Personal Details</th>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', width: '200px', fontFamily: 'Montserrat' }}>Employee Number:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.emp_no}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', width: '200px', fontFamily: 'Montserrat' }}>Full Name:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{`${employee.lname}, ${employee.fname} ${employee.mname}`}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Gender:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.gender}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Birthday:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{formatDate(employee.birth_date)}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Phone Number:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.phone_number}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Address:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.perma_address}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Email:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.email}</td>
                  </tr>

                  <tr>
                    <th colSpan="2" style={{ fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4' }}>Emergency Contact Person</th>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Full Name:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.emergency_name}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Relationship:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.emergency_relationship}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Phone Number:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.emergency_phone_number}</td>
                  </tr>
                  
                  <tr>
                    <th colSpan="2" style={{ fontSize: '25px', padding: '10px', fontFamily: 'Montserrat', textAlign: 'center', backgroundColor: '#ded4d4' }}>Employment Details</th>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Joined on:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{formatDate(employee.date_hired)}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Department:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.department}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Project/Unit:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.project}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Position:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.position}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Paid Every:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.pay_frequency}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Daily Rate:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>₱{employee.rate_per_day}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Hourly Rate:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>₱{employee.rate_per_hour}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Salary:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>₱{employee.salary}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Status:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.employee_status}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Terminated on:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.employee_status === 'Active' ? 'N/A' : formatDate(employee.term_date)}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Time in:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.start_time ? formatTime(employee.start_time) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: '20px', padding: '10px', fontFamily: 'Montserrat' }}>Time out:</th>
                    <td style={{ fontSize: '24px', padding: '10px' }}>{employee.out_time ? formatTime(employee.out_time) : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
      position="top-center" 
      style={{ 
        fontSize: '20px', 
        width: '500px', 
        padding: '20px', 
        borderRadius: '10px', }}/>
    </div>
  );
};

export default ViewEmployee;