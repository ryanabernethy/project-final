import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../actions/auth';
import { API_URL } from "../constants";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Dimmer, 
  Loader,
} from "semantic-ui-react";

const Verification = ({ email, password, login, isAuthenticated, user, loggedin }) => {
  const [otp, setOTP] = useState(null);
  const navigate = useNavigate();
  
  const [resMessage, setResMessage] = useState(null);
  const [resendResMessage, setResendResMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResend = (e) => {
    setLoading(true);

    axios({
      url: `${API_URL}/member/send-otp/`,
      method: "POST",
      data: {
        email: email
      },
    })
      .then((res) => {
        setResendResMessage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Server Not Responding");
        setLoading(false);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios({
      url: `${API_URL}/member/account-activation/`,
      method: "POST",
      data: {
        email: email,
        otp: otp
      },
    })
      .then((res) => {
        setResMessage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Server Not Responding");
        setLoading(false);
      });

    setOTP(null);
  };

  useEffect(() => {
    if(resMessage?.status === "success") {
      login(email, password);
    }
  }, [resMessage])

  useEffect(() => {
    if(loggedin && isAuthenticated && user) {
      if(user?.is_patient === true) {
        navigate('/patient-dashboard');
      } else if((user?.is_staff === true) && (user?.is_superuser === false)) {
        navigate('/doctor-dashboard');
      } else if((user?.is_staff === true) && (user?.is_superuser === true)) {
        navigate('/admin-dashboard');
      }
    }
  }, [loggedin, isAuthenticated, user])

  return (
    <div>
      {loading && (
        <Segment style={{ marginTop: '5rem', marginBottom: '-2rem', boxShadow: 'none', border: 0}}>
          <Dimmer active inverted>
            <Loader size='large'></Loader>
          </Dimmer>
        </Segment>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {resendResMessage && (
        resendResMessage?.status === "success" ? (
          <div className="alert alert-success" role="alert">
            {resendResMessage?.message}
          </div>
        ) : (
          <div className="alert alert-danger" role="alert">
            {resendResMessage?.message}
          </div>
        )
      )}
      {resMessage && (
        resMessage?.status === "success" ? (
          <div className="alert alert-success" role="alert">
            {resMessage?.message}
          </div>
        ) : (
          <div className="alert alert-danger" role="alert">
            {resMessage?.message}
          </div>
        )
      )}
      <Grid textAlign="center" style={{ height: "66vh", marginBottom: '-23vh'}} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            Enter the OTP that has been sent to your email address.
          </Header>
          <Form onSubmit={handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                placeholder="Your OTP"
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                required
              />
              <Button color="blue" fluid size="large" type="submit">
                Verify
              </Button>
            </Segment>
          </Form>
          <Message>
            Didn't you get the OTP?{" "}
            <span
              style={{
                color: "#0D47A1",
                marginLeft: "0.5rem",
                cursor: "pointer",
              }}
              onClick={handleResend}
            >
              Resend
            </span>
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loggedin: state.auth.loggedin
});

export default connect(mapStateToProps, { login })(Verification)