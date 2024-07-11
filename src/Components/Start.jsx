import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {

  return (
    <div className='login-page'>
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='p-2 rounded w-40 '>
          
        <div className="text-center">
            <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/Images/r.c. logo nobg.png" alt="Company Logo" style={{ width: '100px', marginRight: '10px' }} />

        <h1 className="display-4" style={{ fontSize: '26px', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
        R.C. RAMOS CONSTRUCTION CORPORATION
        </h1>

  </div>
        <hr className="my-3" />
  <p className="lead" style={{ fontSize: '24px', fontFamily: 'Montserrat', fontStyle:'italic' }}>Login as...</p>

    <div className='d-flex justify-content-center align-items-center' style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
  <Link to="/adminlogin" className='btn btn-color rounded-3' style={{ width: '250px', height:'150px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow:'0 10px 10px rgba(0, 0, 0, 0.2)'
   }}>
    <i className="bi bi-person-circle me-1"></i> 
    <span className="btn-text" style={{ fontFamily: 'Montserrat', padding: '10px' }}>Administrator</span>
  </Link>

  <Link to="/employeelogin" className='btn btn-color rounded-3' style={{ width: '250px', height:'150px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow:'0 10px 10px rgba(0, 0, 0, 0.2)'
   }}>
    <i className="bi bi-people-fill me-1"></i> 
    <span className="btn-text" style={{ fontFamily: 'Montserrat', padding: '10px' }}>Employee</span>
  </Link>
  </div>

  <div className='d-flex justify-content-center align-items-center' style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
  <Link to="/recruitmentlogin" className='btn btn-color rounded-3' style={{ width: '250px', height:'150px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow:'0 10px 10px rgba(0, 0, 0, 0.2)'
   }}>
    <i className="bi bi-person-vcard-fill me-1"></i> 
    <span className="btn-text" style={{ fontFamily: 'Montserrat', padding: '10px' }}>Recruitment</span>
  </Link>

  <Link to="/payrolllogin" className='btn btn-color rounded-3' style={{ width: '250px', height:'150px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
  boxShadow:'0 10px 10px rgba(0, 0, 0, 0.2)' }}>
    <i className="bi bi-cash-coin me-1"></i> 
    <span className="btn-text" style={{ fontFamily: 'Montserrat', padding: '10px' }}>Payroll</span>
  </Link>
  </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Start
