import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";
import { API_URL } from "../constants";
import { Segment, Dimmer, Loader } from "semantic-ui-react";

const PatientDetail = ({ isAuthenticated, user }) => {
  const [patient, setPatient] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if(isAuthenticated && (user?.is_staff === true)) {
      setLoading(true);

      axios({
        url: `${API_URL}/api/patient-detail/`,
        method: "POST",
        data: {
          identifying_number: id,
        },
      })
        .then((res) => {
          setPatient(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Server Not Responding!");
          setLoading(false);
        });
    }
  }, [id, isAuthenticated, user]);

  return (
    <div className='main_content' style={{width: '76%'}}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading ? (
          <Segment
            style={{
              margin: "6rem 0 2rem 0",
              boxShadow: "none",
              border: 0,
            }}
          >
            <Dimmer active inverted>
              <Loader size="large"></Loader>
            </Dimmer>
          </Segment>
      ) : (
        <>
        <h2 style={{marginLeft: '4vw'}}>Patient Information</h2>
        <table className='profile_section'>
          <tbody>
            <tr>
              <td className='title'>ID:</td>
              <td>{patient?.identifying_number}</td>
            </tr>
            <tr>
              <td className='title'>First name:</td>
              <td>{patient?.first_name}</td>
            </tr>
            <tr>
              <td className='title'>Last name:</td>
              <td>{patient?.last_name}</td>
            </tr>
            <tr>
              <td className='title'>Email address:</td>
              <td>{patient?.email}</td>
            </tr>
            <tr>
              <td className='title'>Date of birth:</td>
              <td>{patient?.birth_date}</td>
            </tr>
            <tr>
              <td className='title'>Gender:</td>
              <td>{patient?.gender}</td>
            </tr>
          </tbody>
        </table>
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(PatientDetail);