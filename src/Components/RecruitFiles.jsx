import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecruitFiles = () => {
    const navigate = useNavigate();
    const [hoveredButton, setHoveredButton] = useState(null);
  
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '90vh',
      boxSizing: 'border-box',
      gap: '10px',
    };
  
    const buttonWidth = '1000px'; // Set the width of the buttons and the text container
  
    const buttonStyle = {
      backgroundColor: '#0b283b',
      color: 'white',
      padding: '15px 20px',
      border: '3px solid transparent',
      borderRadius: '8px',
      boxShadow: '10px 20px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fontSize: '30px',
      cursor: 'pointer',
      margin: '10px 0',
      width: buttonWidth,
      textAlign: 'center',
      transition: 'all 0.3s ease-in-out',
    };
  
    const buttonHoverStyle = {
      backgroundColor: 'rgb(75, 66, 66)',
      border: '2px solid rgb(75, 66, 66)',
      color: 'wheat',
    };
  
    return (
      <div style={containerStyle}>
        <div
          className="col-md-5"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '10px',
            boxShadow: '20 20px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: buttonWidth, // Fixed width for the background
            margin: '0 auto', // Center the element horizontally
          }}
        >
          <span
            style={{
              fontFamily: 'Montserrat',
              fontWeight: 'bold',
              fontSize: '30px',
              color: 'white',
            }}
          >
            201 FILES
          </span>
        </div>
        {['resume', 'job_offer', 'contract', 'valid_id', 'application_form', 'disciplinary_form'].map((file, index) => (
          <button
            key={file}
            type="button"
            style={hoveredButton === index ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onClick={() => navigate(`/recruitmentdashboard/201files/${file}`)}
            onMouseEnter={() => setHoveredButton(index)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {file.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>
    );
  };
  

export default RecruitFiles
