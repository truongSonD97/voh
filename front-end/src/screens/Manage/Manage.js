import React from 'react';
import {Divider, Grid, List, ListItem, ListItemIcon, ListItemText, ListSubheader} from "@material-ui/core";
import Reason from "../../components/Manage/ManageType/Reason";
import Address from "../../components/Manage/ManageType/Address";
import UserTable from "../../components/Manage/ManageType/UserTable";
import SharerTable from "../../components/Manage/ManageType/SharerTable";
import PersonIcon from '@material-ui/icons/Person';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import PinDropIcon from '@material-ui/icons/PinDrop';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';

export default function Manage(){
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleListItemClick = (event, selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  return(
    <div className="sub-contain" style={{width:"100vw"}}>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
      >
        <Grid item xs={12} sm={2} className={"statistic-list-nav"}>
          <div>
            <List
              component="nav"
              subheader={
                <ListSubheader >
                  Thông tin hệ thống
                </ListSubheader>
              }>
              <ListItem
                button
                selected={selectedIndex === 0}
                onClick={event => handleListItemClick(event, 0)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="1. Tài khoản" />
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 1}
                onClick={event => handleListItemClick(event, 1)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <AssignmentLateIcon />
                </ListItemIcon>
                <ListItemText primary="2. Nguyên nhân" />
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 2}
                onClick={event => handleListItemClick(event, 2)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <ContactPhoneIcon />
                </ListItemIcon>
                <ListItemText primary="3. Địa điểm" />
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 3}
                onClick={event => handleListItemClick(event, 3)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <PinDropIcon />
                </ListItemIcon>
                <ListItemText primary="4. Người chia sẻ" />
              </ListItem>
            </List>
            <Divider />
          </div>
        </Grid>
        <Grid item xs={12} sm={10}>
          {[<UserTable/>,
            <Reason/>,
            <Address/>,
            <SharerTable/>,][selectedIndex]
          }
        </Grid>
      </Grid>
    </div>

  )
}