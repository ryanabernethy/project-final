import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { signup } from '../actions/auth';
import { Button, Form, Grid, Header, Message, Segment, Dimmer, Loader, Radio } from 'semantic-ui-react';
import Verification from './Verification';

const Signup = ({ signup, isAuthenticated, registered }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [resError, setResError] = useState(null);

  let identifying_number = Math.floor(Math.random() * 100000000) + 1;
  const is_patient = true;
  const [gender, setGender] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
    birth_date: ''
  });

  const { first_name, last_name, email, password, re_password, birth_date } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    const regexSpChar = /<|>/g;

    if(regexSpChar.test(first_name) || regexSpChar.test(last_name) || regexSpChar.test(email) || regexSpChar.test(password) || regexSpChar.test(re_password)) {
      setError("<, > are not allowed");
    } else if(password === re_password) {
      setLoading(true);
      signup(identifying_number, first_name, last_name, email, birth_date, gender, is_patient, password, re_password);
    } else {
      setError("Passwords did not match.");
    }
  };

  useEffect(() => {
    if(registered !== null) {
      setLoading(false);

      if(registered === false) {
        setResError("Your account was not created. Try again!");
      }
    }
  }, [registered])

  return (
    <div style={{minHeight: '87.5vh', paddingTop: '10vh', marginBottom: '-23vh'}}>
      {loading && (
        <Segment style={{ marginTop: '0.5rem', boxShadow: 'none', border: 0}}>
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
      { registered === true ? (
        <Verification email={email} password={password} />
      ) : (
        <Grid textAlign='center' style={{ minHeight: '66vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='blue' textAlign='center'>
              Sign up
            </Header>
            <Form size='large' onSubmit={e => onSubmit(e)}>
              <Segment stacked>
                <Form.Input 
                  fluid 
                  placeholder='First name' 
                  type='text'
                  name='first_name'
                  value={first_name}
                  onChange={e => onChange(e)}
                  required
                />
                <Form.Input 
                  fluid 
                  placeholder='Last name' 
                  type='text'
                  name='last_name'
                  value={last_name}
                  onChange={e => onChange(e)}
                  required
                />
                <Form.Input 
                  fluid 
                  placeholder='E-mail address' 
                  type='email'
                  name='email'
                  value={email}
                  onChange={e => onChange(e)}
                  required
                />
                <Form.Input
                  fluid
                  placeholder='Password'
                  type='password'
                  name='password'
                  value={password}
                  onChange={e => onChange(e)}
                  minLength='6'
                  required
                />
                <Form.Input
                  fluid
                  placeholder='Confirm password'
                  type='password'
                  name='re_password'
                  value={re_password}
                  onChange={e => onChange(e)}
                  minLength='6'
                  required
                />
                <label htmlFor='dateOfBirth' style={{float: 'left'}}>Date of birth</label>
                <Form.Input
                  fluid
                  type='date'
                  name='birth_date'
                  id='dateOfBirth'
                  value={birth_date}
                  onChange={e => onChange(e)}
                  required
                />
                <Form.Group inline>
                  <label>Gender</label>
                  <Form.Field
                    control={Radio}
                    label='Male'
                    name='gender'
                    value='Male'
                    checked={gender === 'Male'}
                    onClick={e => setGender('Male')}
                  />
                  <Form.Field
                    control={Radio}
                    label='Female'
                    name='gender'
                    value='Female'
                    checked={gender === 'Female'}
                    onClick={e => setGender('Female')}
                  />
                  <Form.Field
                    control={Radio}
                    label='Others'
                    name='gender'
                    value='Others'
                    checked={gender === 'Others'}
                    onClick={e => setGender('Others')}
                  />
                </Form.Group>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <Button color='blue' fluid size='medium' type='submit'>
                  Register
                </Button>
              </Segment>
            </Form>
            <Message>
              Already have an account? <Link to='/' style={{color: '#0D47A1'}}>Log in</Link>
            </Message>
          </Grid.Column>
        </Grid>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  registered: state.auth.registered
});

export default connect(mapStateToProps, { signup })(Signup)