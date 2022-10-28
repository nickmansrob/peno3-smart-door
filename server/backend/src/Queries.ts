import { Interval } from "luxon";

abstract function getRecords(range: Interval, order: 'ASCENDING' | 'DESCENDING'): void

function getEntries