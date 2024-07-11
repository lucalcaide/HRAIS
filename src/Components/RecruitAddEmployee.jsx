import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecruitAddEmployee = () => {
  const [employee, setEmployee] = useState({
    emp_no:"",
    fname: "",
    mname: "",
    lname: "",
    gender: "",
    birth_date: "",
    phone_number: "",
    perma_address: "",
    emergency_name:"",
    emergency_relationship:"",
    emergency_phone_number:"",
    date_hired: "",
    pay_frequency: "",
    rate_per_day: "",
    rate_per_hour: "",
    employee_status: "",
    department: "",
    project: "",
    position: "",
    email: "",
    password: "",
    salary: "",
    start_time: "",
    out_time: "",
    image: null,
    resume: null,
    job_offer: null,
    contract: null,
    valid_id: null,
    application_form: null,
    disciplinary_form: null,
  });

  const [department, setDepartment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/department")
      .then((result) => {
        if (result.data.Status) {
          setDepartment(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const [project, setProject] = useState([]);

  useEffect(() => {
    axios
      .get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/project")
      .then((result) => {
        if (result.data.Status) {
          setProject(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const [position, setPosition] = useState([]);

  useEffect(() => {
    axios
      .get("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/position")
      .then((result) => {
        if (result.data.Status) {
          setPosition(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("emp_no", employee.emp_no);
    formData.append("fname", employee.fname);
    formData.append("mname", employee.mname);
    formData.append("lname", employee.lname);
    formData.append("gender", employee.gender);
    formData.append("birth_date", employee.birth_date);
    formData.append("phone_number", employee.phone_number);
    formData.append("perma_address", employee.perma_address);
    formData.append("emergency_name", employee.emergency_name);
    formData.append("emergency_relationship", employee.emergency_relationship);
    formData.append("emergency_phone_number", employee.emergency_phone_number);
    formData.append("date_hired", employee.date_hired);
    formData.append("pay_frequency", employee.pay_frequency);
    formData.append("rate_per_day", employee.rate_per_day);
    formData.append("rate_per_hour", employee.rate_per_hour);
    formData.append("employee_status", employee.employee_status);
    formData.append("department", employee.department);
    formData.append("project", employee.project);
    formData.append("position", employee.position);
    formData.append("email", employee.email);
    formData.append("password", employee.password);
    formData.append("salary", employee.salary);
    formData.append("start_time",  employee.start_time);
    formData.append("out_time",  employee.out_time);

    if (employee.image) {
      formData.append("image", employee.image);
    }
    if (employee.resume) {
      formData.append("resume", employee.resume);
    }
    if (employee.job_offer) {
      formData.append("job_offer", employee.job_offer);
    }
    if (employee.contract) {
      formData.append("contract", employee.contract);
    }
    if (employee.valid_id) {
      formData.append("valid_id", employee.valid_id);
    }
    if (employee.application_form) {
      formData.append("application_form", employee.application_form);
    }
    if (employee.disciplinary_form) {
      formData.append("disciplinary_form", employee.disciplinary_form);
    }
  
    axios.post("https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/auth/add_employee", formData)
    .then((result) => {
      if (result.data.Status) {
        const { fname, mname, lname } = employee;
        toast.success(`Employee '${fname} ${mname ? mname + ' ' : ''}${lname}' added successfully!`);
        setTimeout(() => {
          navigate('/recruitmentdashboard/employee'); // Redirect to the dashboard after creation
        }, 2000); // Delay for 2 seconds
      } else {
        toast.error(result.data.Error);
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error('An error occurred while adding the employee.');
    });
};   

  const handleReset = () => {
    setEmployee({
      emp_no:"",
      fname: "",
      mname: "",
      lname: "",
      gender: "",
      birth_date: "",
      phone_number: "",
      perma_address: "",
      emergency_name:"",
      emergency_relationship:"",
      emergency_phone_number:"",
      date_hired: "",
      pay_frequency: "",
      rate_per_day: "",
      rate_per_hour: "",
      employee_status: "",
      department: "",
      project: "",
      position: "",
      email: "",
      password: "",
      salary: "",
      start_time: "",
      out_time: "",
      image: "",
      resume: "",
      job_offer:"",
      contract:"",
      valid_id:"",
      application_form:"",
      disciplinary_form:"",
    });
  };

  const handleBack = () => {
    navigate("/recruitmentdashboard/employee");
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
              ADD EMPLOYEE
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
                value={employee.birth_date}
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
                Password:
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                value={employee.password}
                onChange={(e) =>
                  setEmployee({ ...employee, password: e.target.value })
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
                value={employee.date_hired}
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

          <div className="col-12">
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
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Image:
              </span>
              <input
                type="file"
                id="image"
                name="image"
                className="form-control"
                onChange={(e) =>
                  setEmployee({ ...employee, image: e.target.files[0] })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <span className="mb-1" style={{ fontSize: '25px', fontFamily: 'Montserrat', fontWeight: 'bold', color: '#0b283b' }}>
            201 FILES
          </span>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Resume:
              </span>
              <input
                type="file"
                id="resume"
                name="resume"
                className="form-control"
                onChange={(e) =>
                  setEmployee({ ...employee, resume: e.target.files[0] })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Job Offer:
              </span>
              <input
                type="file"
                id="job_offer"
                name="job_offer"
                className="form-control"
                onChange={(e) =>
                  setEmployee({ ...employee, job_offer: e.target.files[0] })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Contract:
              </span>
              <input
                type="file"
                id="contract"
                name="contract"
                className="form-control"
                onChange={(e) =>
                  setEmployee({ ...employee, contract: e.target.files[0] })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Valid ID:
              </span>
              <input
                type="file"
                id="valid_id"
                name="valid_id"
                className="form-control"
                onChange={(e) =>
                  setEmployee({ ...employee, valid_id: e.target.files[0] })
                }
                style={inputFieldStyle}
                required
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text" style={inputLabelStyle}>
                Application Form:
              </span>
              <input
                type="file"
                id="application_form"
                name="application_form"
                className="form-control"
                onChange={(e) =>
                  setEmployee({ ...employee, application_form: e.target.files[0] })
                }
                style={inputFieldStyle}
                required
              />
             
            </div>
          </div>

          <div className="col-12 mb-5">
  <div className="input-group">
    <span className="input-group-text" style={inputLabelStyle}>
      Disciplinary Form:
    </span>
    <input
      type="file"
      id="disciplinary_form"
      name="disciplinary_form"
      className="form-control"
      onChange={(e) =>
        setEmployee({ ...employee, disciplinary_form: e.target.files[0] })
      }
      style={inputFieldStyle}
      required
    />
  </div>
</div>


          <div className="col-12">
            <button type="submit" className="btn w-100 rounded-5 btn-dark" style={buttonStyle}>
              Add Employee
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
  );
};

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

export default RecruitAddEmployee
