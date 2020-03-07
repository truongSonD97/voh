import React from 'react';
import ReactTooltip from "react-tooltip";
import ReactTable from 'react-table';
import {
  DialogActions, DialogContent, DialogTitle, Dialog,
  Tooltip, IconButton, Button, ButtonGroup, Grid, Checkbox
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

import FormInput from './FormInput';
import api from '../../utils/api'
import Toast from '../../utils/Toast';
import firebase from '../../utils/firebase';
import Messages from "../Common/messages/Messages";
import { showTooltipInfo } from "../Common/modal/action/showTooltipInfo";
import ConfirmModel from "../Common/modal/ConfirmModal/ConfirmModel";
import TablePagination from "../Common/TablePagination/TablePagination";
import EnhancedTableToolbar from "../Read/ReadTable/Title/EnhancedTableToolbar";
import "./Insert.css";



export default class Insert extends React.Component {
  columns = [
    {
      Header: () => {
        let numSelected = this.state.selectList.length;
        let rowCount = this.state.recordsPending.length;
        return (<Checkbox
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={numSelected === rowCount}
          onChange={this.handleSelectAllClick}
          color="primary"
          size="small"
        />)
      },
      accessor: 'id',
      Cell: (props) =>
        <Checkbox
          checked={this.isSelected(props.value)}
          color="primary"
          size="small"
        />,
      className: "insert-box-content",
      maxWidth: 50,
    },
    {
      Header: () => <strong>TÙY CHỌN</strong>,
      accessor: 'id',
      className: "insert-box-content insert-box-action",
      maxWidth: 125,
      minWidth: 125,
      Cell: (props) => {
        let id = props.value;
        return (
          <div>
            <ReactTooltip place="left" id={id} effect='solid' className="tooltipInfoRecord">
              {showTooltipInfo(props.original)}
            </ReactTooltip>

            <ButtonGroup size="small" aria-label="small outlined button group">
              <Tooltip title=" Chỉnh sửa">
                <IconButton
                  aria-label="modify" size="small" color="primary"
                  onClick={() => {
                    let idList = {
                      personSharing: props.original.personSharing,
                      addresses: props.original.address,
                      reasons: props.original.reason,
                      speeds: props.original.speed,
                    };

                    let inputForForm = {
                      personSharing: props.original.personSharing.name,
                      phoneNumber: props.original.personSharing.phoneNumber,
                      addresses: props.original.address.name,
                      direction: props.original.address.direction,
                      reasons: props.original.reason.name,
                      speeds: props.original.speed,
                      notice: props.original.notice,
                      district: []
                    };

                    let recordId = props.original.id;
                    this.setState({
                      showModifyDialog: true,
                      showIndex: props.index,
                      currentInfoForm: inputForForm,
                      idList,
                      recordId
                    });
                  }}>
                  <CreateIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa tin">
                <IconButton
                  aria-label="delete" size="small" color="secondary"
                  onClick={() => this.setState({ showDeleteDialog: true, targetId: id })}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xác nhận tin">
                <IconButton
                  aria-label="check" size="small" style={{ color: "#4caf50" }}
                  onClick={() => this.setState({ showConfirmDialog: true, targetId: id })}>
                  <CheckBoxIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </div>
        )
      }
    },
    {
      Header: () => (<strong>NGƯỜI CHIA SẺ</strong>),
      Cell: (props) => {
        let record = props.original;
        let sharer = record.personSharing ? record.personSharing.name : '';
        let phone = record.personSharing ? record.personSharing.phoneNumber : '';
        return (<span data-tip data-for={record.id}>{sharer} - {phone}</span>)
      },
      className: "insert-box-content"
    },
    {
      Header: () => <strong>ĐỊA ĐIỂM</strong>,
      accessor: 'address',
      Cell: (props) => {
        let address = props.value ? (props.value.name + (props.value.direction ? (' HƯỚNG ' + props.value.direction) : '')) : '';
        return (<span data-tip data-for={props.original.id}>{address}</span>)
      },
      minWidth: 150,
      className: "insert-box-content"
    },
    {
      Header: () => <strong>VẬN TỐC</strong>,
      accessor: 'speed',
      Cell: (props) => {
        let speed = props.value ? props.value.name : '';
        return (<span data-tip data-for={props.original.id}>{speed}</span>)
      },
      className: "insert-box-content"
    },
    {
      Header: () => <strong>NGUYÊN NHÂN</strong>,
      accessor: 'reason',
      Cell: (props) => {
        let reason = props.value ? props.value.name : '';
        return (<span data-tip data-for={props.original.id}>{reason}</span>)
      },
      className: "insert-box-content"
    },
    {
      Header: () => <strong>GHI CHÚ</strong>,
      accessor: 'notice',
      Cell: (props) => {
        let notice = props.value ? props.value : '';
        return (<span data-tip data-for={props.original.id}>{notice}</span>)
      },
      className: "insert-box-content"
    }
  ];

  constructor(props) {
    super(props);
    let user = props.user;
    this.defaultCheckStatus = (user.role === "ROLE_DATAENTRY_EDITOR" || user.role === "ROLE_ADMIN") ? "accepted" : "correct";
    this.dataVohRealTime = firebase.database();
    this.triggerStatusRp = true;
    this.state = {
      reasons: [],
      addresses: [],
      speeds: [],
      personSharing: [],
      recordsPending: [],
      showIndex: 0,
      user,
      currentInfoForm: '',
      showModifyDialog: false,
      showConfirmDialog: false,
      showDeleteDialog: false,
      targetId: '',
      selectList: []
    };
    this.listenRecordFromSecretary();
  }

  listenRecordFromSecretary = () => {
    this.dataVohRealTime.ref().child("triggerDataEntryRecord").on("value", () => {
      api.getRecords(0, 100, 'pending').then(response => {
        if (response.success) this.setState({ recordsPending: response.data.content });
        else if (this.toast) this.toast.showMessage('kết nối bị lỗi,vui lòng thử lại sau');
      })
    });

  };

  getTriggerPost = (trigger) => {
    this.dataVohRealTime.ref().child(trigger).once("value", (snapshot) => {
      this.triggerStatusRp = snapshot.val().triggerPost;
    })
  };

  changeTriggerRecord = (trigger) => {
    this.getTriggerPost(trigger);
    this.dataVohRealTime.ref().child(trigger).update({
      triggerPost: !this.triggerStatusRp
    })
  };

  onChangeStatusRecords(userId, recordId, status) {
    api.updateStatusRecordsV2(userId, recordId, status).then(response => {
      if (response.success) {
        let roleUser = this.state.user.role;
        let trigger = (roleUser === "ROLE_DATAENTRY_EDITOR" || roleUser === "ROLE_ADMIN") ? "triggerMcRecord" : "triggerEditorRecord";
        this.changeTriggerRecord(trigger);
        this.changeTriggerRecord("triggerDataEntryRecord");
      }
      else {
        this.toast.showMessage('Cập nhật trạng thái thất bại,vui lòng thử lại sau');
      }
    })
  }

  onDeleteRecord(userId, recordId, content) {
    api.updateStatusRecordsV2(userId, recordId, 'removed', content).then(response => {
      if (response.success) {
        this.changeTriggerRecord("triggerDataEntryRecord");
      }
      else {
        this.toast.showMessage('Xóa thất bại');
      }
    })
  }

  confirmUpdateRecord = (event) => {
    this.child.confirmUpdateRecord(event);
    this.handleClose();
  };

  handleSwapDeleteDialog = () => {
    this.setState({ showDeleteDialog: !this.state.showDeleteDialog });
  };

  handleSwapConfirmDialog = () => {
    this.setState({ showConfirmDialog: !this.state.showConfirmDialog });
  };

  handleClickOpen = () => {
    this.setState({ showModifyDialog: true });
  };

  handleClose = () => {
    this.setState({ showModifyDialog: false });
  };

  isSelected = id => this.state.selectList.indexOf(id) !== -1;

  handleChange = (event, id) => {

    let selected = this.state.selectList;
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
    this.setState({ selectList: newSelected });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      let newSelected = this.state.recordsPending.map(n => n.id);
      this.setState({ selectList: newSelected });
      return;
    }
    this.setState({ selectList: [] });
  };

  clearSelectList = () => this.setState({ selectList: [] });

  handleSwitchStatus = (userId, recordId, status, content = null) => {
    if (status === 'delete') {
      this.onDeleteRecord(userId, recordId, content)
    } else {
      this.onChangeStatusRecords(userId, recordId, status)
    }
  };

  render() {

    const statusList = [
      { ic: <DeleteIcon />, status: "delete", title: "xóa", color: "secondary" },
      { ic: <CheckBoxIcon />, status: this.defaultCheckStatus, title: "xác nhận", color: "primary" },
    ];

    return (

      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
      >
        <Grid item xs={12} sm={4} className='left-sub-contain'>
          <FormInput />
        </Grid>
        <Grid item xs={12} sm={8} className='right-sub-contain'>
          <div className="sub-contain">
            <h5 id="title-content" >BẢN TIN THƯ KÝ</h5>

            <EnhancedTableToolbar
              clearSelectList={this.clearSelectList}
              statusList={statusList}
              handleSwitchStatus={this.handleSwitchStatus}
              selectList={this.state.selectList}
              userId={this.state.user.id} />

            <ReactTable
              className="-striped -highlight"
              data={this.state.recordsPending}
              pageSize={20}
              columns={this.columns}
              PaginationComponent={TablePagination}
              // showPagination={false}
              resizable={false}
              sortable={false}
              getTrProps={(state, rowInfo) => ({
                onClick: (event) => {
                  this.handleChange(event, rowInfo.original.id);
                }
              })}
              style={{
                height: "94vh"
              }}
            />
          </div>
        </Grid>
        <div>
          <ConfirmModel
            label={"xóa"}
            swapFunc={this.handleSwapDeleteDialog}
            showDialog={this.state.showDeleteDialog}
            deleteConfirm={true}
            confirmFunction={(removeReason) => {
              this.clearSelectList();
              this.handleSwapDeleteDialog();
              this.onDeleteRecord(this.state.user.id, this.state.targetId, removeReason);
            }}
          />
          <ConfirmModel
            label={"xác nhận"}
            swapFunc={this.handleSwapConfirmDialog}
            showDialog={this.state.showConfirmDialog}
            confirmFunction={() => {
              this.clearSelectList();
              this.handleSwapConfirmDialog();
              this.onChangeStatusRecords(this.state.user.id, this.state.targetId, this.defaultCheckStatus);
            }}
          />

          <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={this.state.showModifyDialog}
            onClose={this.handleClose}
            aria-labelledby="max-width-dialog-title"
            className={"dialogPaper"}
            id={"dialog"}
          >
            <DialogTitle id="max-width-dialog-title">CẬP NHẬT THÔNG TIN</DialogTitle>
            <DialogContent className={"dialogPaper"} id={"dialogContent"} >
              <FormInput
                input={this.state.currentInfoForm}
                isModify={true}
                idList={this.state.idList}
                recordId={this.state.recordId}
                close={this.close}
                updateRecord={() => this.changeTriggerRecord("triggerDataEntryRecord")}
                showIndex={this.state.showIndex}
                onRef={ref => (this.child = ref)}
              />
            </DialogContent>
            <DialogActions>
              {this.state.modify ? "" :
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={(event) => this.confirmUpdateRecord(event)}
                >
                  CẬP NHẬT
                </Button>}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CloseIcon />}
                onClick={this.handleClose}
              >
                HỦY
              </Button>
            </DialogActions>
          </Dialog>
          <Messages user={this.state.user} />
          <Toast ref={(ref) => this.toast = ref} />
        </div>
      </Grid>


    )
  }
}