import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function generateScheduleListItems (schedule, currentTime) {
  const url = `https://www.mbta.com/schedules/${schedule.route.id}/schedule?direction_id=${schedule.direct_id}&origin=${schedule.stop.id}`;
  const link = <a href={url}>{url}</a>;
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
      <ListItem key={`${id}-time-${i}`}
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
