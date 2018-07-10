import React from 'react';
import { connect } from 'react-redux';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
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

    this.updateSchedule();
    setInterval(() => {
      // update data every 10 sec
      this.updateSchedule();
    }, 10000);
  }

  removeSchedule = (schedule) => () => {
    this.props.dispatch({
      type: 'SCHEDULE_REMOVE',
      route_id: schedule.route.id,
      stop_id: schedule.stop.id,
      direct_id: schedule.direct_id
    });
  }

  updateSchedule = () => {
    const schedules = {...this.props.schedules};

    const requests = [];
    for (const key in schedules) {
      const sch = schedules[key];
      requests.push(prediction(sch.route.id, sch.stop.id, sch.direct_id));
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
            const { route, stop, direct_id, destination, isFailed } = sch;
            const shortNameStyle = {
              height: '35px',
              width: '35px',
              lineHeight: '36px',
              textAlign: 'center',
              borderRadius: '50%',
              backgroundColor: 'white',
              opacity: 0.7,
              marginRight: '5px',
              fontWeight: 'bold',
              fontAize: '20px',
              color: route.color
            };

            const header = (
              <ListItem key={id} style={{ backgroundColor: route.color, color: route.text_color, opacity: 0.9 }} >

                { route.short_name === '' ? '' : (
                  <div style={shortNameStyle}>
                    {route.short_name}
                  </div>
                )}

                <ListItemText inset
                  primary={`${stop.name} → ${destination.name} ${isFailed ? '(Update Failed)' : ''}`}
                  secondary={route.direction[direct_id]}

                  primaryTypographyProps={{
                    style: {
                      color: route.text_color
                    }
                  }}
                  secondaryTypographyProps={{
                    style: {
                      color: route.text_color,
                      fontWeight: 'bold'
                    }
                  }}
                />

                <ListItemSecondaryAction>
                  <IconButton>
                    <DeleteIcon onClick={this.removeSchedule(sch)} style={{ color: route.text_color }}/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );

            const list = generateScheduleListItems(sch, id, this.props.currentTime);
            list.unshift(header);
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
