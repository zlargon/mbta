import React from 'react';
import { connect } from 'react-redux';
import co from 'co';

// Drawer
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import logo from '../images/logo.png';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// Radio
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Panels
import Search from './Search';
import ScheduleList from './ScheduleList';

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

const UserInfo = {
  'Chun-Lung Huang': 'huang.chunl@husky.neu.edu',
  'Haorui Song': 'song.h@husky.neu.edu',
  'Qili Ou': 'ou.qi@husky.neu.edu',
  'Tianye Shi': 'shi.t@husky.neu.edu',
  'Ting Chou Lin': 'lin.ti@husky.neu.edu',
  'Xuan Yao': 'yao.x@husky.neu.edu',
  'Ye Xu': 'xu.ye1@husky.neu.edu',
}

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

  toggleDrawer = (open) => () => {
    this.props.dispatch({
      type: 'UI_DRAWER_TOGGLE',
      drawer: open
    });
  }

  showPanel = (panelNumber) => {
    if (panelNumber !== this.props.panel) {
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

  collapseHandler = (index) => () => {
    this.props.dispatch({
      type: 'UI_DRAWER_COLLAPSE',
      index: index
    });
  }

  openEmail = (email) => () => {
    window.location.href = 'mailto:' + email;
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

  languageChanged = (event) => {
    const dispatch = this.props.dispatch;
    const lang = event.target.value;

    dispatch({
      type: 'LANG_CHANGE',
      lang: lang
    });
  }

  render () {
    const toolBarTitle = this.props.panel === 0 ?
      this.lang('Search') : this.state.currentTime.toLocaleTimeString();

    return (
      <div style={{ textAlign: 'center' }}>

        <Drawer open={this.props.drawer} onClose={this.toggleDrawer(false)} >
          <List className="drawer">
            <ListItem dense disableGutters >
              <img alt='' src={logo} className="drawer-logo"/>
            </ListItem>
            <Divider/>

            { /* Language */ }
            <ListItem button onClick={this.collapseHandler(0)}>
              <ListItemText primary={this.lang('Language')}/>
              {this.props.collapse[0] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.props.collapse[0]} timeout="auto" unmountOnExit>
              <RadioGroup
                name="language"
                value={this.props.lang}
                style={{ margin: '0 20px 15px' }}
                onChange={this.languageChanged}
              >
                <FormControlLabel
                  value="en"
                  control={<Radio color="primary" />}
                  label={this.lang('English')}
                />

                <FormControlLabel
                  value="zh"
                  control={<Radio color="primary" />}
                  label={this.lang('Traditional Chinese')}
                />

                <FormControlLabel
                  value="cn"
                  control={<Radio color="primary" />}
                  label={this.lang('Simplified Chinese')}
                />
              </RadioGroup>
            </Collapse>
            <Divider/>

            { /* About Us */ }
            <ListItem button onClick={this.collapseHandler(1)}>
              <ListItemText primary={this.lang('About us')}/>
              {this.props.collapse[1] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.props.collapse[1]} timeout="auto" unmountOnExit>
              <p className="drawer-content">
                {this.lang('Ever arrived at the station right as the train pulled away? You could have walked faster but now you’re stuck waiting.')}
              </p>
              <p className="drawer-content">
                {this.lang('NB-MBTA is a real time personal assistant for all your subway needs in Boston.')}
              </p>
            </Collapse>
            <Divider/>

            { /* Contact Us */ }
            <ListItem button onClick={this.collapseHandler(2)}>
              <ListItemText primary={this.lang('Contact us')}/>
              {this.props.collapse[2] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.props.collapse[2]} timeout="auto" unmountOnExit>
              <List>
                {
                  Object.keys(UserInfo).map((name) => {
                    const email = UserInfo[name];
                    return (
                      <ListItem key={name + email} button onClick={this.openEmail(email)}>
                        <ListItemText primary={this.lang(name)} secondary={email} />
                      </ListItem>)
                  })
                }
              </List>
            </Collapse>
          </List>
        </Drawer>

        <AppBar position="sticky" style={{backgroundColor: '#1f88ff', color: 'white'}}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.toggleDrawer(true)}>
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
          <Search style={this.showPanel(0)}
            select={this.state.select}
            onSelect={this.selectHandler}/>

          {/* Panel 1 */}
          <ScheduleList
            style={this.showPanel(1)}
            schedules={this.state.schedules}
            currentTime={this.state.currentTime}
            onDeleteSchedule={this.deleteSchedule}/>
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
    lang: state.lang,
    panel: state.ui.panel,
    drawer: state.ui.drawer,
    collapse: state.ui.drawer_collapse
  }
})(App);
