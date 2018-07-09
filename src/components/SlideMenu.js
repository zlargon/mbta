import React from 'react';
import { connect } from 'react-redux';

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

const menuStyle = {
  root: {
    width: '240px'
  },
  logo: {
    width: '120px',
    height: 'auto',
    padding: '0 15px 10px'
  },
  content: {
    margin: '0 20px 20px'
  }
}

class SlideMenu extends React.Component {

  state = {}

  lang = (sentence) => {
    try {
      const translate = dictionary[sentence][this.props.lang];
      return typeof translate === 'undefined' ? sentence : translate;
    } catch (e) {
      return sentence;
    }
  }

  languageChanged = (event) => {
    this.props.dispatch({
      type: 'LANG_CHANGE',
      lang: event.target.value
    });
  }

  close = () => {
    this.props.dispatch({
      type: 'UI_MENU_TOGGLE',
      menu: false
    });
  }

  collapseHandler = (index) => () => {
    this.props.dispatch({
      type: 'UI_MENU_COLLAPSE',
      index: index
    });
  }

  openEmail = (email) => () => {
    window.location.href = 'mailto:' + email;
  }

  render = () => {
    return (
      <Drawer open={this.props.menu} onClose={this.close} >
        <List style={menuStyle.root}>
          <ListItem dense disableGutters >
            <img alt='' src={logo} style={menuStyle.logo}/>
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
            <p style={menuStyle.content}>
              {this.lang('Ever arrived at the station right as the train pulled away? You could have walked faster but now you’re stuck waiting.')}
            </p>
            <p style={menuStyle.content}>
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
    );
  }
}

export default connect((state) => {
  return {
    lang: state.lang,
    menu: state.ui.menu,
    collapse: state.ui.menu_collapse
  }
})(SlideMenu);

