import React from 'react';
import { connect } from 'react-redux';

// List
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// Utils
import generateScheduleListItems from './utils/generateScheduleListItems';

class ScheduleList extends React.Component {

  render() {
    return (
      <List style={this.props.style}>
        {
          this.props.schedules.map((sch, index) => {
            const id = 'sch-' + index;
            const list = generateScheduleListItems(sch, id, this.props.currentTime);
            list.unshift(
              <ListSubheader key={id} style={{ backgroundColor: '#' + sch.color, color: 'white', opacity: 0.9 }}>
                {sch.title + (sch.isFailed ? ' (Update Failed)' : '')}
                <IconButton>
                  <DeleteIcon onClick={this.props.onDeleteSchedule(sch)} style={{color: 'white'}}/>
                </IconButton>
              </ListSubheader>);
            list.push(<Divider key={id + '-divider'}/>);
            return list;
          })
        }
      </List>
    );
  }
}

export default connect((state) => {
  return {
    currentTime: state.currentTime
  }
})(ScheduleList);
