import React from 'react';
import Routes from './mbta/route.json';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import logo from './logo.png';

class Search extends React.Component {

  state = {
    open: []
  }

  collapseHandler = (index) => (event, target) => {
    const open = Object.assign([], this.state.open);
    open[index] = !open[index];

    this.setState({
      open: open
    });
  }

  render () {
    const { style } = this.props;

    const list = [];
    for (let route of Routes) {

      // Route list
      list.push(
        <ListItem button key={route.id + '-route'}
          style={{ backgroundColor: '#' + route.color, opacity: 0.9 }}
          onClick={this.collapseHandler(route.id)}>

          <ListItemIcon>
            <img alt='' src={logo} style={{ height: '30px', width: '30px' }}/>
          </ListItemIcon>
          <ListItemText inset
            primary={
              <Typography variant="subheading" style={{ color: '#' + route.text_color }}>
                {route.name}
              </Typography>
            }
            secondary={
              <Typography style={{ color: '#' + route.text_color }}>
                {`${route.direction[0]} / ${route.direction[1]}`}
              </Typography>
            }/>
          {this.state.open[route.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
      );

      let stops = [];
      for (let stop of route.stops) {
        stops.push(
          <ListItem key={stop.id}>

            <ListItemText inset primary={stop.name} />

            <ListItemSecondaryAction>
              <Checkbox
                color="primary"
                onChange={this.props.onSelect(route, stop, 0)}
                checked={this.props.select[stop.id + '_0']}
              />

              <Checkbox
                color="primary"
                onChange={this.props.onSelect(route, stop, 1)}
                checked={this.props.select[stop.id + '_1']}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      }

      // Collapse with stop list
      list.push(
        <Collapse key={route.id + '-collapse'} in={this.state.open[route.id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            { stops }
          </List>
        </Collapse>
      );
    }

    return (
      <List component="nav" style={style}>
        { list }
      </List>
    );
  }
}

export default Search;
