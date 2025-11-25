import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function getKey() {
  if ("API key" in localStorage) {
    if (localStorage["API key"].length > 1) {
      return localStorage["API key"][0] + "***" + localStorage["API key"].slice(-1)
    } else {
      return localStorage["API key"]
    }
  }
}

function UserComponent({loggedIn, setLoggedIn}) {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");

  async function login(key) {
    try {
      const result = await fetch('http://localhost:3000/api/get-data', {
        headers: {
          'x-influxdb-token': key
        }
      });
      
      let resultBody = await result.json();

      if (result.status === 200 || result.status === 304) {
        localStorage['API key'] = key;
        setLoggedIn(true);
        setMessage("");
        window.location.reload();  // ensures sidebar correctly reloads and fetches data
      } else if (await resultBody.error === "unauthorized access") {
        setMessage("Invalid InfluxDB credentials. Please try again.");
      } else {
        setMessage("Unexpected error occured during login");
      }
    } catch (error) {
      console.error('Error in menu bar:', error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    login(key);
  }

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('API key');
    setLoggedIn(false);
    window.location.reload(); // reload page to reset selected items
  }

  if (loggedIn) {
    return (
      <NavDropdown title={"Logged in with key: " + getKey()} id="user-id-dropdown"> 
        <Form onSubmit={logout} id="login-form">
          <Button variant="primary" type="submit">
            Logout
          </Button>
        </Form>
      </NavDropdown>
    )
  }

  return (
    <NavDropdown title="Log in" id="user-id-dropdown">
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3" controlId="form-Key">
            <Form.Label>API Key</Form.Label>
            <Form.Control type="password" placeholder="Enter API key" onChange={(e) => setKey(e.target.value)}/>
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button><br></br>
          {message}
        </Form>
      </NavDropdown>
  )
}

UserComponent.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  setLoggedIn: PropTypes.func.isRequired
};

function MenuBar({loggedIn, setLoggedIn}) {
  return (
    <Navbar expand="lg" className="custom-navbar-bg">
      <Container>

        {/* Help button */}
        <Navbar.Brand href="#home">Help</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* User ID dropdown aligned to the right */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <UserComponent
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

MenuBar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  setLoggedIn: PropTypes.func.isRequired
};

export default MenuBar;
