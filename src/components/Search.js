import React from 'react';
import { connect } from 'react-redux';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// MBTA
import prediction from '../mbta/prediction';
import logo from '../mbta/logo.png';
import Routes from '../mbta/route.json';

// Dictionary
import dictionary from '../dictionary.json';

// Utils
import generateScheduleListItems from './utils/generateScheduleListItems';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Search extends React.Component {
  state = {}

  lang = (sentence) => {
    try {
      const translate = dictionary[sentence][this.props.lang];
      return typeof translate === 'undefined' ? sentence : translate;
    } catch (e) {
      return sentence;
    }
  }

  collapseHandler = (routeId) => () => {
    this.props.dispatch({
      type: 'UI_SEARCH_COLLAPSE',
      routeId: routeId
    });
  }

  popupSchedule = (route, stop) => () => {

    // TODO: loading
    Promise.all([
      prediction(route.id, stop.id, 0),
      prediction(route.id, stop.id, 1)
    ])
    .then(departureTimes => {

      // TODO: unloading
      this.props.dispatch({
        type: 'SEARCH_SCHEDULE',
        route: route,
        stop: stop,
        departureTimes: departureTimes
      });

      this.props.dispatch({
        type: 'UI_SEARCH_DIALOG',
        open: true
      })
    });
  }

  scheduleHandler = (route, stop, direct_id) => (event, checked) => {

    if (checked) {

      // Add Schedule
      // TODO: loading
      prediction(route.id, stop.id, direct_id)
        .then(departureTime => {

          // TODO: unloading
          this.props.dispatch({
            type: 'SCHEDULE_ADD',
            route: route,
            stop: stop,
            direct_id: direct_id,
            departureTime: departureTime
          });
        });

    } else {

      // Remove Schedule
      this.props.dispatch({
        type: 'SCHEDULE_REMOVE',
        route_id: route.id,
        stop_id: stop.id,
        direct_id: direct_id
      });
    }
  }

  render = () => {
    const list = [];
    for (let route of Routes) {

      // Route list
      list.push(
        <ListItem button key={route.id + '-route'}
          style={{ backgroundColor: route.color, opacity: 0.9 }}
          onClick={this.collapseHandler(route.id)}>

          <ListItemIcon>
            <img alt='' src={logo} style={{ height: '30px', width: '30px' }}/>
          </ListItemIcon>
          <ListItemText inset
            primary={this.lang(route.name)}
            primaryTypographyProps={{
              style: { color: route.text_color }
            }}
            secondary={`${route.direction[0]} / ${route.direction[1]}`}
            secondaryTypographyProps={{
              style: { color: route.text_color }
            }}/>
          {this.props.collapse[route.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
      );

      let stops = [];
      for (let stop of route.stops) {
        stops.push(
          <ListItem button key={stop.id} onClick={this.popupSchedule(route, stop)}>

            <ListItemText inset primary={stop.name} />

            <ListItemSecondaryAction>
              <Checkbox
                color="primary"
                onChange={this.scheduleHandler(route, stop, 0)}
                checked={this.props.schedules.hasOwnProperty(`${route.id}_${stop.id}_0`)}
              />

              <Checkbox
                color="primary"
                onChange={this.scheduleHandler(route, stop, 1)}
                checked={this.props.schedules.hasOwnProperty(`${route.id}_${stop.id}_1`)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      }

      // Collapse with stop list
      list.push(
        <Collapse key={route.id + '-collapse'} in={this.props.collapse[route.id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            { stops }
          </List>
        </Collapse>
      );

      // Add Divider
      list.push(
        <Divider key={route.id + '-divider'} light />
      )
    }

    const inbound = this.props.search.inbound;
    const outbound = this.props.search.outbound;
    return (
      <div>
        <List component="nav" style={this.props.style}>
          { list }
        </List>

        <Dialog
          open={this.props.dialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => { this.props.dispatch({ type: 'UI_SEARCH_DIALOG', open: false }); }}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle style={{ margin: 'auto' }}>
            { this.props.currentTime.toLocaleTimeString() }
          </DialogTitle>
          <DialogContent>
            <List>
              <ListSubheader>
                {`${inbound.stop.name} → ${inbound.destination.name} (${inbound.route.direction[inbound.direct_id]})`}
              </ListSubheader>
              { generateScheduleListItems(inbound, 'inbound', this.props.currentTime) }

              <Divider/>

              <ListSubheader>
                {`${outbound.stop.name} → ${outbound.destination.name} (${outbound.route.direction[outbound.direct_id]})`}
              </ListSubheader>
              { generateScheduleListItems(outbound, 'outbound', this.props.currentTime) }
            </List>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    currentTime: state.currentTime,
    lang: state.lang,
    collapse: state.ui.search_collapse,
    dialog: state.ui.search_dialog,
    schedules: state.schedules,
    search: state.searchSchedule
  }
})(Search);
