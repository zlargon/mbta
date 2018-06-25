import React from 'react';
import Routes from './mbta/route.json';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
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
import logo from './logo.png';

// MBTA
import prediction from './mbta/prediction';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Search extends React.Component {

  state = {
    collapse: [],
    openDialog: false,
    inSchdule: {
      departureTime: []
    },
    outSchdule: {
      departureTime: []
    }
  }

  collapseHandler = (index) => (event, target) => {
    const collapse = Object.assign([], this.state.collapse);
    collapse[index] = !collapse[index];

    this.setState({
      collapse: collapse
    });
  }

  popupSchedule = (route, stop) => () => {

    Promise.all([
      prediction(route.id, stop.id, 0),
      prediction(route.id, stop.id, 1)
    ])
    .then(departureTimes => {
      this.setState({
        inSchdule: {
          title: `${stop.name} (${route.direction[0]})`,
          route_id: route.id,
          stop_id: stop.id,
          direction_id: 0,
          departureTime: departureTimes[0]
        },

        outSchdule: {
          title: `${stop.name} (${route.direction[1]})`,
          route_id: route.id,
          stop_id: stop.id,
          direction_id: 1,
          departureTime: departureTimes[1]
        },

        openDialog: true
      })
    });
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


  render () {
    const list = [];
    for (let route of Routes) {

      // Route list
      list.push(
        <ListItem button key={route.id + '-route'}
          style={{ backgroundColor: '#' + route.color, opacity: 0.9 }}
          onClick={this.collapseHandler(route.id)}>

          <ListItemIcon>
            <img alt='' src={logo} style={{ height: '30px', width: '30px' }}/>
          </ListItemIcon>
          <ListItemText inset
            primary={
              <Typography variant="subheading" style={{ color: '#' + route.text_color }}>
                {route.name}
              </Typography>
            }
            secondary={
              <Typography style={{ color: '#' + route.text_color }}>
                {`${route.direction[0]} / ${route.direction[1]}`}
              </Typography>
            }/>
          {this.state.collapse[route.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                onChange={this.props.onSelect(route, stop, 0)}
                checked={this.props.select[stop.id + '_0']}
              />

              <Checkbox
                color="primary"
                onChange={this.props.onSelect(route, stop, 1)}
                checked={this.props.select[stop.id + '_1']}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      }

      // Collapse with stop list
      list.push(
        <Collapse key={route.id + '-collapse'} in={this.state.collapse[route.id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            { stops }
          </List>
        </Collapse>
      );
    }

    return (
      <div>
        <List component="nav" style={this.props.style}>
          { list }
        </List>

        <Dialog
          open={this.state.openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => { this.setState({ openDialog: false }) }}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle style={{ margin: 'auto' }}>
            { new Date().toLocaleTimeString() }
          </DialogTitle>
          <DialogContent>
            <List>
              <ListSubheader>
                {this.state.inSchdule.title}
              </ListSubheader>

              { this.getList(this.state.inSchdule,'inbound', new Date()) }

              <Divider/>

              <ListSubheader>
                {this.state.outSchdule.title}
              </ListSubheader>

              { this.getList(this.state.outSchdule,'outbound', new Date()) }
            </List>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Search;
