import React from 'react';
import { connect } from 'react-redux';

// List
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

// Utils
import generateScheduleListItems from './utils/generateScheduleListItems';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SearchDialog extends React.Component {
  state = {}

  render = () => {
    const inbound = this.props.search.inbound;
    const outbound = this.props.search.outbound;

    return (
      <Dialog
        open={this.props.dialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => { this.props.dispatch({ type: 'UI_SEARCH_DIALOG', open: false }); }}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ margin: 'auto' }}>
          { this.props.currentTime.toLocaleTimeString() }
        </DialogTitle>
        <DialogContent>
          <List>
            <ListSubheader>
              {`${inbound.stop.name} → ${inbound.destination.name} (${inbound.route.direction[inbound.direct_id]})`}
            </ListSubheader>
            { generateScheduleListItems(inbound, 'inbound', this.props.currentTime) }

            <Divider/>

            <ListSubheader>
              {`${outbound.stop.name} → ${outbound.destination.name} (${outbound.route.direction[outbound.direct_id]})`}
            </ListSubheader>
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
