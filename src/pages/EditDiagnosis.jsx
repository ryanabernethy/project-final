import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";
import { API_URL } from "../constants";
import { Button, Segment, Dimmer, Loader } from "semantic-ui-react";
import Form from 'react-bootstrap/Form';

const EditDiagnosis = ({ isAuthenticated, user }) => {
  const [diagnosisList, setDiagnosisList] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  
  const [resMessage, setResMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { appointID } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isAuthenticated && (user?.is_staff === true) && (user?.is_superuser === false)) {
      setLoading(true);

      axios({
        url: `${API_URL}/api/add-diagnosis/`,
        method: "POST",
        data: {
          identifying_number: appointID,
          diagnosis: diagnosis
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
          console.log(res.data);
        })
        .catch((err) => {
          setError("Server Not Responding!");
        });
    }
  }, [isAuthenticated, user]);

  return (
    <div className='main_content' style={{marginLeft: '35vw', width: '40%'}}>
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
          <h2 style={{marginLeft: '12vw'}}>Add or Edit Diagnosis</h2>
          {loading && (
            <Segment
              style={{
                margin: "6rem 0rem 4.5rem 1vw",
                boxShadow: "none",
                border: 0,
              }}
            >
              <Dimmer active inverted>
                <Loader size="large"></Loader>
              </Dimmer>
            </Segment>
          )}
          <form onSubmit={handleSubmit}>
              <Form.Select aria-label="Diagnosis" onChange={(e) => setDiagnosis(e.target.value)} required>
                  <option>Select a diagnosis</option>
                  {diagnosisList?.map(item => (
                    <option value={item?.id} key={item?.id}>{item?.name}</option>
                  ))}
              </Form.Select>
              <Button color='blue' fluid size='medium' style={{marginTop: '1.5rem'}} type='submit'>
                  Submit
              </Button>
          </form>
          </>
        )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(EditDiagnosis);