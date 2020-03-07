import React from 'react';
import '../../../screens/App/App.css';
import firebase from '../../../utils/firebase';
import "./TableCustom.css"
import { keyToDistrictObject} from '../../Common/constants/districts';
import {IconButton, ButtonGroup, Tooltip, Paper, Checkbox, Table,
        TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import EnhancedTableToolbar from "./Title/EnhancedTableToolbar";
import ConfirmModel from "../../Common/modal/ConfirmModal/ConfirmModel";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

export default class TableCustom extends React.Component {
  constructor(props) {
    super(props);
    let data = this.props.data || [];
    let selectIndex = 0;
    this.defaultStatus = props.status;
    this.triggerPushRecord = firebase.database();
    this.user = props.user;
    this.clearSelectList = this.clearSelectList.bind(this);
    this.state = {
      data,
      selectIndex,
      triggerPost: false,
      selectList:[],
      correct:false,
      unread:false,
      read:false,
      solved:false,
      currentSelectId:''
    }
  }

  subTimeString(time) {
    return time.substring(11, 16) ;
    // + " " + time.substring(8, 10) + "/" + time.substring(5, 7) ;//+ "/" + time.substring(0, 4);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.data !== this.state.data) {
      this.setState({ data: nextProps.data })
    }
  }

  handleSwitchStatus = (userId, recordId, status, content) => {
    if (this.props.onChange) {
      this.props.onChange(userId, recordId, status, content);
    }
  };

  handleUpdatePriority = (id, index) => {
    if (this.props.onChangeUpdatePriorityRecord) {
      this.props.onChangeUpdatePriorityRecord(id, index);
    }
  };

  isSelected = id => this.state.selectList.indexOf(id) !== -1;

  handleChange = (event, id) => {
    let selected = this.state.selectList ;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({selectList:newSelected});
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      let newSelected = this.state.data.map(n => n.id);
      this.setState({selectList:newSelected});
      return;
    }
    this.setState({selectList:[]});
  };

  clearSelectList = () => this.setState({selectList:[]});

  handleClick = (status, content) =>{
    this.clearSelectList();
    this.handleSwitchStatus(this.user.id, this.state.currentSelectId, status, content);
    this.handleSwapDialog(status);
  };

  handleSwapDialog = status => {
    this.setState({[status]: !this.state[status]});
  };

  render() {
    let state = this.state;
    let listData = state.data;
    let dataRender = [];

    listData.forEach((data, index) => {
      let priorityBtn =
        <Tooltip title="Tin chờ phát">
          <IconButton
            aria-label="check" size="small" style={{color:"#ff9100"}}
            onClick={() => {
              this.handleUpdatePriority(data.id, index);
            }}>
            <VerticalAlignTopIcon />
          </IconButton>
        </Tooltip>;

      let buttonRead =
        <Tooltip title="Đọc tin">
          <IconButton
            aria-label="read" size="small" color="primary"
            onClick={() => {
              this.setState({currentSelectId: data.id});
              this.handleSwapDialog("read");
            }}
          >
            <MicIcon />
          </IconButton>
        </Tooltip>;

      let solveButton =
        <Tooltip title="Đã giải quyết">
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              this.setState({currentSelectId: data.id});
              this.handleSwapDialog("solved");
              console.log("solve:",data.id)
            }}
          >
            <DoneOutlineIcon />
          </IconButton>
        </Tooltip>;

      let buttonList = this.defaultStatus === 'accepted' ?
        <ButtonGroup size="small" aria-label="small outlined button group">
          <Tooltip title="Rút tin">
            <IconButton
              aria-label="correct" size="small" color="primary"
              onClick={() => {
                this.setState({currentSelectId: data.id});
                this.handleSwapDialog("correct");
              }}
            >
              <SettingsBackupRestoreIcon />
            </IconButton>
          </Tooltip>
          {data.priority === false ? priorityBtn : ''}
          <Tooltip title="Bỏ qua tin">
            <IconButton
              aria-label="uncheck" size="small" color="secondary"
              onClick={() =>  {
                this.setState({currentSelectId: data.id});
                this.handleSwapDialog("unread");
              } }>
              <MicOffIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Đọc tin">
          <IconButton
            aria-label="read" size="small" color="primary"
            onClick={() => {
              this.setState({currentSelectId: data.id});
              this.handleSwapDialog("read");
            }}
          >
            <MicIcon />
          </IconButton>
        </Tooltip>
        </ButtonGroup> : "";

      dataRender.push([
        <TableRow
          key={index}
          stripedRows={(index%2===0)?'true':'false'}
          priority={(data.priority === true && this.defaultStatus === 'accepted') ? 'true' : 'false'}
          onClick={event => {
            if( this.defaultStatus!== "old"){
              this.handleChange(event, data.id);
            }
          }}
        >
          {this.props.readOnly ? "" :
            <TableCell stripedCells='true' align='center'>
              <Checkbox
                checked={this.isSelected(data.id)}
                color="primary"
                size="small"
              />
            </TableCell>
          }
          <TableCell stripedCells='true' align='center'>{index + 1}</TableCell>
          {this.props.readOnly ? '' :
            <TableCell stripedCells='true'>
              {this.defaultStatus === 'solved'?solveButton:(this.user.role === "ROLE_MC" ? buttonRead : buttonList)}
            </TableCell>
          }
          <TableCell stripedCells='false'>
            {data.personSharing ? data.personSharing.phoneNumber.substr(data.personSharing.phoneNumber.length - 4) : ''} - {
            data.personSharing ? data.personSharing.name : ''}</TableCell>
          <TableCell stripedCells='true'>
            {(data.address ? data.address.name : '')}
            <b>{data.address.direction ? ' HƯỚNG ' : ''}</b>
            {(data.address.direction ? data.address.direction : '')}
          </TableCell>
          <TableCell stripedCells='false'>
            {data.address.district ?
              keyToDistrictObject(data.address.district).map((item,index) =>index===0?item.name:(' - '+item.name))
              : ''
            }
          </TableCell>
          <TableCell stripedCells='true'>{data.reason ? data.reason.name : ''}</TableCell>
          <TableCell stripedCells='false'>{data.speed ? data.speed.name : ''}</TableCell>
          <TableCell stripedCells='true'>{this.subTimeString(data.createdOn)}</TableCell>
          <TableCell stripedCells='false'>{data.notice ? data.notice : ''}</TableCell>
        </TableRow>
      ])
    });

    let rowCount = this.state.data.length;
    let numSelected = this.state.selectList.length;

    const statusList =
      this.defaultStatus === 'solved'? [ {ic: <DoneOutlineIcon/>, status:"solved", title:"giải quyết", color:"primary"} ]:
        (this.user.role === "ROLE_MC" ?
          [
            {ic: <MicIcon/>, status:"read", title:"đọc", color:"primary"},
          ]:
          [
            {ic: <SettingsBackupRestoreIcon/>, status:"correct", title:"rút", color:""},
            {ic: <MicIcon/>, status:"read", title:"đọc", color:"primary"},
            {ic: <MicOffIcon/>, status: "unread", title:"bỏ qua", color:"secondary"},
          ]);
    return (
      <div className="custom-table-content">
        <h5>Tổng số tin {this.defaultStatus === 'solved'?"chưa giải quyết":
          (this.defaultStatus === 'accepted'?"chưa đọc":"")}
          {" : "+this.props.totalElements}
        </h5>

        <Paper className={this.props.page==='statistic'?"records-table statistic-table":"records-table"}>
          <EnhancedTableToolbar
            clearSelectList={this.clearSelectList}
            statusList={statusList}
            handleSwitchStatus={this.handleSwitchStatus}
            selectList={this.state.selectList}
            userId={this.user.id}/>
          <Table size="small" aria-label="a dense table"  stickyHeader>
            <TableHead>
              <TableRow >
                {this.props.readOnly ? "" :
                  <TableCell className="records-cell-table" align='center'>
                    <Checkbox
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={numSelected === rowCount}
                      onChange={this.handleSelectAllClick}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                }
                <TableCell className="records-cell-table" align='center'>STT</TableCell>
                {this.props.readOnly?'':<TableCell className="records-cell-table" align='center'>TÙY CHỌN</TableCell>}
                <TableCell className="records-cell-table" align='center'>NGƯỜI CHIA SẺ</TableCell>
                <TableCell className="records-cell-table" align='center'>ĐỊA ĐIỂM</TableCell>
                <TableCell className="records-cell-table" align='center'>QUẬN</TableCell>
                <TableCell className="records-cell-table" align='center'>NGUYÊN NHÂN</TableCell>
                <TableCell className="records-cell-table" align='center'>VẬN TỐC</TableCell>
                <TableCell className="records-cell-table" align='center'>THỜI GIAN</TableCell>
                <TableCell className="records-cell-table" align='center'>GHI CHÚ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {dataRender}
            </TableBody>
          </Table>
          {
            statusList.map(item=>
              <ConfirmModel
                label={item.title}
                swapFunc={()=>this.handleSwapDialog(item.status)}
                deleteConfirm = {item.status === "delete" || item.status === "unread"}
                showDialog={this.state[item.status]}
                confirmFunction={(content)=>this.handleClick(item.status, content)}
              />)
          }
        </Paper>
      </div>
    )
  }
}
