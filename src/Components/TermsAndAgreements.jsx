import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndAgreements = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [agreed, setAgreed] = useState(false); // State to track agreement

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
      navigate('/dashboard');
    }
  };

  return (
    <div className="terms-outer-container">
      <div className="terms-container">
        <h1 className="terms-title">Terms and Agreements</h1>

        <section className="terms-section">
          <h2 className="section-title">Introduction</h2>
          <p className="section-text">
            Welcome to the HRIS for R.C. Ramos Construction Corp. These terms and agreements outline the rules and regulations for the use of our website.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Access and Usage</h2>
          <p className="section-text">
            HR Admins have access to employee details including 201 files (resume, job offer, contract, valid ID, application form, and disciplinary form). They can create accounts for Admin, Payroll, and Recruitment, view statistics about employee counts, add departments, positions, and projects, and accept/reject attendance and leave requests.
          </p>
          <p className="section-text">
            Employees can view their details, their 201 files, attendance details, and leave requests.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Responsibilities</h2>
          <p className="section-text">
            Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Misuse of the system or unauthorized access is strictly prohibited.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Data Privacy</h2>
          <p className="section-text">
            By using this system, users consent to the collection and use of their personal information solely for the purposes related to their employment at R.C. Ramos Construction Corp. Personal information will not be shared with third parties without explicit consent, except as required by law.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Modifications</h2>
          <p className="section-text">
            R.C. Ramos Construction Corp reserves the right to modify these terms at any time. Users will be notified of any changes, and continued use of the system will constitute acceptance of the new terms.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-text">
            If you have any questions about these Terms and Agreements, please contact us at <a href="mailto:contact@rcramos.com">contact@rcramos.com</a>
          </p>
        </section>

        {/* Agreement Checkbox and Submit Button */}
        <div className="terms-agreement">
          <label >
            <input type="checkbox" onChange={(e) => setAgreed(e.target.checked)} />
            &nbsp; I agree to the terms and agreements &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <button
            style={hoveredButton === 'submit' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onClick={handleSubmit}
            onMouseEnter={() => setHoveredButton('submit')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={!agreed} // Disable button if not agreed
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsAndAgreements;
