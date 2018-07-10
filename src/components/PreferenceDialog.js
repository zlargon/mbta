import React from 'react';
import { connect } from 'react-redux';

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PreferenceDialog extends React.Component {
  state = {}

  maxNumberChange = (event) => {
    this.props.dispatch({
      type: 'MAX_SCHEDULE_NUM',
      number: event.target.value
    })
  }

  close = () => {
    this.props.dispatch({
      type: 'UI_PREFRENCE_DIALOG',
      open: false
    });
  }

  getOptions = () => {
    const options = [1, 2, 3, 4, 5, 10];
    const list = options.map(v => <option key={v} value={v}>{v}</option>)
    list.push(<option key={99} value={99}>All</option>);
    return list;
  }

  render = () => {
    return (
      <Dialog
        open={this.props.dialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.close}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-title" style={{textAlign: 'center'}}>
          Preference
        </DialogTitle>

        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel>Max number of schedules</FormLabel>
            <TextField
              margin="normal"
              value={this.props.maxNumber}
              onChange={this.maxNumberChange}
              select
              SelectProps={{
                native: true,
                style: {
                  textAlignLast: 'center',
                  // paddingLeft: 'calc(50% - 1em)'
                }
              }}
            >
              {this.getOptions()}
            </TextField>
          </FormControl>
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect((state) => {
  return {
    dialog: state.ui.preference_dialog,
    maxNumber: state.preference.max_schedule_number
  }
})(PreferenceDialog);
