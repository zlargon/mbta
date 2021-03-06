import React from 'react';
import { connect } from 'react-redux';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// My Components
import Search from './Search';
import Favorite from './Favorite';
import SlideMenu from './SlideMenu';
import PreferenceDialog from './PreferenceDialog';
import FavoriteDialog from './FavoriteDialog';
import SearchDialog from './SearchDialog';
import MessageSnackbar from './MessageSnackbar';

// BottomNavigation
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// Progress
import CircularProgress from '@material-ui/core/CircularProgress';

// Icon
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import SettingsIcon from '@material-ui/icons/Settings';
import RefreshIcon from '@material-ui/icons/Refresh';

// MBTA
import prediction from '../mbta/prediction';

// Dictionary
import dictionary from '../dictionary.json';

class App extends React.Component {
  state = {}

  constructor (props) {
    super(props);

    this.updateSchedule();
    setInterval(() => {
      // update data every 10 sec
      this.updateSchedule();
    }, 10000);
  }

  updateSchedule = (event) => {
    const schedules = {...this.props.schedules};

    const requests = [];
    for (const key in schedules) {
      const sch = schedules[key];
      requests.push(prediction(sch.route.id, sch.stop.id, sch.direct_id));
    }

    // loading
    this.props.dispatch({
      type: 'UI_SCHEDULE_REFRESH',
      refreshing: true
    });

    Promise.all(requests)
      .then(departureTimes => {
        let i = 0;
        for (const key in schedules) {
          const sch = schedules[key];
          sch.departureTime = departureTimes[i++];
        }

        this.props.dispatch({
          type: 'SCHEDULE_UPDATE',
          schedules: schedules
        });

        // unloading
        this.props.dispatch({
          type: 'UI_SCHEDULE_REFRESH',
          refreshing: false
        });
      })
      .catch(error => {
        // let Circular Progress keep rolling

        // show error message if click by RefreshIcon
        if (event) {
          this.props.dispatch({
            type: 'UI_SEARCH_DIALOG_SNARCK_BAR',
            open: true,
            message: 'Cannot get data from server. Please check your Internet.',
            variant: 'error'
          });
        }
      });
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

  openPreference = () => {
    this.props.dispatch({
      type: 'UI_PREFRENCE_DIALOG',
      open: true
    });
  }

  showPanel = (panelNumber) => {
    if (panelNumber !== this.props.panel) {
      return { display: 'none' };
    }
  }

  render = () => {
    const toolBarTitle = this.props.panel === 0 ?
      this.lang('Search') : this.props.currentTime.toLocaleTimeString();

    return (
      <div>
        <SlideMenu/>
        <PreferenceDialog/>
        <FavoriteDialog/>
        <SearchDialog />
        <MessageSnackbar />

        <AppBar position="sticky" style={{backgroundColor: '#1f88ff', color: 'white'}}>
          <Toolbar>
            {/* MenuIcon is disable */}
            <IconButton color="inherit" onClick={this.openSlideMenu} style={{ display: 'none' }}>
              <MenuIcon />
            </IconButton>

            {/* Setting Icon */}
            <IconButton color="inherit" onClick={this.openPreference}>
              <SettingsIcon />
            </IconButton>

            {/* Title */}
            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '16px' }}>
              {toolBarTitle}
            </Typography>

            {/* Refresh Icon */}
            <IconButton color="inherit" onClick={this.updateSchedule}>
              { !this.props.refreshing ? <RefreshIcon /> : <CircularProgress style={{marginLeft: '8px', color: 'white'}}/> }
            </IconButton>
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: '-6px', marginBottom: '45px' }}>
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
    schedules: state.schedules,
    lang: state.lang,
    panel: state.ui.panel,
    refreshing: state.ui.schedule_is_refreshing
  }
})(App);
