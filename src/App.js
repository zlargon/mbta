import React from 'react';
import co from 'co';

// Drawer
import Drawer from '@material-ui/core/Drawer';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Panels
import Settings from './Settings';
import Search from './Search';
import ScheduleList from './ScheduleList';

// BottomNavigation
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// Icon
import MenuIcon from '@material-ui/icons/Menu';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';

// MBTA
import prediction from './mbta/prediction';
import logo from './logo.png';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panel: 1,
      drawer: false,
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
    }, 500);
  }

  panelChange = (event, panelNumber) => {
    this.setState({
      panel: panelNumber
    });
  }

  toggleDrawer = (open) => () => {
    this.setState({
      drawer: open,
    });
  }

  showPanel = (panelNumber) => {
    if (panelNumber !== this.state.panel) {
      return { display: 'none' };
    }
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

  render () {
    let toolBarTitle;
    switch (this.state.panel) {
      case 0:
        toolBarTitle = 'Search';
        break;

      case 1:
        toolBarTitle = this.state.currentTime.toLocaleTimeString();
        break;

      case 2:
        toolBarTitle = 'Settings';
        break;
    }

    return (
      <div style={{ textAlign: 'center' }}>

        <Drawer open={this.state.drawer} onClose={this.toggleDrawer(false)}>
          <div style={{ width: '100px', padding: '20px' }}>
            Settings
          </div>
        </Drawer>

        <AppBar position="sticky" style={{backgroundColor: '#FF9800', color: 'black'}}>
          <Toolbar>

            <IconButton color="inherit" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '20px', fontWeight: 'bold'}}>
              {toolBarTitle}
            </Typography>

            <a href='https://www.mbta.com/schedules/Orange/schedule'>
              <img alt='' src={logo} style={{ height: '30px', width: '30px' }}/>
            </a>
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: '-5px', marginBottom: '45px' }}>
          {/* Panel 0 */}
          <Search style={this.showPanel(0)}/>

          {/* Panel 1 */}
          <ScheduleList
            style={this.showPanel(1)}
            schedules={this.state.schedules}
            currentTime={this.state.currentTime}/>

          {/* Panel 2 */}
          <Settings style={this.showPanel(2)}/>
        </div>

        <BottomNavigation
          value={this.state.panel}
          onChange={this.panelChange}
          showLabels
          style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'WhiteSmoke' }}
        >
          <BottomNavigationAction label="Search" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default App;
