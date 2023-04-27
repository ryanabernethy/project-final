import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { API_URL } from "../constants";
import { Table, Segment, Dimmer, Loader } from "semantic-ui-react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminCalendar from "./AdminCalendar";

const AdminDashboard = ({ isAuthenticated, user }) => {
  const [appointments, setAppointments] = useState(null);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showPatientDetail = (identifyNumber) => {
    navigate(`/patient-detail/${identifyNumber}`);
  }

  useEffect(() => {
    if(isAuthenticated && (user?.is_staff === true) && (user?.is_superuser === true)) {
      setLoading(true);

      const getAppointments = async () => {
        await axios({
          url: `${API_URL}/api/admin-appointment/`,
          method: "GET",
        })
          .then((res) => {
            setAppointments(res.data);
            setLoading(false);
          })
          .catch((err) => {
            setError("Something went wrong!");
            setLoading(false);
          });
      };
  
      getAppointments();
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
        <h2>All Appointments for Today</h2>
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
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Doctor</Table.HeaderCell>
                <Table.HeaderCell>Diagnosis</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {appointments?.map((appointment, i) => (
                (i === 0) ? (
                  <Table.Row key={appointment?.id}>
                    <Table.Cell collapsing>{appointment?.identifying_number}</Table.Cell>
                    <Table.Cell>{appointment?.user?.first_name} {appointment?.user?.last_name} <VisibilityIcon style={{color: 'green', float: 'right', cursor: 'pointer'}} onClick={() => showPatientDetail(appointment?.user?.identifying_number)} /></Table.Cell>
                    <Table.Cell>{appointment?.disease_category?.name}</Table.Cell>
                    <Table.Cell>{appointment?.doctor?.user?.first_name} {appointment?.doctor?.user?.last_name}</Table.Cell>
                    <Table.Cell>{appointment?.diagnosis?.name}</Table.Cell>
                    <Table.Cell collapsing>{appointment?.date}</Table.Cell>
                    <Table.Cell collapsing>{appointment?.start_time} - {appointment?.end_time}</Table.Cell>
                  </Table.Row>
                ) : (
                  <Table.Row key={appointment?.id}>
                    <Table.Cell>{appointment?.identifying_number}</Table.Cell>
                    <Table.Cell>{appointment?.user?.first_name} {appointment?.user?.last_name} <VisibilityIcon style={{color: 'green', float: 'right', cursor: 'pointer'}} onClick={() => showPatientDetail(appointment?.user?.identifying_number)} /></Table.Cell>
                    <Table.Cell>{appointment?.disease_category?.name}</Table.Cell>
                    <Table.Cell>{appointment?.doctor?.user?.first_name} {appointment?.doctor?.user?.last_name}</Table.Cell>
                    <Table.Cell>{appointment?.diagnosis?.name}</Table.Cell>
                    <Table.Cell>{appointment?.date}</Table.Cell>
                    <Table.Cell>{appointment?.start_time} - {appointment?.end_time}</Table.Cell>
                  </Table.Row>
                )
              ))}
            </Table.Body>
          </Table>
        )}

        {appointments !== null && (
          <AdminCalendar appointments={appointments} />
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

export default connect(mapStateToProps)(AdminDashboard);