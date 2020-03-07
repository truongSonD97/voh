import React from 'react';
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  ListItemText,
  ListSubheader,
  Container,
} from "@material-ui/core";
import "./Statistic.css";
import ReasonStatistic from "../../components/Statistic/StatisticType/ReasonStatistic";
import DateStatistic from "../../components/Statistic/StatisticType/DateStatistic";
import DetailStatistic from "../../components/Statistic/StatisticType/DetailStatistic";
import StatusTraffic from "../../components/Statistic/Developer/StatusTraffic";
import TopUTraffic from "../../components/Statistic/Developer/StatisticTopUTraffic";
import StatisticByDateInPosition from "../../components/Statistic/Developer/StatisticByDateInPosition";
import Statistic2DatePosition from "../../components/Statistic/Developer/Statistic2DatePosition";
import StatisticReasonByDatePosition from "../../components/Statistic/Developer/StatistciResonByDatePostion";
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import TimelineIcon from '@material-ui/icons/Timeline';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
registerLocale('es', es);


export default function Statistic(){
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleListItemClick = (event, selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  return(
    <div className="sub-contain">
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
                  Tổng quát theo
                </ListSubheader>
              }>
              <ListItem
                button
                selected={selectedIndex === 0}
                onClick={event => handleListItemClick(event, 0)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <DonutSmallIcon/>
                </ListItemIcon>
                <ListItemText primary="Nguyên nhân" />
              </ListItem>

              <ListItem
                button
                selected={selectedIndex === 1}
                onClick={event => handleListItemClick(event, 1)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <TimelineIcon/>
                </ListItemIcon>
                <ListItemText primary="Thời gian" />
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 2}
                onClick={event => handleListItemClick(event, 2)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <FormatListNumberedIcon/>
                </ListItemIcon>
                <ListItemText primary="Chi tiết" />
              </ListItem>
            </List>
            <Divider />
            <List
              component="nav"
              subheader={
                <ListSubheader >
                  Chi tiết theo nguyên nhân
                </ListSubheader>
              }>
              <ListItem
                button
                selected={selectedIndex === 4}
                onClick={event => handleListItemClick(event, 4)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <FormatListNumberedIcon/>
                </ListItemIcon>
                <ListItemText primary="Top Vị trí ùn tắc" />
              </ListItem>
            </List>
            <Divider />
            <List
              component="nav"
              aria-label="secondary mailbox folder"
              subheader={
                <ListSubheader>
                  Chi tiết theo địa điểm
                </ListSubheader>
              }>
              <ListItem
                button
                selected={selectedIndex === 3}
                onClick={event => handleListItemClick(event, 3)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <DonutSmallIcon/>
                </ListItemIcon>
                <ListItemText primary="Tình trạng & Vị trí" />
              </ListItem>

              <ListItem
                button
                selected={selectedIndex === 7}
                onClick={event => handleListItemClick(event, 7)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <DonutSmallIcon/>
                </ListItemIcon>
                <ListItemText primary="Nguyên nhân & Vị trí" />
              </ListItem>

              <ListItem
                button
                selected={selectedIndex === 5}
                onClick={event => handleListItemClick(event, 5)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <TimelineIcon/>
                </ListItemIcon>
                <ListItemText primary="Thời gian & Vị trí" />
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 6}
                onClick={event => handleListItemClick(event, 6)}
              >
                <ListItemIcon className={"statistic-icon"}>
                  <TimelineIcon/>
                </ListItemIcon>
                <ListItemText primary="Thời gian giữa 2 tháng & Vị trí" />
              </ListItem>

            </List>

          </div>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Container maxWidth='xl'>
            {[<ReasonStatistic/>,
              <DateStatistic/>,
              <DetailStatistic/>,
              <StatusTraffic/>,
              <TopUTraffic/> ,
              <StatisticByDateInPosition/>,
              <Statistic2DatePosition/>,
              <StatisticReasonByDatePosition/> ][selectedIndex]
            }
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}