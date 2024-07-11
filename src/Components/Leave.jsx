import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';


const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const leavesPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    axios.get('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/leave')
      .then(response => {
        if (response.data.Status) {
          setLeaves(response.data.Result);
        } else {
          setError(response.data.Error);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteLeave = (id) => {
    if (window.confirm('Are you sure to delete this leave record?')) {
      axios.delete(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/delete_leave/${id}`)
        .then(response => {
          if (response.data.Status) {
            setLeaves(leaves.filter(leave => leave.id !== id));
            toast.success(`Leave record deleted successfully.`);
          } else {
            toast.error(response.data.Error);
          }
        })
        .catch(err => {
          toast.error('Error deleting leave record: ' + err.message);
          console.error('Error details:', err);
        });
    }
  };

  const formatDate = (dateString, includeTime = true) => {
    const options = includeTime
      ? { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleStatusUpdate = (id, status) => {
    axios.put(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/update_leave/${id}`, { status })
      .then(response => {
        if (response.data.Status) {
          setLeaves(leaves.map(leave => 
            leave.id === id ? { ...leave, status } : leave
          ));
          toast.success(`Leave status updated to ${status}.`);
        } else {
          toast.error(response.data.Error);
        }
      })
      .catch(err => {
        toast.error('Error updating status: ' + err.message);
        console.error('Error details:', err);
      });
  };

  const handleCancelLeave = (id) => {
    handleStatusUpdate(id, 'pending');
  };

  const applyFilter = (status) => {
    setFilter(status);
    setCurrentPage(1);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setCurrentPage(1);
  };

  const filteredLeaves = leaves.filter(leave => {
    const leaveDate = new Date(leave.start_date);
    const monthMatches = selectedMonth === 'all' || leaveDate.getMonth() + 1 === parseInt(selectedMonth);
    const yearMatches = selectedYear === 'all' || leaveDate.getFullYear() === parseInt(selectedYear);
    return monthMatches && yearMatches && (filter === 'all' || leave.status === filter) &&
      (leave.name.toLowerCase().includes(searchQuery) || leave.leave_no.toLowerCase().includes(searchQuery));
  });

  const totalLeaves = {
    all: leaves.length,
    pending: leaves.filter(leave => leave.status === 'pending').length,
    fulfilled: leaves.filter(leave => leave.status === 'fulfilled').length,
    rejected: leaves.filter(leave => leave.status === 'rejected').length,
  };

  const indexOfLastLeave = currentPage * leavesPerPage;
  const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
  const currentLeaves = showAll ? filteredLeaves : filteredLeaves.slice(indexOfFirstLeave, indexOfLastLeave);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredLeaves.length / leavesPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printableTable').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // To reload the original content after printing
  };

  const toggleShowAll = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  const exportToExcel = () => {
    const formattedLeaves = filteredLeaves.map(leave => ({
      ...leave,
      start_date: formatDate(leave.start_date, false),
      end_date: formatDate(leave.end_date, false),
      created_at: formatDate(leave.created_at),
      updated_at: formatDate(leave.updated_at),
    }));

    const workSheet = XLSX.utils.json_to_sheet(formattedLeaves);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Leaves");
    XLSX.writeFile(workBook, "LeavesData.xlsx");
  };

  return (
    <div className='px-5 mt-3 fontstyle'>
      <div className='d-flex justify-content-center'>
        <span style={{ fontSize: '35px' }}>LEAVE RECORDS</span>
      </div>
      <div className='d-flex justify-content-first'>
        <button className="btn btn-back-color rounded-pill" style={{marginRight:'10px'}} onClick={handleBack}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>
        <button className="btn btn-back-color rounded-pill" style={{marginRight:'10px'}} onClick={handlePrint}>
          <i className="bi bi-printer"></i>
        </button>
        <button className="btn btn-back-color rounded-pill" style={{marginRight:'10px'}} onClick={exportToExcel}>
          <i className="bi bi-file-earmark-excel"></i>
        </button>

        <div className="input-group mt-3">
          <input
            type="text"
            placeholder="Search employee or leave number..."
            className="form-control form-control-lg rounded-pill"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Filter by month */}
        <select className="form-select rounded-pill ms-2 mt-3" value={selectedMonth} onChange={handleMonthChange}>
          <option value="all">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {/* Filter by year */}
        <select className="form-select rounded-pill ms-2 mt-3" value={selectedYear} onChange={handleYearChange}>
          <option value="all">All Years</option>
          {[...new Set(leaves.map(leave => new Date(leave.start_date).getFullYear()))].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="pagination mt-3 d-flex justify-content-end">
        <div className="mt-3 d-flex justify-content-end">
          <button
            className={`btn btn-color rounded-3 me-2 ms-2 ${filter === 'all' && 'active'}`}
            onClick={() => applyFilter('all')}
          >
            All <span className="badge rounded-circle half-outside" style={{backgroundColor:'#ff8800'}}>{totalLeaves.all}</span>
          </button>
          
          <button
            className={`btn btn-color rounded-3 me-2 ms-2 ${filter === 'pending' && 'active'}`}
            onClick={() => applyFilter('pending')}
          >
            Pending <span className="badge rounded-circle half-outside" style={{backgroundColor:'#ff8800'}}>{totalLeaves.pending}</span>
          </button>

          <button
            className={`btn btn-color rounded-3 me-2 ms-2 ${filter === 'fulfilled' && 'active'}`}
            onClick={() => applyFilter('fulfilled')}
          >
            Fulfilled <span className="badge rounded-circle half-outside" style={{backgroundColor:'#ff8800'}}>{totalLeaves.fulfilled}</span>
          </button>

          <button
            className={`btn btn-color rounded-3 ms-2 ${filter === 'rejected' && 'active'}`}
            onClick={() => applyFilter('rejected')}
          >
            Rejected <span className="badge rounded-circle half-outside" style={{backgroundColor:'#ff8800'}}>{totalLeaves.rejected}</span>
          </button>

          <button className="btn btn-color rounded-3 ms-3" style={{marginRight:'10px'}} onClick={toggleShowAll}>
          {showAll ? 'Show Paginated' : 'Show All'}
        </button>

          {!showAll && (
            <>
              <button
                onClick={prevPage}
                style={{marginLeft:'30px', fontSize:'16px'}}
                className="btn btn-color"
                disabled={currentPage === 1}
              >
                <i className="bi bi-caret-left-fill me-2" style={{fontSize:'20px'}}></i>
                Previous
              </button>

              <span className="btn btn-color" style={{ margin: '0 3px', fontSize:'18px' }}>
                Page {currentPage} of {Math.ceil(filteredLeaves.length / leavesPerPage)}
              </span>

              <button
                onClick={nextPage}
                className="btn btn-color"
                disabled={currentPage === Math.ceil(filteredLeaves.length / leavesPerPage)}
              >
                Next
                <i className="bi bi-caret-right-fill ms-2" style={{fontSize:'20px'}}></i>
              </button>
            </>
            
          )}
        </div>
      </div>

      {filteredLeaves.length === 0 ? (
        <div className="text-center mt-3" style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px', minHeight: 'calc(100vh - 500px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        No Result Found.
      </div>
      
      ) : (
        <div className='mt-3'>
          <div id="printableTable" className="table-container">
            <table className="table-container">
              <thead>
                <tr>
                  <th style={{ fontSize: '18px'}}>Leave Number</th>
                  <th style={{ fontSize: '18px'}}>Name</th>
                  <th style={{ fontSize: '18px'}}>Start Date</th>
                  <th style={{ fontSize: '18px'}}>End Date</th>
                  <th style={{ fontSize: '18px'}}>Status</th>
                  <th style={{ fontSize: '18px'}}>Reason</th>
                  <th style={{ fontSize: '18px'}}>Created At</th>
                  <th className="print-hide-actions" style={{ fontSize: '18px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? filteredLeaves : currentLeaves).map(leave => (
                  <tr key={leave.id}>
                    <td style={{ fontSize: '18px'}}>{leave.leave_no}</td>
                    <td style={{ fontSize: '18px'}}>{leave.name}</td>
                    <td style={{ fontSize: '18px'}}>{formatDate(leave.start_date, false)}</td>
                    <td style={{ fontSize: '18px'}}>{formatDate(leave.end_date, false)}</td>
                    <td style={{ fontSize: '18px'}}>
                      {leave.status === 'pending' && <span style={{fontStyle:'italic', fontWeight:'bold'}}><i className="bi bi-dash-circle text-warning me-1" style={{fontSize:'20px'}}></i>Pending</span>} 
                      {leave.status === 'fulfilled' && <span style={{fontStyle:'italic',  fontWeight:'bold'}}><i className="bi bi-check-circle text-success me-1" style={{fontSize:'25px'}}></i>Fulfilled</span>}
                      {leave.status === 'rejected' && <span style={{fontStyle:'italic',  fontWeight:'bold'}}><i className="bi bi-x-circle text-danger me-1" style={{fontSize:'25px'}}></i>Rejected</span>}
                    </td>
                    <td style={{ fontSize: '18px'}}>{leave.reason}</td>
                    <td style={{ fontSize: '18px'}}>{formatDate(leave.created_at)}</td>
                    <td className="print-hide-actions" style={{ fontSize: '18px'}}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {leave.status === 'pending' ? (
                          <>
                            <button
                              className="btn btn-success button-uniform-size me-1 mt-1"
                              onClick={() => handleStatusUpdate(leave.id, 'fulfilled')}
                            >
                              Fulfill
                            </button>
                            <button
                              className="btn btn-danger button-uniform-size me-1 mt-1"
                              onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-secondary button-uniform-size me-2 mt-1"
                              onClick={() => handleCancelLeave(leave.id)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-secondary button-uniform-size me-2 mt-1"
                              onClick={() => handleCancelLeave(leave.id)}
                            >
                              Cancel
                            </button>
                            <button
                              className="bi bi-trash btn btn-light btn-sm mb-2 button-uniform-size"
                              onClick={() => deleteLeave(leave.id, leave.status)}
                              title="Delete leave record"
                              style={{
                                marginTop: '8px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                              }}
                            ></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
  );
};

export default Leave;
