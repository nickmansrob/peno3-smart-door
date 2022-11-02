import React, {Component} from 'react';
import {DayPilot, DayPilotScheduler} from "daypilot-pro-react";
//import Zoom from "./Zoom";

class Scheduler extends Component {

    constructor(props) {
        super(props);

        this.state = {
            startDate: "2021-10-01",
            scale: "Hour",
            eventHeight:30,
            cellWidth: 50,
            timeHeaders: [

                { groupBy: "Day"},
                { groupBy: "Hour", format: "h"}

            ],
            cellWidthSpec: "Auto",
            resources: [
                {name: "Monday", id: "A"},
                {name: "Tuesday", id: "B"},
                {name: "Wednesday", id: "C"},
                {name: "Thursday", id: "D"},
                {name: "Friday", id: "E"},
                {name: "Saturday", id: "F"},
                {name: "Sunday", id: "G"}
            ],
            events: [
                {id: 1, text: "Working", start: "2021-10-01T08:00:00", end: "2021-10-01T17:00:00", resource: "A", barColor: "#38761d"},
                {id: 2, text: "Working", start: "2021-10-01T08:00:00", end: "2021-10-01T17:00:00", resource: "B", barColor: "#38761d", barBackColor: "#93c47d" },
                {id: 3, text: "Working", start: "2021-10-01T08:00:00", end: "2021-10-01T17:00:00", resource: "C", barColor: "#38761d", barBackColor: "#f1c232" },
                {id: 4, text: "Working", start: "2021-10-01T08:00:00", end: "2021-10-01T17:00:00", resource: "D", barColor: "#38761d", barBackColor: "#f1c232" },
                {id: 5, text: "Working", start: "2021-10-01T08:00:00", end: "2021-10-01T17:00:00", resource: "E", barColor: "#38761d", barBackColor: "#ea9999" }
            ]
        };
    }

    render() {
        const {...config} = this.state;
        return (
            <div>
                <DayPilotScheduler
                    {...config}
                />
            </div>
        );
    }
}

export default Scheduler;