import React from 'react';
import { connect } from 'react-redux';
import co from 'co';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Slide Menu
import SlideMenu from './SlideMenu';

// Panels
import Search from './Search';
import Favorite from './Favorite';

// BottomNavigation
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// Icon
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';

// MBTA
import prediction from '../mbta/prediction';

// Dictionary
import dictionary from '../dictionary.json';

class App extends React.Component {
  constructor(props) {
    super(props);

    // TODO: move to index.js
    this.updateSchedule();
    setInterval(() => {
        // update data every 10 sec
        this.updateSchedule();
    }, 10000);
  }

  lang = (sentence) => {
    try {
      const translate = dictionary[sentence][this.props.lang];
      return typeof translate === 'undefined' ? sentence : translate;
    } catch (e) {
      return sentence;
    }
  }

  panelChange = (event, panelNumber) => {
    this.props.dispatch({
      type: 'UI_PANEL_CHANGE',
      panel: panelNumber
    });
  }

  openSlideMenu = () => {
    this.props.dispatch({
      type: 'UI_MENU_TOGGLE',
      menu: true
    });
  }

  showPanel = (panelNumber) => {
    if (panelNumber !== this.props.panel) {
      return { display: 'none' };
    }
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
  })

  render = () => {
    const toolBarTitle = this.props.panel === 0 ?
      this.lang('Search') : this.props.currentTime.toLocaleTimeString();

    return (
      <div style={{ textAlign: 'center' }}>

        <SlideMenu/>

        <AppBar position="sticky" style={{backgroundColor: '#1f88ff', color: 'white'}}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.openSlideMenu}>
              <MenuIcon />
            </IconButton>

            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '16px' }}>
              {toolBarTitle}
            </Typography>

            <div style={{ height: '30px', width: '30px', marginLeft: '20px' }}></div>
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: '-5px', marginBottom: '45px' }}>
          {/* Panel 0 */}
          <Search style={this.showPanel(0)} />

          {/* Panel 1 */}
          <Favorite style={this.showPanel(1)} />
        </div>

        <BottomNavigation
          showLabels
          value={this.props.panel}
          onChange={this.panelChange}
          style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'WhiteSmoke' }}
        >
          <BottomNavigationAction label={this.lang('Search')}    icon={<SearchIcon />} />
          <BottomNavigationAction label={this.lang('Favorites')} icon={<StarIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    currentTime: state.currentTime,
    lang: state.lang,
    panel: state.ui.panel
  }
})(App);
