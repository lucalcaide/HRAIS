import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FilesApplicationForm = () => {
  const [employee, setEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [totalApplicationForms, setTotalApplicationForms] = useState(0); // State for total application_form
  const employeesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          const sortedEmployees = result.data.Result.sort((a, b) => {
            const nameA = `${a.lname}, ${a.fname} ${a.mname}`.toLowerCase();
            const nameB = `${b.lname}, ${b.fname} ${b.mname}`.toLowerCase();
            return nameA.localeCompare(nameB);
          });
          setEmployee(sortedEmployees);
          // Calculate total application_form
          const total = sortedEmployees.reduce((acc, curr) => acc + (curr.application_form ? 1 : 0), 0);
          setTotalApplicationForms(total);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id, emp_no) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the Application Forms for employee number '${emp_no}'?`);
    if (confirmDelete) {
      axios.delete(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/delete_application_form/${id}`)
        .then(result => {
          if (result.data.Status) {
            // Update state first
            setEmployee(employee.filter(e => e.id !== id));
            // Then show toast
            toast.success(`Application Forms for employee number '${emp_no}' deleted successfully!`);
            // Update total application_form count
            setTotalApplicationForms(prev => prev - 1);
          } else {
            toast.error(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    } else {
      toast.info(`Deletion of Application Forms for employee ${emp_no} cancelled.`);
    }
    window.location.reload();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleFileChange = (id, emp_no, event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('application_form', file);

      axios.post(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/upload_application_form/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(result => {
          if (result.data.Status) {
            setEmployee(employee.map(e => e.id === id ? { ...e, application_form: result.data.application_form } : e));
            toast.success(`Application Form for employee number '${emp_no}' uploaded successfully!`);
            // Update total application_form count
            setTotalApplicationForms(prev => prev + 1);
          } else {
            toast.error(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    }
  };

  const filteredEmployees = employee.filter(e => {
    return e.emp_no.toString().includes(searchQuery) ||
      `${e.fname} ${e.mname} ${e.lname}`.toLowerCase().includes(searchQuery);
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = showAll ? filteredEmployees : filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEmployees.length / employeesPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleBack = () => {
    navigate("/dashboard/201Files");
  };

  return (
    <div className='px-5 mt-3 employee fontstyle'>
      <div className='d-flex justify-content-center mb-2 print-hide'>
        <span style={{ fontSize: '35px' }}> APPLICATION FORMS</span>
      </div>
      <div className='d-flex justify-content-start mb-2 print-hide'>
        <button className="btn btn-back-color rounded-pill" style={{ marginRight: '10px' }} onClick={handleBack}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>
      </div>

      <div className="input-group mt-3 print-hide">
        <input
          type="text"
          placeholder="Search employee number or name..."
          className="form-control form-control-lg rounded-3"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Pagination */}
      <div className="pagination mt-3 d-flex justify-content-end" style={{ display: showAll ? 'none' : 'flex' }}>
        <button
          onClick={prevPage}
          className="btn btn-color"
          disabled={currentPage === 1}
        >
          <i className="bi bi-caret-left-fill me-2" style={{ fontSize: '20px' }}></i>
          Previous
        </button>

        <span className="btn btn-color" style={{ margin: '0 3px', fontSize: '18px' }}>
          Page {currentPage} of {Math.ceil(filteredEmployees.length / employeesPerPage)}
        </span>

        <button
          onClick={nextPage}
          className="btn btn-color"
          disabled={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage)}
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

      {/* Display total application_form */}
      <div className="mt-1">
        <p style={{fontSize:'20px'}}>Total Application Forms: {totalApplicationForms}</p>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="text-center mt-3" style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>
          No Result Found.
        </div>
      ) : (
        <div className='mt-3 employee'>
          <div className='mt-3' id="employee-table">
            {currentEmployees.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th style={{ fontSize: '18px' }}>Employee No.</th>
                      <th style={{ fontSize: '18px' }}>Employee Name</th>
                      <th style={{ fontSize: '18px' }}>File Name</th>
                      <th style={{ fontSize: '18px' }}>Application Form</th>
                      <th style={{ fontSize: '18px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.map(e => (
                      <tr key={e.id}>
                        <td style={{ fontSize: '27px' }}>{e.emp_no}</td>
                        <td style={{ fontSize: '23px' }}>{e.lname}, {e.fname} {e.mname}</td>
                        <td style={{ fontSize: '20px', fontStyle:'italic'}}>{e.application_form}</td>
                        <td style={{ fontSize: '18px' }}>
                          {e.application_form ? (
                            <a href={`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/ApplicationForms/` + e.application_form} className='btn btn-file-color btn-file-text rounded-pill' target="_blank" rel="noopener noreferrer">View Application Form</a>
                          ) : (
                            <span style={{ color: 'gray', fontWeight: 'bold', fontSize: '23px' }}>No application form uploaded</span>
                          )}
                        </td>
                        <td style={{ fontSize: '18px' }}>
                          {!e.application_form && (
                            <>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(event) => handleFileChange(e.id, e.emp_no, event)}
                                style={{ display: 'none' }}
                                id={`fileInput-${e.id}`}
                              />
                              <label htmlFor={`fileInput-${e.id}`} className="bi bi-box-arrow-up btn btn-light rounded-pill" style={{marginRight:'5px', fontSize:'23px'}}>
                              
                              </label>
                            </>
                          )}
                          {e.application_form && (
                            <button className="bi bi-trash btn btn-outline-dark rounded-pill"style={{ fontSize:'23px'}} onClick={() => handleDelete(e.id, e.emp_no)}>
                              
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center" style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>
                No Result Found.
              </div>
            )}
          </div>
        </div>
      )}
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

export default FilesApplicationForm