import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

// Snackbar
import Snackbar from '@material-ui/core/Snackbar';

// Icon Button
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  message: { width: '280px' },
  action:  { paddingLeft: '0px' },
  success: { backgroundColor: '#5C9D51' },
  info:    { backgroundColor: '#3476CC' },
  warning: { backgroundColor: '#F3A33A' },
  error:   { backgroundColor: '#C33E38' }
}

class MessageSnackbar extends React.Component {
  state = {}

  close = () => {
    this.props.dispatch({
      type: 'UI_SEARCH_DIALOG_SNARCK_BAR',
      open: false
    });
  }

  render = () => {
    return (
      <Snackbar
        open={this.props.open}
        message={this.props.message}
        onClose={this.close}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        ContentProps={{
          classes: {
            root: this.props.classes[this.props.variant],
            message: this.props.classes.message,
            action: this.props.classes.action
          }
        }}
        action={
          <IconButton color="inherit" onClick={this.close}>
            <CloseIcon />
          </IconButton>
        }
      />
    );
  }
}

export default connect((state) => {
  return {
    open: state.ui.snackbar.open,
    message: state.ui.snackbar.message,
    variant: state.ui.snackbar.variant
  }
})(withStyles(styles)(MessageSnackbar));
