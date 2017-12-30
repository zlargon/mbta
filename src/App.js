import React from 'react';

// Material UI
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemText } from 'material-ui/List';

// MBTA
import prediction from './mbta/prediction';
import logo from './logo.png';
const schedule = {
  stop_id: 'place-welln',   // Wellington: place-welln, Malden Center: place-mlmnl
  direction_id: 0,          // 0: Southbound, 1: Northbound
  stop_name: 'Wellington',
  destination_name: 'Forest Hills',
  url: 'https://www.mbta.com/schedules/Orange/schedule?direction_id=0&origin=place-welln'
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: new Date(),
      departureTime: [],
      isFailed: false
    }

    this.updateTime = this.updateTime.bind(this);
    this.render = this.render.bind(this);

    this.updateTime();
    setInterval(() => {
      if (new Date().getSeconds() % 10 !== 0) {
        // update current time
        this.setState({ currentTime: new Date() });
      } else {
        this.updateTime();
      }
    }, 1000);
  }

  updateTime() {
    const currentTime = new Date();

    prediction(schedule.stop_id, schedule.direction_id)
      .then(times => {
        this.setState({
          isFailed: false,
          currentTime,
          departureTime: times
        });
        console.log('update success');
      })
      .catch(error => {
        this.setState({
          isFailed: true,
          currentTime
        });
      });
  }

  getList() {
    const link = <a href={schedule.url}>{schedule.url}</a>;

    if (this.state.departureTime.length === 0) {

      // 1. No Data
      return <ListItem key='time-0'>
               <ListItemText primary='No Data' secondary={link} />
             </ListItem>;
    }

    try {

      // 2. Arrival Time
      return this.state.departureTime.map((departure, index) => {

        if (departure.getTime() === 0) {
          console.table(this.state);
          throw new Error();
        }

        const t = new Date(departure - this.state.currentTime);

        return <ListItem key={'time-' + index}>
                 <ListItemText
                   primary={departure.toLocaleTimeString()}
                   secondary={`${t.getMinutes()}m ${t.getSeconds()}s`}
                 />
               </ListItem>;
      });

    } catch (e) {

      // 3. Error
      const msg = 'There have some problems to Orange Line. Please check it on MBTA website.';
      return <ListItem key='time-0'>
               <ListItemText primary={msg} secondary={link} />
             </ListItem>;
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <AppBar position="static" style={{backgroundColor: '#FF9800', color: 'black'}}>
          <Toolbar>
            <a href={schedule.url}>
              <img alt='' src={logo} style={{ height: '30px', width: '30px', marginRight: '-30px' }}/>
            </a>
            <Typography type="title" color="inherit" style={{ margin: 'auto'}}>
              {this.state.currentTime.toLocaleTimeString() + (this.state.isFailed ? ' (Update Failed)' : '')}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListSubheader>{schedule.stop_name + ' → ' + schedule.destination_name}</ListSubheader>
          { this.getList() }
        </List>
      </div>
    );
  }
}

export default App;
