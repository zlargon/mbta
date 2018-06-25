import React from 'react';

// List
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

class ScheduleList extends React.Component {

  constructor(props) {
    super(props);
  }

  getList(schedule, schedule_id, currentTime) {
    const url = `https://www.mbta.com/schedules/Orange/schedule?direction_id=${schedule.direction_id}&origin=${schedule.stop_id}`;
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
    const { style } = this.props;

    return (
      <List style={style}>
        {
          this.props.schedules.map((sch, index) => {
            const id = 'sch-' + index;
            const list = this.getList(sch, id, this.props.currentTime);
            list.unshift(
              <ListSubheader key={id} style={{ backgroundColor: 'white' }}>
                {sch.title + (sch.isFailed ? ' (Update Failed)' : '')}
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
