import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../actions/auth';
import { Button, Form, Grid, Header, Message, Segment, Dimmer, Loader } from 'semantic-ui-react';

const Login = ({ login, isAuthenticated, user, loggedin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [resError, setResError] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    const regexSpChar = /<|>/g;

    if(regexSpChar.test(email) || regexSpChar.test(password)) {
      setError("<, > are not allowed");
    } else {
      setLoading(true);
      login(email, password);
    }
  };

  if(isAuthenticated && user) {
    if(user?.is_patient === true) {
      navigate('/patient-dashboard');
    } else if((user?.is_staff === true) && (user?.is_superuser === false)) {
      navigate('/doctor-dashboard');
    } else if((user?.is_staff === true) && (user?.is_superuser === true)) {
      navigate('/admin-dashboard');
    }
  }

  useEffect(() => {
    if(loggedin !== null) {
      setLoading(false);

      if(loggedin === true) {
        if(user?.is_patient === true) {
          navigate('/patient-dashboard');
        } else if((user?.is_staff === true) && (user?.is_superuser === false)) {
          navigate('/doctor-dashboard');
        } else if((user?.is_staff === true) && (user?.is_superuser === true)) {
          navigate('/admin-dashboard');
        }
      } else if(loggedin === false) {
        setResError("Invalid credentials.");
      }
    }
  }, [loggedin])

  return (
    <div style={{minHeight: '89vh', marginBottom: '-23vh'}}>
      {loading && (
        <Segment style={{ marginTop: '5rem', marginBottom: '-2rem', boxShadow: 'none', border: 0}}>
          <Dimmer active inverted>
            <Loader size='large'></Loader>
          </Dimmer>
        </Segment>
      )}
      {resError && (
        <div className="alert alert-danger" role="alert">
          {resError}
        </div>
      )}
      <Grid textAlign='center' style={{ minHeight: '66vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='blue' textAlign='center'>
            Log in to your account
          </Header>
          <Form size='large' onSubmit={e => onSubmit(e)}>
            <Segment stacked>
              <Form.Input 
                fluid 
                icon='user' 
                iconPosition='left' 
                placeholder='E-mail address' 
                type='email'
                name='email'
                value={email}
                onChange={e => onChange(e)}
                required
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                name='password'
                value={password}
                onChange={e => onChange(e)}
                minLength='6'
                required
              />
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Button color='blue' fluid size='medium' type='submit'>
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <Link to='/signup' style={{color: '#0D47A1'}}>Sign up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loggedin: state.auth.loggedin
});

export default connect(mapStateToProps, { login })(Login)