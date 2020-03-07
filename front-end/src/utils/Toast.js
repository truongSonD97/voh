import React from 'react';

import {
  MdImportantDevices,
} from 'react-icons/md';
import 'react-table/react-table.css';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from './containStyle';

class Notification extends React.Component {

  showMessage(message, level = 'info') {
    if (!this.notificationSystem) {
      return;
    }

    this.notificationSystem.addNotification({
      title: <MdImportantDevices />,
      message,
      level,
    });
  }

  render() {
    // let dismiss = this.props.dismiss ? this.props.dismiss : 1;
    return (
      <NotificationSystem
        // autoDismiss={1}
        dismissible={false}
        ref={notificationSystem =>
          (this.notificationSystem = notificationSystem)
        }
        style={NOTIFICATION_SYSTEM_STYLE}
      />
    );
  }
};

export default Notification;
