import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { load_notification } from '../actions/auth';
import { connect } from "react-redux";
import { Table, Segment, Dimmer, Loader } from "semantic-ui-react";

const Notifications = ({ isAuthenticated, user, notification, notificationChangedId, load_notification }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = (id) => {
        if(isAuthenticated && (user?.is_patient === true)) {
          setLoading(true);
    
          axios({
            url: `${API_URL}/api/remove-notification/`,
            method: 'POST',
            data: {
              'notification': id
            }
          })
          .then(res => {
            setLoading(false);
            load_notification(notificationChangedId+1);
          })
          .catch(err => {
            setLoading(false);
          })
        }
    }

  return (
    <div className='main_content' style={{width: '76%'}}>
        <h2>Your Notifications</h2>
        {(isAuthenticated && (user?.is_patient === true)) && (
            loading ? (
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
                <Table striped color='green'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>Notifications</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {notification?.map((item, i) => (
                            (i === 0) ? (
                                <Table.Row>
                                    <Table.Cell collapsing>
                                        <NotificationsNoneOutlinedIcon />
                                    </Table.Cell>
                                    <Table.Cell>{item?.content}</Table.Cell>
                                    <Table.Cell collapsing textAlign='right' style={{cursor: 'pointer'}}>
                                        <CloseIcon onClick={() => handleDelete(item?.id)} />
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                <Table.Row>
                                    <Table.Cell>
                                        <NotificationsNoneOutlinedIcon />
                                    </Table.Cell>
                                    <Table.Cell>{item?.content}</Table.Cell>
                                    <Table.Cell textAlign='right' style={{cursor: 'pointer'}}>
                                        <CloseIcon onClick={() => handleDelete(item?.id)} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        ))}
                    </Table.Body>
                </Table>
            )
        )}
    </div>
  )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    notification: state.auth.notification,
    notificationChangedId: state.auth.notificationChangedId,
});
  
export default connect(mapStateToProps, { load_notification })(Notifications);