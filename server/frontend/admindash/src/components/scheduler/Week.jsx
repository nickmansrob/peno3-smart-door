import React, {Component} from 'react';
import {DayPilotCalendar} from "@daypilot/daypilot-lite-react";

class Calendar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      viewType: "Resources",
      startDate: "2022-11-07",
      columns: [
        {name: "Monday", id: "R1"},
        {name: "Tuesday", id: "R2"},
        {name: "Wednesday", id: "R3"},
        {name: "Thursday", id: "R4"},
        {name: "Friday", id: "R5"},
        {name: "Saturday", id: "R6"},
        {name: "Sunday", id: "R7"},
      ]
    };
  }

  render() {
    return (
      <DayPilotCalendar
        {...this.state}
      />
    );
  }
}

export default Calendar;