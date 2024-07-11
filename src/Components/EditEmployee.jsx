import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    emp_no: "",
    fname: "",
    mname: "",
    lname: "",
    gender: "",
    birth_date: "",
    phone_number: "",
    perma_address: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_phone_number: "",
    date_hired: "",
    pay_frequency: "",
    rate_per_day: "",
    rate_per_hour: "",
    employee_status: "",
    department: "",
    project: "",
    position: "",
    email: "",
    start_time: "",
    out_time: "",
    salary: "",
  });

  const navigate = useNavigate();
  const [department, setDepartment] = useState([]);
  const [project, setProject] = useState([]);
  const [position, setPosition] = useState([]);

  useEffect(() => {
    axios.get('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/department')
      .then(result => {
        if (result.data.Status) {
          setDepartment(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

    axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/employee/${id}`)
      .then(result => {
        setEmployee({
          ...employee,
          emp_no: result.data.Result[0].emp_no,
          fname: result.data.Result[0].fname,
          mname: result.data.Result[0].mname,
          lname: result.data.Result[0].lname,
          gender: result.data.Result[0].gender,
          birth_date: formatDate(result.data.Result[0].birth_date),
          phone_number: result.data.Result[0].phone_number,
          perma_address: result.data.Result[0].perma_address,
          date_hired: formatDate(result.data.Result[0].date_hired),
          emergency_name: result.data.Result[0].emergency_name,
          emergency_relationship: result.data.Result[0].emergency_relationship,
          emergency_phone_number: result.data.Result[0].emergency_phone_number,
          pay_frequency: result.data.Result[0].pay_frequency,
          rate_per_day: result.data.Result[0].rate_per_day,
          rate_per_hour: result.data.Result[0].rate_per_hour,
          employee_status: result.data.Result[0].employee_status,
          department: result.data.Result[0].department,
          project: result.data.Result[0].project,
          position: result.data.Result[0].position,
          email: result.data.Result[0].email,
          start_time: result.data.Result[0].start_time,
          out_time: result.data.Result[0].out_time,
          salary: result.data.Result[0].salary,
        });
      }).catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    axios.get('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/project')
      .then(result => {
        if (result.data.Status) {
          setProject(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/position')
      .then(result => {
        if (result.data.Status) {
          setPosition(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/edit_employee/${id}`, employee)
      .then(result => {
        if (result.data.Status) {
          toast.success(`Employee '${employee.fname} ${employee.mname ? employee.mname + ' ' : ''}${employee.lname}' edited successfully!`);
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleReset = () => {
    setEmployee({
      emp_no: "",
      fname: "",
      mname: "",
      lname: "",
      gender: "",
      birth_date: "",
      phone_number: "",
      perma_address: "",
      emergency_name: "",
      emergency_relationship: "",
      emergency_phone_number: "",
      date_hired: "",
      pay_frequency: "",
      rate_per_day: "",
      rate_per_hour: "",
      employee_status: "",
      department: "",
      project: "",
      position: "",
      email: "",
      start_time: "",
      out_time: "",
      salary: "",
    });
    toast.info('Form reset successfully!');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button className="btn btn-back-color rounded-pill ms-5 mt-5" style={{ marginRight: '100px' }} onClick={handleBack}>
        <i className="bi bi-arrow-left-circle"></i>
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="p-5 row g-3 mt-1 scrollable-table-form"
          style={{ border: '5px solid #0b283b', borderRadius: '10px', backgroundColor: '#8b9191', width: '80%' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '35px', fontFamily: 'Montserrat', fontWeight: 'bold', color: '#0b283b' }}>
              EDIT EMPLOYEE
            </span>
          </div>

          <span className="mb-1" style={{ fontSize: '25px', fontFamily: 'Montserrat', fontWeight: 'bold', color: '#0b283b' }}>
            PERSONAL DETAILS
          </span>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Employee Number:
              </span>
              <input
                type="text"
                className="form-control"
                value={employee.emp_no}
                id="emp_no"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, emp_no: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                First Name:
              </span>
              <input
                type="text"
                className="form-control"
                value={employee.fname}
                id="fname"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, fname: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Middle Name:
              </span>
              <input
                type="text"
                className="form-control"
                value={employee.mname}
                id="mname"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, mname: e.target.value })
                }
                style={inputFieldStyle}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Last Name:
              </span>
              <input
                type="text"
                className="form-control"
                value={employee.lname}
                id="lname"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, lname: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Gender:
              </span>
              <select
                id="gender"
                className="form-select"
                value={employee.gender}
                onChange={(e) =>
                  setEmployee({ ...employee, gender: e.target.value })
                }
                style={inputFieldStyle}
                required
              >
                <option value="">Choose...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Birthdate:
              </span>
              <input
                type="date"
                className="form-control"
                value={employee.birth_date.substring(0, 10)}
                id="Birthdate"
                onChange={(e) =>
                  setEmployee({ ...employee, birth_date: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Phone Number:
              </span>
              <input
                type="number"
                className="form-control"
                value={employee.phone_number}
                id="PhoneNumber"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, phone_number: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Permanent Address:
              </span>
              <input
                type="text"
                className="form-control"
                id="perma_address"
                value={employee.perma_address}
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, perma_address: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <span className="mb-1" style={{ fontSize: '25px', fontFamily: 'Montserrat', fontWeight: 'bold', color: '#0b283b' }}>
            EMERGENCY CONTACT PERSON
          </span>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Full Name:
              </span>
              <input
                type="text"
                className="form-control"
                value={employee.emergency_name}
                id="emergency_name"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, emergency_name: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Relationship:
              </span>
              <input
                type="text"
                className="form-control"
                value={employee.emergency_relationship}
                id="emergency_relationship"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, emergency_relationship: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Contact Number:
              </span>
              <input
                type="text"
                className="form-control"
                value={employee.emergency_phone_number}
                id="emergency_phone_number"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, emergency_phone_number: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <span className="mb-1" style={{ fontSize: '25px', fontFamily: 'Montserrat', fontWeight: 'bold', color: '#0b283b' }}>
            EMPLOYMENT DETAILS
          </span>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Date Hired:
              </span>
              <input
                type="date"
                className="form-control"
                id="date_hired"
                value={employee.date_hired.substring(0, 10)}
                onChange={(e) =>
                  setEmployee({ ...employee, date_hired: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Paid Every:
              </span>
              <select
                id="pay_frequency"
                className="form-select"
                value={employee.pay_frequency}
                onChange={(e) =>
                  setEmployee({ ...employee, pay_frequency: e.target.value })
                }
                style={inputFieldStyle}
                required
              >
                <option value="">Choose...</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Daily Rate:
              </span>
              <input
                type="int"
                className="form-control"
                id="rate_per_day"
                value={employee.rate_per_day}
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, rate_per_day: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Hourly Rate:
              </span>
              <input
                type="int"
                className="form-control"
                id="rate_per_hour"
                value={employee.rate_per_hour}
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, rate_per_hour: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Employee Status:
              </span>
              <select
                id="employee_status"
                className="form-select"
                value={employee.employee_status}
                onChange={(e) =>
                  setEmployee({ ...employee, employee_status: e.target.value })
                }
                style={inputFieldStyle}
                required
              >
                <option value="">Choose...</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Department:
              </span>
              <select
                name="department"
                id="department"
                value={employee.department}
                className="form-select"
                onChange={(e) =>
                  setEmployee({ ...employee, department: e.target.value })
                }
                style={inputFieldStyle}
                required
              >
                <option value="">Choose...</option>
                {department.map((department) => {
                  return (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Project/Unit:
              </span>
              <select
                name="project"
                id="project"
                value={employee.project}
                className="form-select"
                onChange={(e) =>
                  setEmployee({ ...employee, project: e.target.value })
                }
                style={inputFieldStyle}
                required
              >
                <option value="">Choose...</option>
                {project.map((project) => {
                  return (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Position:
              </span>
              <select
                name="position"
                id="position"
                value={employee.position}
                className="form-select"
                onChange={(e) =>
                  setEmployee({ ...employee, position: e.target.value })
                }
                style={inputFieldStyle}
                required
              >
                <option value="">Choose...</option>
                {position.map((position) => {
                  return (
                    <option key={position.id} value={position.name}>
                      {position.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Email:
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                value={employee.email}
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, email: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Salary:
              </span>
              <input
                type="int"
                className="form-control"
                id="salary"
                value={employee.salary}
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, salary: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Start Time:
              </span>
              <input
                type="time"
                className="form-control"
                id="start_time"
                value={employee.start_time}
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, start_time: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12 mb-5">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Out Time:
              </span>
              <input
                type="time"
                className="form-control"
                id="out_time"
                value={employee.out_time}
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, out_time: e.target.value })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn w-100 rounded-5 btn-dark" style={buttonStyle}>
              Edit Employee
            </button>
          </div>

          <div className="col-12">
            <button type="reset" className="btn w-100 rounded-5 btn-outline-light" style={buttonStyle}>
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
    </div>
  )
}

const inputLabelStyle = {
  fontSize: '20px',
  fontFamily: 'Montserrat',
  backgroundColor: '#0b283b',
  color: '#fff',
  border: 'none',
  borderTopLeftRadius: '5px',
  borderBottomLeftRadius: '5px',
};

const inputFieldStyle = {
  fontSize: '20px',
  fontFamily: 'Montserrat',
  borderTopRightRadius: '5px',
  borderBottomRightRadius: '5px',
  border: 'none',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  fontSize: '20px',
  fontFamily: 'Montserrat',
};

export default EditEmployee;
