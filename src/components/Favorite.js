import React from 'react';
import { connect } from 'react-redux';

// List
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// MBTA
import prediction from '../mbta/prediction';

// Utils
import generateScheduleListItems from './utils/generateScheduleListItems';

class Favorite extends React.Component {
  state = {}

  constructor (props) {
    super(props);

    // TODO: move to index.js
    this.updateSchedule();
    setInterval(() => {
      // update data every 10 sec
      this.updateSchedule();
    }, 10000);
  }

  removeSchedule = (schedule) => () => {
    this.props.dispatch({
      type: 'SCHEDULE_REMOVE',
      route_id: schedule.route_id,
      stop_id: schedule.stop_id,
      direct_id: schedule.direct_id
    });
  }

  updateSchedule = () => {
    const schedules = {...this.props.schedules};

    const requests = [];
    for (const key in schedules) {
      const sch = schedules[key];
      requests.push(prediction(sch.route_id, sch.stop_id, sch.direct_id));
    }

    Promise.all(requests)
      .then(departureTimes => {
        let i = 0;
        for (const key in schedules) {
          const sch = schedules[key];
          sch.departureTime = departureTimes[i++];
        }

        this.props.dispatch({
          type: 'SCHEDULE_UPDATE',
          schedules: schedules
        });
      });
  }

  render = () => {
    return (
      <List style={this.props.style}>
        {
          Object.values(this.props.schedules).map((sch, index) => {
            const id = 'sch-' + index;
            const list = generateScheduleListItems(sch, id, this.props.currentTime);
            list.unshift(
              <ListSubheader key={id} style={{ backgroundColor: '#' + sch.color, color: 'white', opacity: 0.9 }}>
                {sch.title + (sch.isFailed ? ' (Update Failed)' : '')}
                <IconButton>
                  <DeleteIcon onClick={this.removeSchedule(sch)} style={{color: 'white'}}/>
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

export default connect((state) => {
  return {
    currentTime: state.currentTime,
    schedules: state.schedules
  }
})(Favorite);
