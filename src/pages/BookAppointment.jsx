import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { API_URL } from "../constants";
import { load_booking } from '../actions/auth';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import "./style.css";
import { Button, Segment, Dimmer, Loader } from "semantic-ui-react";

const BookAppointment = ({ isAuthenticated, user, bookingChangedId, load_booking }) => {
  const [categories, setCategories] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [timeSlots, setTimeSlots] = useState(null);

  const [category, setCategory] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [symptom, setSymptom] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [resMessage, setResMessage] = useState(null);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [slot1, setSlot1] = useState("initial");
  const [slot2, setSlot2] = useState("initial");
  const [slot3, setSlot3] = useState("initial");
  const [slot4, setSlot4] = useState("initial");
  const [slot5, setSlot5] = useState("initial");
  const [slot6, setSlot6] = useState("initial");
  const [slot7, setSlot7] = useState("initial");
  const [slot8, setSlot8] = useState("initial");
  const [slot9, setSlot9] = useState("initial");
  const [slot10, setSlot10] = useState("initial");
  const [slot11, setSlot11] = useState("initial");
  const [slot12, setSlot12] = useState("initial");
  const [slot13, setSlot13] = useState("initial");
  const [slot14, setSlot14] = useState("initial");

  const handleTime = (e, start, end) => {
    e.preventDefault();

    setStartTime(start);
    setEndTime(end);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isAuthenticated && user) {
      setLoading(true);

      axios({
        url: `${API_URL}/api/book-appointment/`,
        method: "POST",
        data: {
          email: user?.email,
          category: category,
          doctor: doctor,
          symptom: symptom,
          comment: comment,
          date: date,
          start_time: startTime,
          end_time: endTime
        },
      })
        .then((res) => {
          setResMessage(res.data);
          setLoading(false);
          load_booking(bookingChangedId+1);
        })
        .catch((err) => {
          setError("Server Not Responding");
          setLoading(false);
        });

      setCategory(null);
      setDoctor(null);
      setSymptom(null);
      setComment(null);
      setDate(null);
      setStartTime(null);
      setEndTime(null);
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

  useEffect(() => {
    if(category !== null) {
      axios({
        url: `${API_URL}/api/show-doctors/`,
        method: "POST",
        data: {
          category: category,
        },
      })
        .then((res) => {
          setDoctors(res.data);
        })
        .catch((err) => {
          setError("Server Not Responding!");
        });
    }
  }, [category]);

  useEffect(() => {
    if(date !== null) {
      let pickedDate = new Date(date);
      let differenceOfDates = Math.abs(pickedDate - new Date());
      let differenceOfdays = (differenceOfDates / 86400000);
      
      let nameOfDay = pickedDate.toLocaleDateString("en-GB", { weekday: 'long' })
      
      if(differenceOfdays > 28) {
        setDateError("Please pick a date which is less than 4 weeks in advance.");
      } else if(nameOfDay === "Saturday") {
        setDateError("Visiting doctor is closed on Saturday. Please choose a day except Saturday and Sunday.");
      } else if(nameOfDay === "Sunday") {
        setDateError("Visiting doctor is closed on Sunday. Please choose a day except Saturday and Sunday.");
      } else {
        setDateError(null);

        if(doctor !== null && date !== null) {
          axios({
            url: `${API_URL}/api/check-time-slot/`,
            method: "POST",
            data: {
              doctor: doctor,
              date: date
            },
          })
            .then((res) => {
              setTimeSlots(res.data);
            })
            .catch((err) => {
              setError("Server Not Responding!");
            });
        }
      }
    } 
  }, [doctor, date]);

  useEffect(() => {
    if(timeSlots !== null) {
      timeSlots.forEach(timeSlotFunc);

      function timeSlotFunc(slot, index) {
        if(slot?.start_time === '09:00:00') {
          setSlot1("none");
        } else if(slot?.start_time === '09:30:00') {
          setSlot2("none");
        } else if(slot?.start_time === '10:00:00') {
          setSlot3("none");
        } else if(slot?.start_time === '10:30:00') {
          setSlot4("none");
        } else if(slot?.start_time === '11:00:00') {
          setSlot5("none");
        } else if(slot?.start_time === '11:30:00') {
          setSlot6("none");
        } else if(slot?.start_time === '12:00:00') {
          setSlot7("none");
        } else if(slot?.start_time === '12:30:00') {
          setSlot8("none");
        } else if(slot?.start_time === '14:00:00') {
          setSlot9("none");
        } else if(slot?.start_time === '14:30:00') {
          setSlot10("none");
        } else if(slot?.start_time === '15:00:00') {
          setSlot11("none");
        } else if(slot?.start_time === '15:30:00') {
          setSlot12("none");
        } else if(slot?.start_time === '16:00:00') {
          setSlot13("none");
        } else if(slot?.start_time === '16:30:00') {
          setSlot14("none");
        }
      }
    }
  }, [timeSlots]);

  return (
    <div className="main_content">
      {loading && (
        <Segment
          style={{
            margin: "1rem 0rem 2rem 16vw",
            boxShadow: "none",
            border: 0,
          }}
        >
          <Dimmer active inverted>
            <Loader size="large"></Loader>
          </Dimmer>
        </Segment>
      )}
      {dateError && (
        <div className="alert alert-danger" role="alert">
          {dateError}
        </div>
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
        ))}

      {isAuthenticated && (<>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="booking_form">
        <TextField
          required
          id="category"
          select
          label="Select the Category of Disease"
          className="input_box"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories?.map((option) => (
            <MenuItem key={option?.id} value={option?.id}>
              {option?.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="symptoms"
          label="Symptoms"
          defaultValue="For example, vomiting"
          onChange={(e) => setSymptom(e.target.value)}
        />
        <TextField required id="doctor_selection" select label="Select Doctor" onChange={(e) => setDoctor(e.target.value)}>
          {doctors?.map((option) => (
            <MenuItem key={option?.id} value={option?.id}>
              {option?.user?.first_name + " " + option?.user?.last_name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          id="picking_date"
          label="Pick a Date"
          type="date"
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="comment"
          label="Comment"
          multiline
          rows={4}
          defaultValue="Tell about your disease..."
          onChange={(e) => setComment(e.target.value)}
        />
        {(timeSlots !== null) && (
          <div className="time_slots">
            <label>Select a Time Slot*</label>
            {startTime === '09:00:00' ? (
              <Button color="grey">
                9.00 a.m. - 9.30 a.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot1}} onClick={(e) => handleTime(e, '09:00:00', '09:30:00')}>
                9.00 a.m. - 9.30 a.m.
              </Button>
            )}
            {startTime === '09:30:00' ? (
              <Button color="grey">
                9.30 a.m. - 10.00 a.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot2}} onClick={(e) => handleTime(e, '09:30:00', '10:00:00')}>
                9.30 a.m. - 10.00 a.m.
              </Button>
            )}
            {startTime === '10:00:00' ? (
              <Button color="grey">
                10.00 a.m. - 10.30 a.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot3}} onClick={(e) => handleTime(e, '10:00:00', '10:30:00')}>
                10.00 a.m. - 10.30 a.m.
              </Button>
            )}
            {startTime === '10:30:00' ? (
              <Button color="grey">
                10.30 a.m. - 11.00 a.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot4}} onClick={(e) => handleTime(e, '10:30:00', '11:00:00')}>
                10.30 a.m. - 11.00 a.m.
              </Button>
            )}
            {startTime === '11:00:00' ? (
              <Button color="grey">
                11.00 a.m. - 11.30 a.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot5}} onClick={(e) => handleTime(e, '11:00:00', '11:30:00')}>
                11.00 a.m. - 11.30 a.m.
              </Button>
            )}
            {startTime === '11:30:00' ? (
              <Button color="grey">
                11.30 a.m. - 12.00 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot6}} onClick={(e) => handleTime(e, '11:30:00', '12:00:00')}>
                11.30 a.m. - 12.00 p.m.
              </Button>
            )}
            {startTime === '12:00:00' ? (
              <Button color="grey">
                12.00 p.m. - 12.30 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot7}} onClick={(e) => handleTime(e, '12:00:00', '12:30:00')}>
                12.00 p.m. - 12.30 p.m.
              </Button>
            )}
            {startTime === '12:30:00' ? (
              <Button color="grey">
                12.30 p.m. - 1.00 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot8}} onClick={(e) => handleTime(e, '12:30:00', '13:00:00')}>
                12.30 p.m. - 1.00 p.m.
              </Button>
            )}
            {startTime === '14:00:00' ? (
              <Button color="grey">
                2.00 p.m. - 2.30 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot9}} onClick={(e) => handleTime(e, '14:00:00', '14:30:00')}>
                2.00 p.m. - 2.30 p.m.
              </Button>
            )}
            {startTime === '14:30:00' ? (
              <Button color="grey">
                2.30 p.m. - 3.00 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot10}} onClick={(e) => handleTime(e, '14:30:00', '15:00:00')}>
                2.30 p.m. - 3.00 p.m.
              </Button>
            )}
            {startTime === '15:00:00' ? (
              <Button color="grey">
                3.00 p.m. - 3.30 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot11}} onClick={(e) => handleTime(e, '15:00:00', '15:30:00')}>
                3.00 p.m. - 3.30 p.m.
              </Button>
            )}
            {startTime === '15:30:00' ? (
              <Button color="grey">
                3.30 p.m. - 4.00 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot12}} onClick={(e) => handleTime(e, '15:30:00', '16:00:00')}>
                3.30 p.m. - 4.00 p.m.
              </Button>
            )}
            {startTime === '16:00:00' ? (
              <Button color="grey">
                4.00 p.m. - 4.30 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot13}} onClick={(e) => handleTime(e, '16:00:00', '16:30:00')}>
                4.00 p.m. - 4.30 p.m.
              </Button>
            )}
            {startTime === '16:30:00' ? (
              <Button color="grey">
                4.30 p.m. - 5.00 p.m.
              </Button>
            ) : (
              <Button basic color="grey" style={{display: slot14}} onClick={(e) => handleTime(e, '16:30:00', '17:00:00')}>
                4.30 p.m. - 5.00 p.m.
              </Button>
            )}
          </div>
        )}

        <Button color="blue" fluid size="medium" type="submit">
          Book
        </Button>
      </form>
      </>)}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  bookingChangedId: state.auth.bookingChangedId,
});

export default connect(mapStateToProps, { load_booking })(BookAppointment);