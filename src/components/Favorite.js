import React from 'react';
import { connect } from 'react-redux';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';

// Icon Button
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// Utils
import ScheduleListItems from './ScheduleListItems';

// Instructions
import instruction_1 from '../images/instruction_1.png';
import instruction_2 from '../images/instruction_2.png';

class Favorite extends React.Component {
  state = {}

  openDialog = (schedule) => () => {
    const {stop, destination} = schedule;

    this.props.dispatch({
      type: 'UI_FAVORITE_DIALOG',
      open: true,
      message: `${stop.name} → ${destination.name}`,
      schedule: schedule
    });
  }

  getListItems = () => {
    return Object.values(this.props.schedules).map((sch, index) => {
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
              <DeleteIcon onClick={this.openDialog(sch)} style={{ color: route.text_color }}/>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );

      return [
        header,
        ScheduleListItems(sch, this.props.currentTime, this.props.maxNumber),
        <Divider key={id + '-divider'}/>
      ];
    });
  }

  render = () => {
    const imgWidth = {
      maxWidth: '280px',
      width: '48%'
    };

    const listItems = this.getListItems();
    return (
      <List style={this.props.style}>
        { listItems.length > 0 ? listItems : (
          <ListItem>
            <ListItemText
              disableTypography
              primary={<div>
                <h2>Your Favorite List is empty.</h2>
                <p>Please click "Search" button below and add your schedules.</p>
                <div>
                  <img alt="" src={instruction_1} style={{...imgWidth, marginRight: '10px'}} />
                  <img alt="" src={instruction_2} style={imgWidth} />
                </div>
              </div>}
            />
          </ListItem>
        )}
      </List>
    );
  }
}

export default connect((state) => {
  return {
    currentTime: state.currentTime,
    schedules: state.schedules,
    maxNumber: state.preference.max_schedule_number
  }
})(Favorite);
