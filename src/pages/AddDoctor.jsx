import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../constants";
import Form from "react-bootstrap/Form";
import { Button, Segment, Dimmer, Loader } from "semantic-ui-react";

const AddDoctor = ({ isAuthenticated, user }) => {
  const [categories, setCategories] = useState(null);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [category, setCategory] = useState(null);

  const [resMessage, setResMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isAuthenticated && user) {
      setLoading(true);

      axios({
        url: `${API_URL}/member/register-doctor/`,
        method: "POST",
        data: {
          email: email,
          first_name: firstName,
          last_name: lastName,
          service_category: category,
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

      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setCategory(null);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      await axios({
        url: `${API_URL}/api/show-categories/`,
        method: "GET",
      })
        .then((res) => {
          setCategories(res.data);
        })
        .catch((err) => {
          setError("Something went wrong!");
        });
    };

    getCategories();
  }, []);

  return (
    <div className="main_content" style={{ marginLeft: "35vw", width: "40%" }}>
      {loading && (
        <Segment
          style={{
            margin: "1rem 0rem 3rem 0",
            boxShadow: "none",
            border: 0,
          }}
        >
          <Dimmer active inverted>
            <Loader size="large"></Loader>
          </Dimmer>
        </Segment>
      )}
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
      
      {isAuthenticated && (<>
        <h2 style={{ marginLeft: "12vw" }}>Add Doctor</h2>
        <form onSubmit={handleSubmit}>
          <Form.Control
            type="text"
            id="firstName"
            aria-describedby="firstName"
            placeholder="First name"
            style={{marginBottom: '1.2rem'}}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Form.Control
            type="text"
            id="lastName"
            aria-describedby="lastName"
            placeholder="Last name"
            style={{marginBottom: '1.2rem'}}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Form.Control
            type="email"
            id="email"
            aria-describedby="email"
            placeholder="Email address"
            style={{marginBottom: '1.2rem'}}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Select aria-label="Category" onChange={(e) => setCategory(e.target.value)} required>
            <option>Select a category</option>
            {categories?.map((category) => (
              <option value={category?.id} key={category?.id}>{category?.name}</option>
            ))}
          </Form.Select>
          <Button
            color="blue"
            fluid
            size="medium"
            style={{ marginTop: "1.5rem" }}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </>)}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddDoctor);