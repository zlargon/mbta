import React from 'react';

// List
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class ScheduleList extends React.Component {

  constructor(props) {
    super(props);
  }

  getList(schedule, schedule_id, currentTime) {
    const url = `https://www.mbta.com/schedules/${schedule.route_id}/schedule?direction_id=${schedule.direction_id}&origin=${schedule.stop_id}`;
    const link = <a href={url}>{url}</a>;

    if (schedule.departureTime.length === 0) {

      // 1. No Data
      return [
        <ListItem key={schedule_id + '-time-0'}>
          <ListItemText primary='No Data' secondary={link} />
        </ListItem>
      ];
    }

    // 2. Departure Time
    const list = [];
    for (let i = 0; i < schedule.departureTime.length; i++) {
      const departureTime = schedule.departureTime[i];

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

  render() {
    return (
      <List style={this.props.style}>
        {
          this.props.schedules.map((sch, index) => {
            const id = 'sch-' + index;
            const list = this.getList(sch, id, this.props.currentTime);
            list.unshift(
              <ListSubheader key={id} style={{ backgroundColor: '#' + sch.color, color: 'white', opacity: 0.9 }}>
                {sch.title + (sch.isFailed ? ' (Update Failed)' : '')}
                <IconButton>
                  <DeleteIcon onClick={this.props.onDeleteSchedule(sch)} style={{color: 'white'}}/>
                </IconButton>
              </ListSubheader>);
            list.push(<Divider key={id + '-divider'}/>);
            return list;
          })
        }
      </List>
    );
  }
}

export default ScheduleList;
