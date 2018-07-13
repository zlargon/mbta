import React from 'react';
import { connect } from 'react-redux';

// Snackbar
import Snackbar from '@material-ui/core/Snackbar';

// Icon Button
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class MessageSnackbar extends React.Component {
  state = {}

  close = () => {
    this.props.dispatch({
      type: 'UI_SEARCH_DIALOG_SNARCK_BAR',
      open: false,
      message: ''
    });
  }

  render = () => {
    return (
      <Snackbar
        open={this.props.snackbar.open}
        message={this.props.snackbar.message}
        onClose={this.close}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        action={
          <IconButton aria-label="Close" color="inherit" onClick={this.close}>
            <CloseIcon />
          </IconButton>
        }
      />
    );
  }
}

export default connect((state) => {
  return {
    snackbar: state.ui.snackbar
  }
})(MessageSnackbar);

