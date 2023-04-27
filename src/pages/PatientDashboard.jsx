import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../constants";
import { load_booking } from '../actions/auth';
import { Table, Button, Segment, Dimmer, Loader } from "semantic-ui-react";
import PatientCalendar from "./PatientCalendar";

const PatientDashboard = ({ isAuthenticated, user, bookingChangedId, load_booking }) => {
  const [appointments, setAppointments] = useState(null);

  const [resMessage, setResMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = (booking_number) => {
    if(isAuthenticated && (user?.is_patient === true)) {
      setLoading(true);

      axios({
        url: `${API_URL}/api/delete-booking/`,
        method: 'POST',
        data: {
          'booking_number': booking_number
        }
      })
      .then(res => {
        setResMessage(res.data);
        setLoading(false);
        load_booking(bookingChangedId+1);
      })
      .catch(err => {
        setError("Server Not Responding");
        setLoading(false);
      })
    }
  }

  useEffect(() => {
    if(isAuthenticated && (user?.is_patient === true)) {
      axios({
        url: `${API_URL}/api/patient-appointment/`,
        method: "POST",
        data: {
          email: user?.email,
        },
      })
        .then((res) => {
          setAppointments(res.data);
        })
        .catch((err) => {
          setError("Server Not Responding!");
        });
    }
  }, [isAuthenticated, user, bookingChangedId]);

  return (
    <div className='main_content' style={{width: '76%'}}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {resMessage &&
        (resMessage?.status === "success" ? (
          <div className="alert alert-success" role="alert">
            {resMessage?.message}
          </div>
        ) : (
          <div className="alert alert-danger" role="alert">
            {resMessage?.message}
          </div>
        ))
      }
      
      {isAuthenticated && (
        <>
        <h2>Appointments</h2>
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
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Doctor</Table.HeaderCell>
                <Table.HeaderCell>Diagnosis</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {appointments?.map((appointment, i) => (
                (i === 0) ? (
                  <Table.Row key={appointment?.id}>
                    <Table.Cell collapsing>{appointment?.identifying_number}</Table.Cell>
                    <Table.Cell>{appointment?.disease_category?.name}</Table.Cell>
                    <Table.Cell>{appointment?.doctor?.user?.first_name} {appointment?.doctor?.user?.last_name}</Table.Cell>
                    <Table.Cell>{appointment?.diagnosis?.name}</Table.Cell>
                    <Table.Cell collapsing>{appointment?.date}</Table.Cell>
                    <Table.Cell collapsing>{appointment?.start_time} - {appointment?.end_time}</Table.Cell>
                    <Table.Cell collapsing><Button color='red' onClick={() => handleDelete(appointment?.identifying_number)}>Delete</Button></Table.Cell>
                  </Table.Row>
                ) : (
                  <Table.Row key={appointment?.id}>
                    <Table.Cell>{appointment?.identifying_number}</Table.Cell>
                    <Table.Cell>{appointment?.disease_category?.name}</Table.Cell>
                    <Table.Cell>{appointment?.doctor?.user?.first_name} {appointment?.doctor?.user?.last_name}</Table.Cell>
                    <Table.Cell>{appointment?.diagnosis?.name}</Table.Cell>
                    <Table.Cell>{appointment?.date}</Table.Cell>
                    <Table.Cell>{appointment?.start_time} - {appointment?.end_time}</Table.Cell>
                    <Table.Cell><Button color='red' onClick={() => handleDelete(appointment?.identifying_number)}>Delete</Button></Table.Cell>
                  </Table.Row>
                )
              ))}
            </Table.Body>
          </Table>
        )}
        
        {appointments !== null && (
          <PatientCalendar appointments={appointments} />
        )}
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  bookingChangedId: state.auth.bookingChangedId,
});

export default connect(mapStateToProps, { load_booking })(PatientDashboard);