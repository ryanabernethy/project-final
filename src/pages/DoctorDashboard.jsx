import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { API_URL } from "../constants";
import { Table, Segment, Dimmer, Loader } from "semantic-ui-react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DoctorCalendar from "./DoctorCalendar";

const DoctorDashboard = ({ isAuthenticated, user }) => {
  const [appointments, setAppointments] = useState(null);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showPatientDetail = (identifyNumber) => {
    navigate(`/patient-detail/${identifyNumber}`);
  }

  const handleEditDiagnosis = (appointID) => {
    navigate(`/edit-diagnosis/${appointID}`);
  }

  useEffect(() => {
    if(isAuthenticated && (user?.is_staff === true) && (user?.is_superuser === false)) {
      setLoading(true);

      axios({
        url: `${API_URL}/api/doctor-appointment/`,
        method: "POST",
        data: {
          email: user?.email,
        },
      })
        .then((res) => {
          setAppointments(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Server Not Responding!");
          setLoading(false);
        });
    }
  }, [isAuthenticated, user]);

  return (
    <div className='main_content' style={{width: '76%'}}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {isAuthenticated && (
        <>
        <h2>Today's Appointments</h2>
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
          <Table celled striped color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Appointment ID</Table.HeaderCell>
                <Table.HeaderCell>Patient</Table.HeaderCell>
                <Table.HeaderCell>Symptoms</Table.HeaderCell>
                <Table.HeaderCell>Comment</Table.HeaderCell>
                <Table.HeaderCell>Diagnosis</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {appointments?.map((appointment, i) => (
                (i === 0) ? (
                  <Table.Row key={appointment?.id}>
                    <Table.Cell collapsing>{appointment?.identifying_number}</Table.Cell>
                    <Table.Cell>{appointment?.user?.first_name} {appointment?.user?.last_name} <VisibilityIcon style={{color: 'green', float: 'right', cursor: 'pointer'}} onClick={() => showPatientDetail(appointment?.user?.identifying_number)} /></Table.Cell>
                    <Table.Cell>{appointment?.symptom}</Table.Cell>
                    <Table.Cell>{appointment?.comment}</Table.Cell>
                    <Table.Cell>{appointment?.diagnosis?.name} <EditIcon style={{color: 'green', float: 'right', cursor: 'pointer'}} onClick={() => handleEditDiagnosis(appointment?.identifying_number)} /></Table.Cell>
                    <Table.Cell collapsing>{appointment?.start_time} - {appointment?.end_time}</Table.Cell>
                  </Table.Row>
                ) : (
                  <Table.Row key={appointment?.id}>
                    <Table.Cell>{appointment?.identifying_number}</Table.Cell>
                    <Table.Cell>{appointment?.user?.first_name} {appointment?.user?.last_name} <VisibilityIcon style={{color: 'green', float: 'right', cursor: 'pointer'}} onClick={() => showPatientDetail(appointment?.user?.identifying_number)} /></Table.Cell>
                    <Table.Cell>{appointment?.symptom}</Table.Cell>
                    <Table.Cell>{appointment?.comment}</Table.Cell>
                    <Table.Cell>{appointment?.diagnosis?.name} <EditIcon style={{color: 'green', float: 'right', cursor: 'pointer'}} onClick={() => handleEditDiagnosis(appointment?.identifying_number)} /></Table.Cell>
                    <Table.Cell>{appointment?.start_time} - {appointment?.end_time}</Table.Cell>
                  </Table.Row>
                )
              ))}
            </Table.Body>
          </Table>
        )}

        {appointments !== null && (
          <DoctorCalendar appointments={appointments} />
        )}
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(DoctorDashboard);