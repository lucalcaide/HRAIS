import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx'; // Importing the xlsx library

const RecruitEmployee = () => {
  const [employee, setEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payFrequencyFilter, setPayFrequencyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const employeesPerPage = 5;
  const navigate = useNavigate();

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
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  }, []);

  const handleDelete = (id, emp_no) => {
    const confirmDelete = window.confirm(`Are you sure to delete employee '${emp_no}'?`);

    if (confirmDelete) {
      axios.delete(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/delete_employee/${id}`)
        .then(result => {
          if (result.data.Status) {
            setEmployee(employee.filter(e => e.id !== id));
            toast.success(`Employee '${emp_no}' deleted successfully!`);
          } else {
            toast.error(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    } else {
      toast.info(`Deletion of employee ${emp_no} cancelled.`);
    }
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

  const handleDateFilter = () => {
    setDateFilter(!dateFilter);
    setStatusFilter("");
    setPayFrequencyFilter("");
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
    const isSearchMatch = e.emp_no.toString().includes(searchQuery) ||
      `${e.fname} ${e.mname} ${e.lname}`.toLowerCase().includes(searchQuery) ||
      e.department.toLowerCase().includes(searchQuery) ||
      e.project.toLowerCase().includes(searchQuery) ||
      e.position.toLowerCase().includes(searchQuery);
    const isDateMatch = dateFilter ? e.date_hired >= getLastMonthDate() : true;

    return isStatusMatch && isFrequencyMatch && isSearchMatch && isDateMatch;
  });

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(e => e.employee_status === "Active").length;
  const inactiveEmployees = filteredEmployees.filter(e => e.employee_status !== "Active").length;
  const weeklyPaidEmployees = filteredEmployees.filter(e => e.pay_frequency === "Weekly").length;
  const monthlyPaidEmployees = filteredEmployees.filter(e => e.pay_frequency === "Monthly").length;

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = showAll ? filteredEmployees : filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalEmployees / employeesPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleBack = () => {
    navigate(-1); // Navigate back in the history
  };

  const handlePrint = () => {
    const printContents = document.getElementById('employee-table').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to export data to Excel
  const handleExportToExcel = () => {
    const exportData = filteredEmployees.map(e => ({
      'Employee No.': e.emp_no,
      'Full Name': `${e.lname}, ${e.fname} ${e.mname}`,
      'Status': e.employee_status,
      'Department': e.department,
      'Project/Unit': e.project,
      'Position': e.position,
      'Paid Period': e.pay_frequency,
      'Date Hired': formatDate(e.date_hired)  // Format the date here
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "Employee_List.xlsx");
  };

  return (
    <div className='px-5 mt-3 employee fontstyle'>
      <div className='d-flex justify-content-center mb-2 print-hide'>
        <span style={{ fontSize: '35px' }}> EMPLOYEE LIST</span>
      </div>
      <div className='d-flex justify-content-start mb-2 print-hide'>
        <button className="btn btn-back-color rounded-pill" style={{ marginRight: '10px' }} onClick={handleBack}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>

        <Link to="/recruitmentdashboard/add_employee" className='btn btn-color rounded-pill'>
          <i className="bi bi-plus-circle me-1"></i> <span className="btn-text" style={{ fontStyle: 'Montserrat' }}>Employee</span>
        </Link>

        <button className='btn btn-text btn-sort-color rounded-pill ms-3' onClick={() => handleFilter("Active", payFrequencyFilter)}>
          <i className="bi bi-filter me-1"></i>
          Active
        </button>

        <button className='btn btn-text btn-sort-color rounded-pill ms-3' onClick={() => handleFilter("Inactive", payFrequencyFilter)}>
          <i className="bi bi-filter me-1"></i>
          Inactive
        </button>

        <button className='btn btn-text btn-sort-color rounded-pill ms-3' onClick={() => handleFilter(statusFilter, "Weekly")}>
          <i className="bi bi-filter me-1"></i>
          Weekly
        </button>

        <button className='btn btn-text btn-sort-color rounded-pill ms-3' onClick={() => handleFilter(statusFilter, "Monthly")}>
          <i className="bi bi-filter me-1"></i>
          Monthly
        </button>

        <button className='btn btn-text btn-sort-color rounded-pill ms-3' onClick={handleDateFilter}>
          <i className="bi bi-filter me-1"></i>
          New Hires (Last Month)
        </button>
      </div>

      <div className="input-group mt-3 print-hide">
        <input
          type="text"
          placeholder="Search employee number, name, department, project/unit or position..."
          className="form-control form-control-lg"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className='mt-3 print-hide'>
        <span style={{ fontSize: '20px' }}>Total Employees: <span style={{ fontStyle: 'italic', fontSize: '25px' }}>{totalEmployees}</span></span>
        <span style={{ marginLeft: '20px', fontSize: '20px' }}> Active Employees: <span style={{ fontStyle: 'italic', fontSize: '25px' }}>{activeEmployees}</span></span>
        <span style={{ marginLeft: '20px', fontSize: '20px' }}> Inactive Employees: <span style={{ fontStyle: 'italic', fontSize: '25px' }}>{inactiveEmployees}</span></span>
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
                    <th style={{ fontSize: '18px' }}>Employee No.</th>
                    <th style={{ fontSize: '18px' }}>Full Name</th>
                    <th style={{ fontSize: '18px' }}>Status</th>
                    <th style={{ fontSize: '18px' }}>Department</th>
                    <th style={{ fontSize: '18px' }}>Project/Unit</th>
                    <th style={{ fontSize: '18px' }}>Position</th>
                    <th style={{ fontSize: '18px' }}>Paid Period</th>
                    <th className="print-hide-actions" style={{ fontSize: '18px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map(e => (
                    <tr key={e.id}>
                      <td>
                        <img src={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/Images/` + e.image} alt="" className="rounded-3 employee_image image-size" />
                      </td>
                      <td style={{ fontSize: '27px' }}>{e.emp_no}</td>
                      <td style={{ fontSize: '18px' }}>{e.lname}, {e.fname} {e.mname}</td>
                      <td>
                        <span className='rounded-3' style={{ fontSize: '18px', backgroundColor: e.employee_status === 'Active' ? 'green' : 'red', color: 'white', padding: '5px', borderRadius: '3px', fontWeight: 'bold' }}>
                          {e.employee_status}
                        </span>
                      </td>
                      <td style={{ fontSize: '18px' }}>{e.department}</td>
                      <td style={{ fontSize: '18px' }}>{e.project} </td>
                      <td style={{ fontSize: '18px' }}>{e.position}</td>
                      <td style={{ fontSize: '18px' }}>{e.pay_frequency}</td>
                      <td className="print-hide-actions">
                        <Link
                          to={`/recruitmentdashboard/view_employee/` + e.id}
                          className="bi bi-eye btn btn-light btn-sm mb-2"
                          title="View employee"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                        </Link>

                        <Link
                          to={`/recruitmentdashboard/edit_employee/` + e.id}
                          className="bi bi-pencil btn btn-light btn-sm mb-2"
                          title="Edit employee"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                        </Link>

                        <button
                          className="bi bi-trash btn btn-light btn-sm mb-2"
                          onClick={() => handleDelete(e.id, e.emp_no)}
                          title="Delete employee"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                        </button>
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
export default RecruitEmployee
