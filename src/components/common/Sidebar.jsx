import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { connect } from "react-redux";

const Sidebar = ({ isAuthenticated, user }) => {
  return (
    <>
    {isAuthenticated ? (
      <div className="side_bar">
        <ul>
          {(user?.is_patient === true) && (
            <>
            <li>
              <Link to={'/patient-dashboard'}>Dashboard</Link>
            </li>
            <li>
              <Link to={'/book-appointment'}>Book an Appointment</Link>
            </li>
            <li>
              <Link to={'/outdated-appointments'}>Outdated Appointments</Link>
            </li>
            <li>
              <Link to={'/profile'}>Profile</Link>
            </li>
            </>
          )}
          {((user?.is_staff === true) && (user?.is_superuser === false)) && (
            <>
            <li>
              <Link to={'/doctor-dashboard'}>Dashboard</Link>
            </li>
            <li>
              <Link to={'/store-diagnosis'}>Add Diagnosis</Link>
            </li>
            <li>
              <Link to={'/profile'}>Profile</Link>
            </li>
            </>
          )}
          {((user?.is_staff === true) && (user?.is_superuser === true)) && (
            <>
            <li>
              <Link to={'/admin-dashboard'}>Dashboard</Link>
            </li>
            <li>
              <Link to={'/add-doctor'}>Add Doctor</Link>
            </li>
            <li>
              <Link to={'/profile'}>Profile</Link>
            </li>
            </>
          )}
        </ul>
      </div>
    ) : (
      <div style={{display: 'none'}}>Your are not authenticated!</div>
    )}
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Sidebar);