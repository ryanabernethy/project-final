import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../constants";
import { Table, Segment, Dimmer, Loader } from "semantic-ui-react";

const OutdatedAppointments = ({ isAuthenticated, user }) => {
  const [appointments, setAppointments] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(isAuthenticated && (user?.is_patient === true)) {
      axios({
        url: `${API_URL}/api/outdated-appointment/`,
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
        <h2>Outdated Appointments</h2>
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
            <Table color="blue">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Appointment ID</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Doctor</Table.HeaderCell>
                  <Table.HeaderCell>Diagnosis</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Time</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {appointments?.map((appointment) => (
                  <Table.Row key={appointment?.id}>
                    <Table.Cell>{appointment?.identifying_number}</Table.Cell>
                    <Table.Cell>{appointment?.disease_category?.name}</Table.Cell>
                    <Table.Cell>{appointment?.doctor?.user?.first_name} {appointment?.doctor?.user?.last_name}</Table.Cell>
                    <Table.Cell>{appointment?.diagnosis?.name}</Table.Cell>
                    <Table.Cell>{appointment?.date}</Table.Cell>
                    <Table.Cell>{appointment?.start_time} - {appointment?.end_time}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
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

export default connect(mapStateToProps)(OutdatedAppointments);