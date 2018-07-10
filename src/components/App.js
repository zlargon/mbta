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

// BottomNavigation
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

// Icon
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import SettingsIcon from '@material-ui/icons/Settings';

// Dictionary
import dictionary from '../dictionary.json';

class App extends React.Component {
  state = {}

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
      <div style={{ textAlign: 'center' }}>

        <SlideMenu/>
        <PreferenceDialog/>

        <AppBar position="sticky" style={{backgroundColor: '#1f88ff', color: 'white'}}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.openSlideMenu}>
              <MenuIcon />
            </IconButton>

            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '16px' }}>
              {toolBarTitle}
            </Typography>

            <IconButton color="inherit" onClick={this.openPreference}>
              <SettingsIcon />
            </IconButton>
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
