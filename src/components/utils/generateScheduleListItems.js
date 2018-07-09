import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function generateScheduleListItems (schedule, schedule_id, currentTime) {
  const url = `https://www.mbta.com/schedules/${schedule.route_id}/schedule?direction_id=${schedule.direction_id}&origin=${schedule.stop_id}`;
  const link = <a href={url}>{url}</a>;

  if (schedule.departureTime.length === 0) {

    // 1. No Data
    return [
      <ListItem key={schedule_id + '-time-0'}>
        <ListItemText primary={'No Data'} secondary={link} />
      </ListItem>
    ];
  }

  // 2. Departure Time
  const list = [];
  for (let i = 0; i < schedule.departureTime.length; i++) {
    const departureTime = new Date(schedule.departureTime[i]);

    // train has left
    if (departureTime - currentTime <= 0) {
      continue;
    }

    const t = new Date(departureTime - currentTime);
    const MM = t.getMinutes() === 0 ? '' : (t.getMinutes() + 'm ');
    const SS = t.getSeconds() + 's';

    list.push(
      <ListItem key={schedule_id + '-time-' + i}
        style={{ textAlign: 'center' }}>
        <ListItemText
          primary={departureTime.toLocaleTimeString()}
          secondary={MM + SS}
        />
      </ListItem>
    );
  }
  return list;
}

export default generateScheduleListItems;
