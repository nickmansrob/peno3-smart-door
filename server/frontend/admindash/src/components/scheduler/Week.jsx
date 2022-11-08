import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "./week.scss"



class Calendar extends Component {

  constructor(props) {
    super(props);
    this.calendarRef = React.createRef();
    this.state = {
      viewType: "Resources",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async args => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        dp.clearSelection();
        if (!modal.result) { return; }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result
        });
      },
      eventDeleteHandling: "Update",
      onEventClick: async args => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt("Update event text:", args.e.text());
        if (!modal.result) { return; }
        const e = args.e;
        e.data.text = modal.result;
        dp.events.update(e);
      },
    };
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  componentDidMount() {

    const events = [
      {
        id: 1,
        resource: "R4",
        text: "Allowed",
        start: "2022-11-07T10:30:00",
        end: "2022-11-07T13:00:00"
      },
      {
        id: 2,
        resource: "R2",
        text: "Allowed",
        start: "2022-11-07T09:30:00",
        end: "2022-11-07T11:30:00"
      },
      {
        id: 3,
        resource: "R3",
        text: "Allowed",
        start: "2022-11-07T12:00:00",
        end: "2022-11-07T15:00:00"
      },
      {
        id: 4,
        resource: "R1",
        text: "Allowed",
        start: "2022-11-07T11:30:00",
        end: "2022-11-07T14:30:00"
      },
      {
        id: 5,
        resource: "R5",
        text: "Allowed",
        start: "2022-11-07T11:30:00",
        end: "2022-11-07T14:30:00"
      },
    ];

    const startDate = "2022-11-07";
  
    const columns = [
      {name: "Monday", id: "R1"},
      {name: "Tuesday", id: "R2"},
      {name: "Wednesday", id: "R3"},
      {name: "Thursday", id: "R4"},
      {name: "Friday", id: "R5"},
      {name: "Saturday", id: "R6"},
      {name: "Sunday", id: "R7"},
    ];

    this.calendar.update({startDate, events,columns});

  }

  render() {
    return (
      

        <div >
          <DayPilotCalendar
            {...this.state}
            ref={this.calendarRef}
          />
        </div>
      
    );
  }
}

export default Calendar;





