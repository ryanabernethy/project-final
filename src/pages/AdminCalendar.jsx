import React from 'react'
import Fullcalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import * as bootstrap from "bootstrap";

const AdminCalendar = ({ appointments }) => {
  let events = [];

  if(appointments !== null) {
      appointments.forEach(appointFunc);

      function appointFunc(item, index) {
        events.push(
          {
            title: "Patient: " + item?.user?.first_name + " " + item?.user?.last_name + "; Doctor: " + item?.doctor?.user?.first_name + " " + item?.doctor?.user?.last_name + "; Appointment ID: " + item?.identifying_number,
            start: item?.date + "T" + item?.start_time,
            end: item?.date + "T" + item?.end_time,
          }
        );
      }
  }

  return (
    <div style={{marginTop: '13vh', marginBottom: '12vh'}}>
      {events && (
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"75vh"}
        events={events}
        eventDidMount={(info) => {
          return new bootstrap.Popover(info.el, {
            title: info.event.title,
            placement: "auto",
            trigger: "hover",
            customClass: "popoverStyle",
            content: "<p>Appointment was booked.</p>",
            html: true,
          });
        }}
      />
      )}
    </div>
  )
}

export default AdminCalendar