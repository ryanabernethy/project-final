import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../constants";
import Form from "react-bootstrap/Form";
import { Button } from "semantic-ui-react";
import Table from "react-bootstrap/Table";
import { Segment, Dimmer, Loader } from "semantic-ui-react";

const StoreDiagnosis = ({ isAuthenticated, user }) => {
  const [diagnosisList, setDiagnosisList] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  const [resMessage, setResMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isAuthenticated && (user?.is_staff === true) && (user?.is_superuser === false)) {
      setLoading(true);

      axios({
        url: `${API_URL}/api/store-diagnosis/`,
        method: "POST",
        data: {
          email: user?.email,
          diagnosis: diagnosis
        },
      })
        .then((res) => {
          setResMessage(res.data);
          setLoading(false);
          setReload(true);
        })
        .catch((err) => {
          setError("Server Not Responding");
          setLoading(false);
        });

      setDiagnosis(null);
    }
  };

  useEffect(() => {
    if(isAuthenticated && (user?.is_staff === true) && (user?.is_superuser === false)) {
      axios({
        url: `${API_URL}/api/show-diagnosis/`,
        method: "POST",
        data: {
          email: user?.email,
        },
      })
        .then((res) => {
          setDiagnosisList(res.data);
          setReload(false);
        })
        .catch((err) => {
          setError("Server Not Responding!");
          setReload(false);
        });
    }
  }, [isAuthenticated, user, reload]);

  return (
    <div className="main_content" style={{ marginLeft: "35vw", width: "40%" }}>
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
          <h2 style={{ marginLeft: "12vw" }}>Store Diagnosis</h2>
          <form onSubmit={handleSubmit}>
            <Form.Control
              type="text"
              id="diagnosis"
              aria-describedby="storeDiagnosis"
              placeholder="Enter diagnosis"
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
            <Button
              color="blue"
              fluid
              size="medium"
              style={{ marginTop: "1.5rem" }}
              type="submit"
            >
              Save
            </Button>
          </form>

          {loading ? (
            <Segment
              style={{
                margin: "6rem 0rem 2rem 1vw",
                boxShadow: "none",
                border: 0,
              }}
            >
              <Dimmer active inverted>
                <Loader size="large"></Loader>
              </Dimmer>
            </Segment>
          ) : (
            <Table striped bordered hover style={{ marginTop: "7rem" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ fontWeight: "800" }}>Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {diagnosisList?.map((item, i) => (
                  <tr key={item?.id}>
                    <td>{i}</td>
                    <td>{item?.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(StoreDiagnosis);
