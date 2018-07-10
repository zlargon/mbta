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

// Progress
import CircularProgress from '@material-ui/core/CircularProgress';

// Utils
import generateScheduleListItems from './utils/generateScheduleListItems';

// MBTA
import prediction from '../mbta/prediction';
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

  close = () => {
    this.props.dispatch({
      type: 'UI_SEARCH_DIALOG',
      open: false
    });
  }

  addScheduleToggle = (schedule) => () => {
    const { route, stop, direct_id } = schedule;
    const key = `${route.id}_${stop.id}_${direct_id}`;

    if (this.isScheduleExist(schedule)) {

      // remove schedule
      this.props.dispatch({
        type: 'SCHEDULE_REMOVE',
        route_id: route.id,
        stop_id: stop.id,
        direct_id: direct_id
      });

    } else {
      // loading
      this.props.dispatch({
        type: 'UI_SCHEDULE_LOADING_ADD',
        schedule: key
      });

      // add schedule
      prediction(route.id, stop.id, direct_id, this.props.maxNumber)
        .then(departureTime => {

          this.props.dispatch({
            type: 'SCHEDULE_ADD',
            route: route,
            stop: stop,
            direct_id: direct_id,
            departureTime: departureTime
          });

          // unloading
          this.props.dispatch({
            type: 'UI_SCHEDULE_LOADING_REMOVE',
            schedule: key
          });
        });
    }
  }

  getListItems = (schedule) => {
    const { route, stop, direct_id, destination } = schedule;
    const key = `${route.id}_${stop.id}_${direct_id}`;
    const isLoading = this.props.loading.hasOwnProperty(`${route.id}_${stop.id}_${direct_id}`);

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
            { isLoading ? <CircularProgress/> : (this.isScheduleExist(schedule) ? <StarIcon /> : <StarBorderIcon />) }
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );

    return [
      header,
      generateScheduleListItems(schedule, this.props.currentTime)
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
        onClose={this.close}
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
              <ClearIcon onClick={this.close}/>
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
    loading: state.ui.schedule_loading,
    maxNumber: state.preference.max_schedule_number
  }
})(SearchDialog);
