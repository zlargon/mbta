import React from 'react';
import co from 'co';

// Drawer
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import team_logo from './team_logo.png';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Panels
import NearBy from './NearBy';
import Search from './Search';
import ScheduleList from './ScheduleList';

// BottomNavigation
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// Icon
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import StarIcon from '@material-ui/icons/Star';

// MBTA
import prediction from './mbta/prediction';
import logo from './mbta/logo.png';

// Dictionary
import dictionary from './dictionary.json';

class App extends React.Component {
  constructor(props) {
    super(props);

    // get select from localStorage
    let select = localStorage.getItem('select');
    if (select === null) {
      localStorage.setItem('select', '{}');
      select = '{}';
    }
    select = JSON.parse(select);

    this.state = {
      lang: 'zh',               // 語言
      panel: 0,                 // 目前所在頁面 0, 1, 2
      drawer: false,            // slide menu
      select: select,           // 選取的地鐵站
      currentTime: new Date(),  // 目前的時間
      schedules: []             // 時刻表
    }

    this.render = this.render.bind(this);

    this.updateSchedule();
    setInterval(() => {
      if (new Date().getSeconds() % 10 === 0) {
        // update data every 10 sec
        this.updateSchedule();
      } else {
        // update current time every 0.5 sec
        this.setState({ currentTime: new Date() });
      }
    }, 500);
  }

  lang = (sentence) => {
    if (this.state.lang === 'en') {
      return sentence;
    }

    return dictionary[sentence][this.state.lang];
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

  selectHandler = (route, stop, direct_id) => () => {
    const select = Object.assign({}, this.state.select);
    const key = stop.id + '_' + direct_id;

    if (select[key]) {
      delete select[key];
    } else {
      select[key] = `${route.id}_${stop.name} (${route.direction[direct_id]})_${route.color}`;
    }

    // save to location storage
    localStorage.setItem('select', JSON.stringify(select));

    // update schedule
    this.updateSchedule();
  }

  updateSchedule = co.wrap(function * () {
    const select = JSON.parse(localStorage.getItem('select'));

    // update schedules
    const schedules = [];
    for (let key in select) {

      const route_id = select[key].split('_')[0];
      const route_title = select[key].split('_')[1];
      const route_color = select[key].split('_')[2];

      const stop_id = key.split('_')[0];
      const direct_id = Number.parseInt(key.split('_')[1], 10);

      schedules.push({
        title: route_title,
        route_id: route_id,
        color: route_color,
        stop_id: stop_id,
        direction_id: direct_id,
        isFailed: false,
        departureTime: []
      });
    }

    const newSchedules = [];
    for (let i = 0; i < schedules.length; i++) {
      const sch = Object.assign({}, schedules[i]);
      try {
        sch.departureTime = yield prediction(sch.route_id, sch.stop_id, sch.direction_id);
        sch.isFailed = false;
      } catch (e) {
        sch.isFailed = true;
      }

      newSchedules.push(sch);
    }

    this.setState({
      currentTime: new Date(),
      select: select,
      schedules: newSchedules
    });
  })

  deleteSchedule = (sch) => () => {
    const select = JSON.parse(localStorage.getItem('select'));
    const key = sch.stop_id + '_' + sch.direction_id;
    delete select[key];
    localStorage.setItem('select', JSON.stringify(select));

    this.updateSchedule();
  }

  render () {
    let toolBarTitle;
    switch (this.state.panel) {
      case 0:
        toolBarTitle = this.lang('Search');
        break;

      case 1:
        toolBarTitle = this.state.currentTime.toLocaleTimeString();
        break;

      case 2:
        toolBarTitle = this.lang('Near By');
        break;
    }

    const divider = <Divider style={{backgroundColor: 'lightgray'}}/>;

    return (
      <div style={{ textAlign: 'center' }}>

        <Drawer open={this.state.drawer} onClose={this.toggleDrawer(false)} >
          <div className='drawer'>

            <img src={team_logo} className='drawer-logo'/>
            { divider }

            <div className="drawer-content">
              <div>{this.lang('Language')}</div>
            </div>
            { divider }

            <div className="drawer-content">
              <div>{this.lang('About us')}</div>
            </div>
            { divider }

            <div className="drawer-content">
              <div>{this.lang('Contact us')}</div>
            </div>
            { divider }
          </div>
        </Drawer>

        <AppBar position="sticky" style={{backgroundColor: '#1f88ff', color: 'white'}}>
          <Toolbar>

            <IconButton color="inherit" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '16px' }}>
              {toolBarTitle}
            </Typography>

            <a href='https://www.mbta.com/schedules/Orange/schedule'>
              <img alt='' src={logo} style={{ height: '30px', width: '30px', marginLeft: '20px' }}/>
            </a>
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: '-5px', marginBottom: '45px' }}>
          {/* Panel 0 */}
          <Search style={this.showPanel(0)}
            select={this.state.select}
            onSelect={this.selectHandler}/>

          {/* Panel 1 */}
          <ScheduleList
            style={this.showPanel(1)}
            schedules={this.state.schedules}
            currentTime={this.state.currentTime}
            onDeleteSchedule={this.deleteSchedule}/>

          {/* Panel 2 */}
          <NearBy style={this.showPanel(2)}/>
        </div>

        <BottomNavigation
          showLabels
          value={this.state.panel}
          onChange={this.panelChange}
          style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'WhiteSmoke' }}
        >
          <BottomNavigationAction label={this.lang('Search')}    icon={<SearchIcon />} />
          <BottomNavigationAction label={this.lang('Favorites')} icon={<StarIcon />} />
          <BottomNavigationAction label={this.lang('Near By')}   icon={<LocationOnIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default App;
