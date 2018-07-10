import React from 'react';
import { connect } from 'react-redux';

// AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

// Icon
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

// Utils
import generateScheduleListItems from './utils/generateScheduleListItems';

// MBTA
import logo from '../mbta/logo.png';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SearchDialog extends React.Component {
  state = {}

  close = () => {
    this.props.dispatch({
      type: 'UI_SEARCH_DIALOG',
      open: false
    });
  }

  getHeader = (schedule) => {
    const { route, stop, direct_id, destination } = schedule;

    return (
      <ListItem>
        <ListItemText
          primary={`${stop.name} → ${destination.name}`}
          secondary={route.direction[direct_id]}
          secondaryTypographyProps={{
            style: {
              fontWeight: 'bold'
            }
          }}
        />
      </ListItem>
    );
  }

  render = () => {
    const inbound = this.props.search.inbound;
    const outbound = this.props.search.outbound;

    return (
      <Dialog
        open={this.props.dialog}
        TransitionComponent={Transition}
        keepMounted
        fullScreen
        onClose={this.close}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <AppBar position="sticky" style={{backgroundColor: inbound.route.color, color: inbound.route.text_color}}>
          <Toolbar>
            <ListItemIcon>
              <img alt='' src={logo} style={{ height: '30px', width: '30px' }}/>
            </ListItemIcon>

            <Typography type="title" color="inherit" style={{ margin: 'auto', fontSize: '16px' }}>
              { this.props.currentTime.toLocaleTimeString() }
            </Typography>

            <IconButton color="inherit">
              <ClearIcon onClick={this.close}/>
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <List>
            { this.getHeader(inbound) }
            { generateScheduleListItems(inbound, 'inbound', this.props.currentTime) }

            <Divider/>

            { this.getHeader(outbound) }
            { generateScheduleListItems(outbound, 'outbound', this.props.currentTime) }
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect((state) => {
  return {
    currentTime: state.currentTime,
    dialog: state.ui.search_dialog,
    search: state.searchSchedule
  }
})(SearchDialog);
