import React from 'react'
import { connect } from "react-redux";

const Profile = ({ isAuthenticated, user }) => {
  return (
    <div className='main_content' style={{width: '76%'}}>
      {(isAuthenticated && (user?.is_patient === true) && (user?.is_verified === false)) && (
        <div className="alert alert-danger" role="alert">
          Please verify your email address because it is not verified. 
        </div>
      )}
      {isAuthenticated && (<>
      <h2 style={{marginLeft: '4vw'}}>Your Profile</h2>
      <table className='profile_section'>
        <tbody>
          <tr>
            <td className='title'>ID:</td>
            <td>{user?.identifying_number}</td>
          </tr>
          <tr>
            <td className='title'>First name:</td>
            <td>{user?.first_name}</td>
          </tr>
          <tr>
            <td className='title'>Last name:</td>
            <td>{user?.last_name}</td>
          </tr>
          <tr>
            <td className='title'>Email address:</td>
            <td>{user?.email}</td>
          </tr>
          <tr>
            <td className='title'>Date of birth:</td>
            <td>{user?.birth_date}</td>
          </tr>
          <tr>
            <td className='title'>Gender:</td>
            <td>{user?.gender}</td>
          </tr>
        </tbody>
      </table>
      </>)}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Profile);