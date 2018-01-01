import React from 'react';
import co from 'co';

// Material UI
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

// MBTA
import prediction from './mbta/prediction';
import logo from './logo.png';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: new Date(),
      schedules: [
        {
          isFailed: false,
          title: 'Wellington → Forest Hills',
          url: 'https://www.mbta.com/schedules/Orange/schedule?direction_id=0&origin=place-welln',
          stop_id: 'place-welln',       // Wellington: place-welln, Malden Center: place-mlmnl
          direction_id: 0,              // 0: Southbound, 1: Northbound
          departureTime: []
        }
      ]
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
    const self = this;

    co(function * () {
      const schedules = [];
      for (let i = 0; i < self.state.schedules.length; i++) {
        const sch = Object.assign({}, self.state.schedules[i]);
        try {
          sch.departureTime = yield prediction(sch.stop_id, sch.direction_id);
          sch.isFailed = false;
        } catch (e) {
          sch.isFailed = true;
        }

        schedules.push(sch);
      }

      const state = {
        currentTime: new Date(),
        schedules
      };

      console.log('success', state);
      self.setState(state);
    })
    .catch(console.error);
  }

  getList(schedule, schedule_id) {
    const link = <a href={schedule.url}>{schedule.url}</a>;

    if (schedule.departureTime.length === 0) {

      // 1. No Data
      return [
        <ListItem key={schedule_id + '-time-0'}>
          <ListItemText primary='No Data' secondary={link} />
        </ListItem>
      ];
    }

    try {

      // 2. Arrival Time
      const list = [];
      for (let i = 0; i < schedule.departureTime.length; i++) {
        const time = schedule.departureTime[i];

        if (time.getTime() === 0) {
          console.log(schedule.departureTime);
          throw new Error();
        }

        const t = new Date(time - this.state.currentTime);
        const MM = t.getMinutes() === 0 ? '' : (t.getMinutes() + 'm ');
        const SS = t.getSeconds() + 's';

        list.push(
          <ListItem key={schedule_id + '-time-' + i}>
            <ListItemText
              primary={time.toLocaleTimeString()}
              secondary={MM + SS}
            />
          </ListItem>
        );
      }
      return list;

    } catch (e) {

      // 3. Error
      const msg = 'There have some problems to Orange Line. Please check it on MBTA website.';
      return [
        <ListItem key={schedule_id + '-time-0'}>
         <ListItemText primary={msg} secondary={link} />
       </ListItem>
      ];
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <AppBar position="static" style={{backgroundColor: '#FF9800', color: 'black'}}>
          <Toolbar>
            <a href='https://www.mbta.com/schedules/Orange/schedule'>
              <img alt='' src={logo} style={{ height: '30px', width: '30px', marginRight: '-30px' }}/>
            </a>
            <Typography type="title" color="inherit" style={{ margin: 'auto'}}>
              {this.state.currentTime.toLocaleTimeString()}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {
            this.state.schedules.map((sch, index) => {
              const id = 'sch-' + index;
              const list = this.getList(sch, id);
              list.unshift(
                <ListSubheader key={id} style={{ backgroundColor: 'white' }}>
                  {sch.title + (sch.isFailed ? ' (Update Failed)' : '')}
                </ListSubheader>);
              list.push(<Divider key={id + '-divider'}/>);
              return list;
            })
          }
        </List>
      </div>
    );
  }
}

export default App;
