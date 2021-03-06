import React from 'react';
import { connect } from 'react-redux';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

// Icon
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

// Utils
import ScheduleListItems from './ScheduleListItems';

// MBTA
import logo from '../mbta/logo.png';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SearchDialog extends React.Component {
  state = {}

  isScheduleExist = (schedule) => {
    const { route, stop, direct_id } = schedule;
    return this.props.schedules.hasOwnProperty(`${route.id}_${stop.id}_${direct_id}`);
  }

  hasTrain = (schedule) => {
    return schedule.stop.id !== schedule.destination.id;
  }

  dialogClose = () => {
    this.props.dispatch({
      type: 'UI_SEARCH_DIALOG',
      open: false
    });
  }

  openSnackbar = (message) => {
    this.props.dispatch({
      type: 'UI_SEARCH_DIALOG_SNARCK_BAR',
      open: true,
      message: message
    });
  }

  addScheduleToggle = (schedule) => () => {
    const { route, stop, direct_id, departureTime, destination } = schedule;
    const schedule_name = `${stop.name} → ${destination.name}`;

    if (this.isScheduleExist(schedule)) {

      // remove schedule
      this.props.dispatch({
        type: 'SCHEDULE_REMOVE',
        route_id: route.id,
        stop_id: stop.id,
        direct_id: direct_id
      });

      // show snackbar
      this.openSnackbar(`Remove "${schedule_name}" from Favorite List`);

    } else {

      // add schedule
      this.props.dispatch({
        type: 'SCHEDULE_ADD',
        route: route,
        stop: stop,
        direct_id: direct_id,
        departureTime: departureTime
      });

      // show snackbar
      this.openSnackbar(`Add "${schedule_name}" to Favorite List`);
    }
  }

  getListItems = (schedule) => {
    const { route, stop, direct_id, destination } = schedule;
    const key = `${route.id}_${stop.id}_${direct_id}`;

    const header = (
      <ListItem key={key}>
        <ListItemText
          primary={`${stop.name} → ${destination.name}`}
          secondary={route.direction[direct_id]}
          secondaryTypographyProps={{
            style: {
              fontWeight: 'bold'
            }
          }}
        />

        <ListItemSecondaryAction>
          <IconButton onClick={this.addScheduleToggle(schedule)}>
            { this.isScheduleExist(schedule) ? <StarIcon /> : <StarBorderIcon /> }
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );

    return [
      header,
      ScheduleListItems(schedule, this.props.currentTime, this.props.maxNumber)
    ];
  }

  render = () => {
    const {inbound, outbound} = this.props.search;
    return (
      <Dialog
        open={this.props.dialog}
        TransitionComponent={Transition}
        keepMounted
        fullScreen
        onClose={this.dialogClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <AppBar position="sticky" style={{backgroundColor: inbound.route.color, color: inbound.route.text_color}}>
          <Toolbar>
            <ListItemIcon>
              <img alt='' src={logo} style={{ height: '30px', width: '30px' }}/>
            </ListItemIcon>

            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '16px' }}>
              { this.props.currentTime.toLocaleTimeString() }
            </Typography>

            <IconButton color="inherit">
              <ClearIcon onClick={this.dialogClose}/>
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <List>
            { this.hasTrain(inbound) && this.getListItems(inbound) }
            { (this.hasTrain(inbound) && this.hasTrain(outbound)) && <Divider/> }
            { this.hasTrain(outbound) && this.getListItems(outbound) }
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect((state) => {
  return {
    currentTime: state.currentTime,
    dialog: state.ui.search_dialog,
    search: state.searchSchedule,
    schedules: state.schedules,
    maxNumber: state.preference.max_schedule_number
  }
})(SearchDialog);
