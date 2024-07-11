import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap-icons/font/bootstrap-icons.css"; 

const EmployeeTermsAndAgreements = () => {
    const [employee, setEmployee] = useState({});
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const { id } = useParams();
    const navigate = useNavigate();
    const [hoveredButton, setHoveredButton] = useState(null);
    const [agreed, setAgreed] = useState(false); // State to track agreement

    useEffect(() => {
        axios.get(`https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/home/${id}`)
          .then(result => {
            setEmployee(result.data[0]);
          })
          .catch(err => console.log(err));
    
        // Update date and time every second
        const intervalId = setInterval(() => {
          setCurrentDateTime(new Date());
        }, 1000);
    
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      }, [id]);
  
    const buttonWidth = '125px'; // Adjust button width as needed
  
    const buttonStyle = {
      backgroundColor: '#0b283b',
      color: 'white',
      padding: '10px',
      border: '3px solid transparent',
      borderRadius: '8px',
      boxShadow: '10px 20px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fontSize: '18px', // Adjust font size as needed
      cursor: 'pointer',
      margin: '5px 0',
      width: buttonWidth,
      textAlign: 'center',
      transition: 'all 0.3s ease-in-out',
      opacity: agreed ? 1 : 0.5, // Change opacity based on agreement state
    };
  
    const buttonHoverStyle = {
      backgroundColor: 'rgb(75, 66, 66)',
      border: '2px solid rgb(75, 66, 66)',
      color: 'wheat',
    };
  
    const handleSubmit = () => {
      if (agreed) {
        navigate('/employee_home/:id');
      }
    };

    const handleDateChange = () => {
    setCurrentPage(1);
  };

  const handleLogout = () => {
    axios.get('https://mysql-deploy-heroku-a202c0289f39.herokuapp.com/employee/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/employeelogin');
        }
      }).catch(err => console.log(err));
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const getLinkStyle = (path) => {
    return location.pathname === path
      ? {
          color: 'white',
          fontWeight: 'bold',
          borderBottom: '3px solid #ff8800',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }
      : {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        };
  };
    
  return (
    <div>
        <div className="terms-outer-container">
      <div className="terms-container">
        <h1 className="terms-title">Employee Terms and Agreements</h1>

        <section className="terms-section">
          <h2 className="section-title">Introduction</h2>
          <p className="section-text">
            Welcome to the HRIS for R.C. Ramos Construction Corp. These terms and agreements outline the rules and regulations for the use of our website by employees.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Access and Usage</h2>
          <p className="section-text">
            As an employee, you have access to view your personal details, 201 files (resume, job offer, contract, valid ID, application form, and disciplinary form), attendance details, and leave requests. Unauthorized access or misuse of this system is strictly prohibited.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Responsibilities</h2>
          <p className="section-text">
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Ensure your information is accurate and up-to-date.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Data Privacy</h2>
          <p className="section-text">
            By using this system, you consent to the collection and use of your personal information solely for purposes related to your employment at R.C. Ramos Construction Corp. Your personal information will not be shared with third parties without your explicit consent, except as required by law.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Modifications</h2>
          <p className="section-text">
            R.C. Ramos Construction Corp reserves the right to modify these terms at any time. You will be notified of any changes, and continued use of the system will constitute acceptance of the new terms.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-text">
            If you have any questions about these Employee Terms and Agreements, please contact us at <a href="mailto:contact@rcramos.com">contact@rcramos.com</a>
          </p>
        </section>

        {/* Agreement Checkbox and Submit Button */}
        <div className="terms-agreement">
          <label>
            <input type="checkbox" onChange={(e) => setAgreed(e.target.checked)} />
            &nbsp; I agree to the terms and agreements
          </label>
          <button
            style={hoveredButton === 'submit' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onClick={handleSubmit}
            onMouseEnter={() => setHoveredButton('submit')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>


    </div>
    
  )
}

export default EmployeeTermsAndAgreements
