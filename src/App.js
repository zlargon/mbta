import React from 'react';
import co from 'co';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ScheduleList from './ScheduleList';

// BottomNavigation
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// Icon
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

// MBTA
import prediction from './mbta/prediction';
import logo from './logo.png';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panel: 0,
      currentTime: new Date(),
      schedules: [
        {
          title: 'Wellington → Forest Hills',
          stop_id: 'place-welln', // Wellington: place-welln, Malden Center: place-mlmnl
          direction_id: 0,        // 0: Southbound, 1: Northbound
          isFailed: false,
          departureTime: []
        },
        {
          title: 'Ruggles → Oak Grove',
          stop_id: 'place-rugg',
          direction_id: 1,
          isFailed: false,
          departureTime: []
        }
      ]
    }

    this.updateTime = this.updateTime.bind(this);
    this.render = this.render.bind(this);

    this.updateTime();
    setInterval(() => {
      if (new Date().getSeconds() % 10 === 0) {
        // update data every 10 sec
        this.updateTime();
      } else {
        // update current time every 1 sec
        this.setState({ currentTime: new Date() });
      }
    }, 1000);
  }

  panelChange = (event, value) => {
    this.setState({
      panel: value
    });
  };

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

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <AppBar position="sticky" style={{backgroundColor: '#FF9800', color: 'black'}}>
          <Toolbar>
            <a href='https://www.mbta.com/schedules/Orange/schedule'>
              <img alt='' src={logo} style={{ height: '30px', width: '30px', marginRight: '-30px' }}/>
            </a>
            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '20px'}}>
              {this.state.currentTime.toLocaleTimeString()}
            </Typography>
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: '-5px', marginBottom: '45px' }}>
          <ScheduleList
            schedules={this.state.schedules}
            currentTime={this.state.currentTime}/>
        </div>

        <BottomNavigation
          value={this.state.panel}
          onChange={this.panelChange}
          showLabels
          style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'WhiteSmoke' }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default App;
