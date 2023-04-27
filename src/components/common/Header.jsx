import React from 'react'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Icon } from 'semantic-ui-react'
import { connect } from "react-redux";
import { logout } from "../../actions/auth";

const Header = ({ isAuthenticated, user, logout, notification }) => {
  const navigate = useNavigate();

  const showDetail = () => {
    navigate('/notifications');
  }

  const logout_user = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar variant="dark" style={{backgroundColor: '#237DAF', height: '4rem'}} expand="lg">
      <Container fluid>
        <Navbar.Brand href="" style={{marginLeft: '2vw'}}>MedicalBooking101</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <Nav style={{marginLeft: 'auto', marginRight: '8vw'}}>
            {(isAuthenticated && (user?.is_patient === true)) && (
              <NavDropdown
                id="notification-dropdown"
                title={
                  <div style={{display: 'inline-block', position: 'relative'}}>
                    <Icon name='bell' size='large' style={{color: '#e9f2f7'}} />
                    <div style={{color: '#FFF', display: 'inline-block', position: 'absolute', zIndex: '20', top: '-10px', left: '1.5rem', fontSize: '1.1rem'}}>{notification?.length}</div>
                  </div>
                }
                menuVariant="dark"
              >
                {notification?.map(item => (
                  <>
                  <NavDropdown.Item href="" style={{color: 'white'}} onClick={showDetail}>
                    {item?.content}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  </>
                ))}
                {(notification?.length > 0) && (
                  <NavDropdown.Item href="" style={{color: 'white'}} onClick={showDetail}>
                    View All Notifications
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            )}
            <NavDropdown
              id="user-dropdown"
              title={
                <>
                <Icon name='user' style={{color: '#e9f2f7', fontSize: '1.39rem'}} /> {" "}
                <span style={{color: 'white', fontSize: '1.1rem'}}>
                  {isAuthenticated ? (
                    user?.first_name + " " + user?.last_name
                  ) : (
                    "User"
                  )}
                </span>
                </>
              }
              menuVariant="dark"
              style={{marginLeft: '5vw'}}
            > 
              {isAuthenticated ? (
                <>
                <NavDropdown.Item href="/profile" style={{color: 'white'}}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="" style={{color: 'white'}} onClick={logout_user}>
                  Log out
                </NavDropdown.Item>
                </>
              ) : (
                <>
                <NavDropdown.Item href="/signup" style={{color: 'white'}}>
                  Sign up
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/" style={{color: 'white'}}>
                  Log in
                </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  notification: state.auth.notification,
});

export default connect(mapStateToProps, { logout })(Header);