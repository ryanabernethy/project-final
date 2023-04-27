import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { retrieve_notifications } from '../actions/auth'

const NotifyLayout = ({ retrieve_notifications, isAuthenticated, user, notificationChangedId, children }) => {
  useEffect(() => {
    if(isAuthenticated && (user?.is_patient === true)) {
        retrieve_notifications(user?.email);
    }
  }, [isAuthenticated, user, notificationChangedId]);

  return (
    <div>
        {children}
    </div>
  )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    notificationChangedId: state.auth.notificationChangedId,
});

export default connect(mapStateToProps, { retrieve_notifications })(NotifyLayout)