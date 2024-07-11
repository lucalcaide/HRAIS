import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDept = () => {
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/add_dept', { department })
      .then(result => {
        if (result.data.Status) {
          toast.success(`Department '${department}' added successfully!`);
          setDepartment(''); // Clear the department state after successful submission
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleReset = () => {
    setDepartment(''); // Reset the department state
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>

      <form
        onSubmit={handleSubmit}
        onReset={handleReset} // Attach the handleReset function to the form's onReset event
        className="p-3 row g-3 w-50 mt-1 scrollable-table-form"
        style={{ border: '5px solid #0b283b', borderRadius: '10px', backgroundColor: '#8b9191' }}
      >

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '35px', fontFamily: 'Montserrat', fontWeight: 'bold', color: '#0b283b' }}>
            ADD DEPARTMENT
          </span>
        </div>

        <div className="col-12 mb-3">
          <div className="input-group">
            <span className="input-group-text me-1" style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>
              Department :
            </span>

            <input
              type="text"
              className="form-control"
              id="department"
              autoComplete="off"
              value={department} // Bind the input value to the department state
              onChange={(e) => setDepartment(e.target.value)}
              style={{ fontSize: '20px', fontFamily: 'Montserrat' }}
              required
            />
          </div>
        </div>

        <div className="col-12 text-center mt-5">
          <button type="submit" className="btn w-50 rounded-5 btn-dark " style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>
            Add Department
          </button>
        </div>

        <div className="col-12 text-center">
          <button type="reset" className="btn w-50 rounded-5 btn-outline-light" style={{ fontSize: '20px', fontFamily: 'Montserrat' }}>
            Reset
          </button>
        </div>

      </form>
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

export default AddDept;
