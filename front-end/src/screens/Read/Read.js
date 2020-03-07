import React  from 'react';
import {ReadRoot} from './ReadRoot';
import { Grid, Drawer ,List ,Divider,ListItem ,
  ListItemIcon, ListItemText, ListSubheader, IconButton}  from "@material-ui/core";
import ListAltIcon from '@material-ui/icons/ListAlt';
import ViewListIcon from '@material-ui/icons/ViewList';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import MicOffIcon from '@material-ui/icons/MicOff';
import {Link} from 'react-router-dom';
import "./Read.css";

export default class Read extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      top: false,
    }
  }

  toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    this.setState({ [side]: open });
  };

  sideList = side => (
    <div
      role="presentation"
      onClick={this.toggleDrawer(side, false)}
      style={{minWidth:"218px"}}
    >
      <List
        component="nav"
        subheader={
          <ListSubheader>
            DANH SÁCH BẢN TIN
          </ListSubheader>
        }>
        <ListItem
          className="readLinkContent"
          button key={"curent"}
          component={Link} to="/VohReport/records/">
          <ListItemIcon> <ListAltIcon /></ListItemIcon>
          <ListItemText primary={'Hiện tại'} />
        </ListItem>
        <ListItem
          className="readLinkContent"
          button key={"read"}
          component={Link} to="/VohReport/records/read" >
          <ListItemIcon> <AssignmentTurnedInIcon /></ListItemIcon>
          <ListItemText primary={"Đã giải quyết"} />
        </ListItem>
        <ListItem
          className="readLinkContent"
          button key={"unread"}
          component={Link} to="/VohReport/records/unread"
          >
          <ListItemIcon> <MicOffIcon /></ListItemIcon>
          <ListItemText primary={"Bỏ qua"} />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  render() {
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        id={"read-grid"}
      >
        <Grid item xs={12} sm={12}>
          <IconButton
            aria-label="delete"
            onClick={this.toggleDrawer('left', true)}
            id={"read-nav-btn"}>
            <ViewListIcon id="read-nav-icon"/>
          </IconButton>

          <Drawer
            open={this.state.left}
            onClose={this.toggleDrawer('left', false)}
          >
            {this.sideList('left')}
          </Drawer>
            {ReadRoot}
        </Grid>
      </Grid>
    )
  }
}