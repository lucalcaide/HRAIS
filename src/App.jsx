import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom"
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import CreateAdmin from './Components/CreateAdmin'
import CreateRecruitment from './Components/CreateRecruitment'
import CreatePayroll from './Components/CreatePayroll'
import Employee from './Components/Employee'
import Department from './Components/Department'
import Project from './Components/Project'
import Position from './Components/Position'
import Attendance from './Components/Attendance'
import AddAttendance from './Components/AddAttendance'
import ViewAttendance from './Components/ViewAttendance'
import AttendanceFullDetails from './Components/AttendanceFullDetails'
import Leave from './Components/Leave'
import TermsAndAgreements from './Components/TermsAndAgreements'
import AboutUs from './Components/AboutUs'
import Files from './Components/Files'
import FilesResume from './Components/FilesResume'
import FilesJobOffer from './Components/FilesJobOffer'
import FilesContract from './Components/FilesContract'
import FilesValidId from './Components/FilesValidId'
import FilesApplicationForm from './Components/FilesApplicationForm'
import FilesDisciplinaryForm from './Components/FilesDisciplinaryForm'
import EditResume from './Components/EditResume'
import EditJobOffer from './Components/EditJobOffer'
import EditContract from './Components/EditContract'
import EditValidId from './Components/EditValidId'
import EditApplicationForm from './Components/EditApplicationForm'
import EditDisciplinaryForm from './Components/EditDisciplinaryForm'
import AddDept from './Components/AddDept'
import AddPosition from './Components/AddPosition'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import ViewEmployee from './Components/ViewEmployee'
import AddProject from './Components/AddProject'

import Start from './Components/Start'

import EmployeeLogin from './Components/EmployeeLogin'

import RecruitmentLogin from './Components/RecruitmentLogin'
import RecruitmentDashboard from './Components/RecruitmentDashboard'
import RecruitmentHome from './Components/RecruitmentHome'
import RecruitEmployee from './Components/RecruitEmployee'
import RecruitAddEmployee from './Components/RecruitAddEmployee'
import RecruitEditEmployee from './Components/RecruitEditEmployee'
import PayrollLogin from './Components/PayrollLogin'
import EmployeeProfile from './Components/EmployeeProfile'
import EmployeeHome from './Components/EmployeeHome'
import EmployeeFiles from './Components/EmployeeFiles'
import EmpChangePass from './Components/EmpChangePass'
import EmployeeLeave from './Components/EmployeeLeave'
import EmployeeLeaveRequest from './Components/EmployeeLeaveRequest'
import EmployeeAttendance from './Components/EmployeeAttendance'
import EmployeeAttendanceFullDetails from './Components/EmployeeAttendanceFullDetails'
import EmployeeTermsAndAgreements from './Components/EmployeeTermsAndAgreements'
import CreateNewPass from './Components/CreateNewPass'
import RecruitViewEmployee from './Components/RecruitViewEmployee'
import RecruitFiles from './Components/RecruitFiles'
import RecruitFilesResume from './Components/RecruitFilesResume'
import RecruitFilesJobOffer from './Components/RecruitFilesJobOffer'
import RecruitFilesContracts from './Components/RecruitFilesContracts'
import RecruitFilesValidId from './Components/RecruitFilesValidId'
import RecruitFilesApplicationForm from './Components/RecruitFilesApplicationForm'
import RecruitFilesDisciplinaryForm from './Components/RecruitFilesDisciplinaryForm'
import RecruitTermsAndAgreements from './Components/RecruitTermsAndAgreements'
import RecruitAboutUs from './Components/RecruitAboutUs'
import PayrollDashboard from './Components/PayrollDashboard'
import PayrollHome from './Components/PayrollHome'
import PayrollLeave from './Components/PayrollLeave'
import PayrollAttendance from './Components/PayrollAttendance'
import PayrollAddAttendance from './Components/PayrollAddAttendance'
import PayrollViewAttendance from './Components/PayrollViewAttendance'
import PayrollAttendanceFullDetails from './Components/PayrollAttendanceFullDetails'
import PayrollTermsAndAgreements from './Components/PayrollTermsAndAgreements'
import PayrollAboutUs from './Components/PayrollAboutUs'


