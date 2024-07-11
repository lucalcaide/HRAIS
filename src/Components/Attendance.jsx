import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx'; // Importing the xlsx library

const Attendance = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();
  const [attendanceStatusCounts, setAttendanceStatusCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payFrequencyFilter, setPayFrequencyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const employeesPerPage = 5;

  useEffect(() => {
    axios.get('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee')
      .then(result => {
        if (result.data.Status) {
          const sortedEmployees = result.data.Result.sort((a, b) => {
            if (a.lname.toLowerCase() < b.lname.toLowerCase()) return -1;
            if (a.lname.toLowerCase() > b.lname.toLowerCase()) return 1;
            if (a.fname.toLowerCase() < b.fname.toLowerCase()) return -1;
            if (a.fname.toLowerCase() > b.fname.toLowerCase()) return 1;
            if (a.mname.toLowerCase() < b.mname.toLowerCase()) return -1;
            if (a.mname.toLowerCase() > b.mname.toLowerCase()) return 1;
            return 0;
          });
          setEmployee(sortedEmployees);
          fetchAttendanceStatusCounts(sortedEmployees);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  }, []);

  const fetchAttendanceStatusCounts = (employees) => {
    employees.forEach(e => {
      axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee_attendance_status_counts/${e.id}`)
        .then(result => {
          if (result.data.Status) {
            setAttendanceStatusCounts(prevState => ({
              ...prevState,
              [e.id]: result.data.Result
            }));
          }
        }).catch(err => console.log(err));
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);  // Reset to the first page on search
  };

  const handleFilter = (status = "", frequency = "") => {
    setStatusFilter(status);
    setPayFrequencyFilter(frequency);
    setDateFilter(false); // Reset date filter when other filters are applied
    setCurrentPage(1);
  };

  const getLastMonthDate = () => {
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
    return lastMonth.toISOString().split('T')[0];
  };

  const filteredEmployees = employee.filter(e => {
    const isStatusMatch = statusFilter ? e.employee_status === statusFilter : true;
    const isFrequencyMatch = payFrequencyFilter ? e.pay_frequency === payFrequencyFilter : true;
    const isSearchMatch = `${e.fname} ${e.mname} ${e.lname}`.toLowerCase().includes(searchQuery) ||
      e.project.toLowerCase().includes(searchQuery);
    const isDateMatch = dateFilter ? e.date_hired >= getLastMonthDate() : true;
    const isActiveEmployee = e.employee_status !== "Inactive"; // Exclude Inactive employees
  
    return isStatusMatch && isFrequencyMatch && isSearchMatch && isDateMatch && isActiveEmployee;
  });

  const totalEmployees = filteredEmployees.length;
  const weeklyPaidEmployees = filteredEmployees.filter(e => e.pay_frequency === "Weekly").length;
  const monthlyPaidEmployees = filteredEmployees.filter(e => e.pay_frequency === "Monthly").length;

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = showAll ? filteredEmployees : filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalEmployees / employeesPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handlePrint = () => {
    const printContents = document.getElementById('employee-table').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleExportToExcel = () => {
    const exportData = filteredEmployees.map(e => ({
      'Full Name': `${e.lname}, ${e.fname} ${e.mname}`,
      'Department': e.department,
      'Project/Unit': e.project,
      'Position': e.position,
      'Start time': formatTime(e.start_time),
      'Out time': formatTime(e.out_time),
      'Paid Period': e.pay_frequency,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Attendance_Employee_List.xlsx");
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
    <div className='px-5 mt-3 employee fontstyle'>
      <div className='d-flex justify-content-center mb-2 print-hide'>
        <span style={{ fontSize: '35px' }}> ATTENDANCE </span>
      </div>

      <div className='d-flex justify-content-start mb-2 print-hide'>

        <button className="btn btn-back-color rounded-pill" style={{ marginRight: '10px' }} onClick={handleBack}>
        <i className="bi bi-arrow-left-circle"></i>
        </button>

        <button className='btn btn-text btn-sort-color rounded-pill ms-3' onClick={() => handleFilter(statusFilter, "Weekly")}>
          <i className="bi bi-filter me-1"></i>
          Weekly
        </button>

        <button className='btn btn-text btn-sort-color rounded-pill ms-3' onClick={() => handleFilter(statusFilter, "Monthly")}>
          <i className="bi bi-filter me-1"></i>
          Monthly
        </button>
      </div>

      <div className="input-group mt-3 print-hide">
        <input
          type="text"
          placeholder="Search name or project/unit..."
          className="form-control form-control-lg"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className='mt-3 print-hide'>
        <span style={{ fontSize: '20px' }}>Total Active Employees: <span style={{ fontStyle: 'italic', fontSize: '25px' }}>{totalEmployees}</span></span>
        <span style={{ marginLeft: '20px', fontSize: '20px' }}> Weekly Paid Employees: <span style={{ fontStyle: 'italic', fontSize: '25px' }}>{weeklyPaidEmployees}</span></span>
        <span style={{ marginLeft: '20px', fontSize: '20px' }}> Monthly Paid Employees: <span style={{ fontStyle: 'italic', fontSize: '25px' }}>{monthlyPaidEmployees}</span></span>
      </div>

      {/* Pagination */}
      <div className="pagination mt-3 d-flex justify-content-end print-hide" style={{ display: showAll ? 'none' : 'flex' }}>
        
        <button className="btn btn-back-color rounded-pill ms-3" onClick={handlePrint}>
          <i className="bi bi-printer me-1"></i>
        </button>

        <button className="btn btn-back-color rounded-pill ms-3" onClick={handleExportToExcel}>
          <i className="bi bi-file-earmark-excel me-1"></i>
        </button>

        <button className="btn btn-color rounded-pill ms-3" onClick={() => handleFilter("", "")}>
          <i className="bi bi-x-circle me-1"></i>
          Clear
        </button>

        <button
          onClick={prevPage}
          className="btn btn-color ms-3"
          disabled={currentPage === 1}
        >
          <i className="bi bi-caret-left-fill me-2" style={{ fontSize: '20px' }}></i>
          Previous
        </button>

        <span className="btn btn-color" style={{ margin: '0 3px', fontSize: '18px' }}>
          Page {currentPage} of {Math.ceil(totalEmployees / employeesPerPage)}
        </span>

        <button
          onClick={nextPage}
          className="btn btn-color"
          disabled={currentPage === Math.ceil(totalEmployees / employeesPerPage)}
        >
          Next
          <i className="bi bi-caret-right-fill ms-2" style={{ fontSize: '20px' }}></i>
        </button>
        
        <button
          className="btn btn-color rounded-3 ms-3"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Paginated" : "Show All"}
        </button>
      </div>

      <div className='mt-3 employee'>
        <div className='mt-3' id="employee-table">
          {currentEmployees.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ fontSize: '18px' }}>Image</th>
                    <th style={{ fontSize: '18px' }}>Emp No</th>
                    <th style={{ fontSize: '18px' }}>Full Name</th>
                    <th style={{ fontSize: '18px' }}>Project/Unit</th>
                    <th style={{ fontSize: '18px' }}>Hourly Rate</th>
                    <th style={{ fontSize: '18px' }}>Start Time</th>
                    <th style={{ fontSize: '18px' }}>Out Time</th>
                    <th style={{ fontSize: '18px' }}>Paid Period</th>
                    <th style={{ fontSize: '18px' }}>Attendance Status</th>
                    <th style={{ fontSize: '18px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map(e => (
                    <tr key={e.id}>
                      <td>
                        <img src={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Images/` + e.image} alt="" className="employee_image rounded-3 image-size" />
                      </td>
                      <td style={{ fontSize: '18px' }}>{e.emp_no}</td>
                      <td style={{ fontSize: '18px' }}>{e.lname}, {e.fname} {e.mname}</td>
                      <td style={{ fontSize: '18px' }}>{e.project} </td>
                      <td style={{ fontSize: '18px' }}>{e.rate_per_hour}</td>
                      <td style={{ fontSize: '18px' }}>{formatTime(e.start_time)}</td>
                      <td style={{ fontSize: '18px' }}>{formatTime(e.out_time)}</td>
                      <td style={{ fontSize: '18px' }}>{e.pay_frequency}</td>
                      <td style={{ fontSize: '18px' }}>
                        {attendanceStatusCounts[e.id] && (
                          <div>
                            <span className="badge bg-secondary button-uniform-size-badge">Pending: {attendanceStatusCounts[e.id].pendingCount}</span>
                            <span className="badge bg-success  button-uniform-size-badge">Fulfilled: {attendanceStatusCounts[e.id].fulfilledCount}</span>
                            <span className="badge bg-danger button-uniform-size-badge">Rejected: {attendanceStatusCounts[e.id].rejectedCount}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '18px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Link to={`/dashboard/attendance/add_attendance/${e.id}`} className="btn btn-color rounded-3 button-uniform-size-attendance mb-1">
                            Add Attendance
                          </Link>
                          <Link to={`/dashboard/attendance/view_all_attendance/${e.id}`} className="btn btn-color rounded-3 button-uniform-size-attendance">
                            View Attendance
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center mt-3" style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px', minHeight: 'calc(100vh - 500px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No Result Found.
            </div>
          )}
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

export default Attendance;
