import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function ScheduleListItems (schedule, currentTime, limit = 3) {
  const url = `https://www.mbta.com/schedules/${schedule.route.id}/schedule?direction_id=${schedule.direct_id}&origin=${schedule.stop.id}`;
  const link = <a href={url} target="_blank">{url}</a>;
  const id = `${schedule.route.id}-${schedule.stop.id}-${schedule.direct_id}`;

  if (schedule.departureTime.length === 0) {

    // 1. No Data
    return [
      <ListItem key={id}>
        <ListItemText primary={'No Data'} secondary={link} />
      </ListItem>
    ];
  }

  // 2. Departure Time
  const list = [];
  for (let i = 0; i < limit && i < schedule.departureTime.length; i++) {
    const departureTime = new Date(schedule.departureTime[i]);

    // train has left
    if (departureTime - currentTime <= 0) {
      continue;
    }

    let t = Number.parseInt((departureTime - currentTime) / 1000, 10);
    let s = t % 60;   t = Number.parseInt(t / 60, 10);
    let m = t % 60;   t = Number.parseInt(t / 60, 10);
    let h = t % 24;

    const SS = s + 's';
    const MM = (m === 0) ? '' : (m + 'm ');
    const HH = (h === 0) ? '' : (h + 'h ');

    list.push(
      <ListItem key={`${id}-time-${i}`}
        style={{ textAlign: 'center' }}>
        <ListItemText
          primary={departureTime.toLocaleTimeString()}
          secondary={HH + MM + SS}
        />
      </ListItem>
    );
  }
  return list;
}

export default ScheduleListItems;