function App() {


  return (

    <BrowserRouter>

    <Routes>
      <Route path="/" element={<Start />}></Route>
      <Route path="/adminlogin" element={<Login />}></Route>
      <Route path="/employeelogin" element={<EmployeeLogin />}></Route>
      <Route path="/recruitmentlogin" element={<RecruitmentLogin />}></Route>
      <Route path="/payrolllogin" element={<PayrollLogin />}></Route>

      <Route path="/employee_home/:id" element={<EmployeeHome />}> </Route>

      <Route path="/employee_profile/:id" element={<EmployeeProfile />}> </Route>
      <Route path="/employee_change_password/:id" element={<EmpChangePass />}> </Route> 
      <Route path="/employee_files/:id" element={<EmployeeFiles />}> </Route>
      <Route path='/employee_attendance/:id' element={<EmployeeAttendance />}></Route>
      <Route path='/employee_attendance/view_full_attendance_details/:id' element={<EmployeeAttendanceFullDetails />}></Route>
      <Route path="/employee_terms_and_agreements/:id" element={<EmployeeTermsAndAgreements />}> </Route>
      <Route path="/employee_leave/:id" element={<EmployeeLeave />}> </Route>
      <Route path="/employee_leave_list/:id" element={<EmployeeLeaveRequest />}> </Route>
      <Route path='/update_employee_password/:id' element={<CreateNewPass />}></Route>
      

      <Route path="/dashboard" element={<Dashboard />}>
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/createadmin' element={<CreateAdmin />}></Route>
        <Route path='/dashboard/createrecruitment' element={<CreateRecruitment />}></Route>
        <Route path='/dashboard/createpayroll' element={<CreatePayroll />}></Route>
        <Route path='/dashboard/employee' element={<Employee />}></Route>
        <Route path='/dashboard/employee/update_employee_password/:id' element={<CreateNewPass />}></Route>
        <Route path='/dashboard/department' element={<Department />}></Route>
        <Route path='/dashboard/project' element={<Project />}></Route>
        <Route path='/dashboard/position' element={<Position />}></Route>
        <Route path='/dashboard/attendance' element={<Attendance />}></Route>
        <Route path='/dashboard/attendance/add_attendance/:id' element={<AddAttendance />}></Route>
        <Route path='/dashboard/attendance/view_all_attendance/:id' element={<ViewAttendance />}></Route>
        <Route path='/dashboard/attendance/view_full_attendance_details/:id' element={<AttendanceFullDetails />}></Route>
        <Route path='/dashboard/leave' element={<Leave />}></Route>
        <Route path='/dashboard/terms_and_agreements' element={<TermsAndAgreements />}></Route>
        <Route path='/dashboard/about_us' element={<AboutUs />}></Route>
        <Route path='/dashboard/201files' element={<Files />}></Route>
        <Route path='/dashboard/201files/resume' element={<FilesResume />}></Route>
        <Route path='/dashboard/201files/edit_resume/:id' element={<EditResume />}></Route>
        <Route path='/dashboard/201files/job_offer' element={<FilesJobOffer />}></Route>
        <Route path='/dashboard/201files/edit_job_offer/:id' element={<EditJobOffer />}></Route>
        <Route path='/dashboard/201files/contract' element={<FilesContract />}></Route>
        <Route path='/dashboard/201files/edit_contract/:id' element={<EditContract />}></Route>
        <Route path='/dashboard/201files/valid_id' element={<FilesValidId />}></Route>
        <Route path='/dashboard/201files/edit_valid_id/:id' element={<EditValidId />}></Route>
        <Route path='/dashboard/201files/application_form' element={<FilesApplicationForm />}></Route>
        <Route path='/dashboard/201files/edit_application_form/:id' element={<EditApplicationForm />}></Route>
        <Route path='/dashboard/201files/disciplinary_form' element={<FilesDisciplinaryForm />}></Route>
        <Route path='/dashboard/201files/edit_disciplinary_form/:id' element={<EditDisciplinaryForm />}></Route>
        <Route path='/dashboard/add_dept' element={<AddDept />}></Route>
        <Route path='/dashboard/add_project' element={<AddProject />}></Route>
        <Route path='/dashboard/add_position' element={<AddPosition />}></Route>
        <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route>
        <Route path='/dashboard/view_employee/:id' element={<ViewEmployee />}></Route>
        
      </Route>

      <Route path="/recruitmentdashboard" element={<RecruitmentDashboard />}>
      <Route path='' element={<RecruitmentHome />}></Route>
      <Route path='/recruitmentdashboard/employee' element={<RecruitEmployee />}></Route>
      <Route path='/recruitmentdashboard/add_employee' element={<RecruitAddEmployee />}></Route>
      <Route path='/recruitmentdashboard/edit_employee/:id' element={<RecruitEditEmployee />}></Route>
      <Route path='/recruitmentdashboard/view_employee/:id' element={<RecruitViewEmployee />}></Route>
      <Route path='/recruitmentdashboard/201files' element={<RecruitFiles />}></Route>
      <Route path='/recruitmentdashboard/201files/resume' element={<RecruitFilesResume />}></Route>
      <Route path='/recruitmentdashboard/201files/job_offer' element={<RecruitFilesJobOffer />}></Route>
      <Route path='/recruitmentdashboard/201files/contract' element={<RecruitFilesContracts />}></Route>
      <Route path='/recruitmentdashboard/201files/valid_id' element={<RecruitFilesValidId />}></Route>
      <Route path='/recruitmentdashboard/201files/application_form' element={<RecruitFilesApplicationForm />}></Route>
      <Route path='/recruitmentdashboard/201files/disciplinary_form' element={<RecruitFilesDisciplinaryForm />}></Route>
      <Route path='/recruitmentdashboard/terms_and_agreements' element={<RecruitTermsAndAgreements />}></Route>
      <Route path='/recruitmentdashboard/about_us' element={<RecruitAboutUs />}></Route>
      </Route>

      <Route path="/payrolldashboard" element={<PayrollDashboard />}>
      <Route path='' element={<PayrollHome />}></Route>
      <Route path='/payrolldashboard/leave' element={<PayrollLeave />}></Route>
      <Route path='/payrolldashboard/attendance' element={<PayrollAttendance />}></Route>
      <Route path='/payrolldashboard/attendance/add_attendance/:id' element={<PayrollAddAttendance />}></Route>
      <Route path='/payrolldashboard/attendance/view_all_attendance/:id' element={<PayrollViewAttendance />}></Route>
      <Route path='/payrolldashboard/attendance/view_full_attendance_details/:id' element={<PayrollAttendanceFullDetails />}></Route>
      <Route path='/payrolldashboard/terms_and_agreements' element={<PayrollTermsAndAgreements />}></Route>
      <Route path='/payrolldashboard/about_us' element={<PayrollAboutUs />}></Route>
      </Route>

    </Routes>
    </BrowserRouter>
    
  )
}

export default App