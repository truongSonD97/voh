import React from 'react';
import FormInput from '../Insert/FormInput';
import api from '../../utils/api'
import Toast from '../../utils/Toast';
import ReactTable from 'react-table';
import firebase from '../../utils/firebase.js';
import Messages from '../Common/messages/Messages';
import ReactTooltip from "react-tooltip";
import {showTooltipInfo ,subTimeString} from "../Common/modal/action/showTooltipInfo";
import {
  IconButton, Tooltip, DialogActions, DialogContent,
  DialogTitle, Dialog, ButtonGroup, Button, Grid, Checkbox,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmModel from "../Common/modal/ConfirmModal/ConfirmModel";
import './Editor.css';
import EnhancedTableToolbar from "../Read/ReadTable/Title/EnhancedTableToolbar";
import PagingGrid from "../Common/_TablePagination/PagingGrid";

export default class ConfirmRecords extends React.Component{
  columns = [
    {
      Header: () => {
        let numSelected = this.state.selectList.length;
        let rowCount = this.state.recordsCorrect.length;
        return(<Checkbox
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
      className:"insert-box-content",
      maxWidth: 50,
    },
    {
      Header: () => <strong>TÙY CHỌN</strong>,
      accessor: 'id',
      className:"insert-box-content insert-box-action",
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
                      personSharing: props.original.personSharing.name ,
                      phoneNumber: props.original.personSharing.phoneNumber,
                      addresses: props.original.address.name,
                      direction: props.original.address.direction,
                      reasons: props.original.reason.name,
                      speeds: props.original.speed,
                      notice: props.original.notice,
                      district: []
                    };

                    let recordId = props.original.id ;
                    this.setState({
                      showModal: true,
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
                  onClick={() =>this.setState({showDeleteDialog:true, targetId:id})}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xác nhận tin">
                <IconButton
                  aria-label="check" size="small" style={{color:"#4caf50"}}
                  onClick={() =>this.setState({showConfirmDialog:true, targetId:id})}>
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
        return (<span data-tip data-for={props.original.id}> {sharer} - {phone}</span>)
      },
      className:"insert-box-content"
    },
    {
      Header: () => <strong>ĐỊA ĐIỂM</strong>,
      accessor: 'address',
      Cell: (props) => {
        let address = props.value ? (props.value.name  + (props.value.direction ? ' HƯỚNG ' : '') +
          (props.value.direction ? props.value.direction : '')):'';
        return (<span data-tip data-for={props.original.id}>{address}</span>)
      },
      minWidth: 300,
      className:"insert-box-content"
    },
    {
      Header: () => <strong>VẬN TỐC</strong>,
      accessor: 'speed',
      Cell: (props) => {
        let speed = props.value ? props.value.name : '';
        return (<span data-tip data-for={props.original.id}>{speed}</span>)
      },
      className:"insert-box-content"
    },
    {
      Header: () => <strong>NGUYÊN NHÂN</strong>,
      accessor: 'reason',
      Cell: (props) => {
        let reason = props.value ? props.value.name : '';
        return (<span data-tip data-for={props.original.id}>{reason}</span>)
      },
      className:"insert-box-content"
    },
    {
      Header: () => <strong>GHI CHÚ</strong>,
      accessor: 'notice',
      Cell: (props) => {
        let notice = props.value ? props.value : '';
        return (<span data-tip data-for={props.original.id}>{notice}</span>)
      },
      className:"insert-box-content"
    },
    {
      Header: () => <strong>THỜI GIAN</strong>,
      accessor: 'createdOn',
      Cell: (props) => {
        let createdOn = props.value ? props.value : '';
        return (<span data-tip data-for={props.original.id}>{subTimeString(createdOn)}</span>)
      },
      className:"insert-box-content"
    }
  ];

  constructor(props) {
    super(props);
    let user = props.user;
    this.dataVohRealTime = firebase.database();
    this.triggerEditor = true;
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = {
      recordsCorrect: [],
      showIndex:0,
      user,
      showModal: false,
      currentInfoForm: '',
      idList:'',
      modify: false,
      recordId:'',
      showConfirmDialog:false,
      showDeleteDialog:false,
      targetId:'',
      size: 10,
      activePage:1,
      totalElements:1,
      selectList:[]
    };
    this.listenFirebase();
  }

  listenFirebase = () =>{
    this.dataVohRealTime.ref().child("triggerEditorRecord").on("value" ,(snapShot)=>{
      this.handleGetRecord();
    })
  };

  getTriggerEditorPost = () => {
    this.dataVohRealTime.ref().child('triggerEditorRecord').once("value",(snapShot) =>{
      this.triggerEditor = snapShot.val().triggerPost;
      
    })
  };

  changeEditorPost = () => {
    this.getTriggerEditorPost();
    this.dataVohRealTime.ref().child("triggerEditorRecord").update({
      triggerPost: !this.triggerEditor
    });
  };
  
  getTriggerMCPost = () =>{
		this.dataVohRealTime.ref().child("triggerMcRecord").once("value",(snapshot)=>{
			let trigger = snapshot.val().triggerPost;
			this.triggerStatusRp = trigger;
		})
  };

  changeTriggerMcRecord = () => {
    this.getTriggerMCPost();
    this.dataVohRealTime.ref().child("triggerMcRecord").update({
      triggerPost: !this.triggerStatusRp
    })
  };

  handleGetRecord = () =>{ 
    api.getRecords(0,this.state.size,'correct')
    .then((response)=>{
      if(response.success){
        this.setState({
          recordsCorrect:response.data.content,
          activePage: response.data.number + 1,
          totalElements: response.data.totalElements
        })
      }
      else {
        if(this.toast){ this.toast.showMessage("Tải dữ liệu bị lỗi"); }
      }
    })
  };

  componentDidMount() {
    this.handleGetRecord();
  }

  onChangeStatusRecords = (userId, recordId, status) => {
    api.updateStatusRecordsV2(userId, recordId, status).then(response => {
      if (response.success) {
        this.changeTriggerMcRecord();
        this.changeEditorPost();
        // this.toast.showMessage('Tin đã được xác nhận');
        let records = this.state.recordsCorrect;
        for (let i = 0; i < records.length; i++) {
          if (records[i].id.toString() === recordId.toString()) {
            records.splice(i, 1);
            let recordsCorrect = [];
            recordsCorrect = recordsCorrect.concat(records);
            this.setState({ recordsCorrect });
            return;
          }
        }
      }
      else {
        this.toast.showMessage('Cập nhật trạng thái thất bại,vui lòng thử lại sau');
      }
    })
  };

  onDeleteRecord(userId, recordId, content) {
    api.updateStatusRecordsV2(userId, recordId, 'removed', content).then(response => {
      if (response.success) {
        let records = this.state.recordsCorrect;
        for (let i = 0; i < records.length; i++) {
          if (records[i].id.toString() === recordId.toString()) {
            records.splice(i, 1);
            let recordsCorrect = [];
            recordsCorrect = recordsCorrect.concat(records);
            this.setState({ recordsCorrect });
            return;
          }
        }
      }
      else {
        this.toast.showMessage('Xóa thất bại');
      }
    })
  }

  handleSwapDeleteDialog = () => {
    this.setState({showDeleteDialog: !this.state.showDeleteDialog});
  };

  handleSwapConfirmDialog = () => {
    this.setState({showConfirmDialog: !this.state.showConfirmDialog});
  };

  close() {
    this.setState({
      showModal: false,
      modify:false
    });
  }

  open() {
    this.setState({ showModal: true });
  }

  updateRecord = (index,newValue) => {
    this.changeEditorPost();
  };

  confirmUpdateRecord = (event) => {
    this.child.confirmUpdateRecord(event) ;
  };

  handleChangeSize = event => {
    let newSize = event.target.value ;
    this.setState({size: newSize});
    this.handlePageChange(1,newSize);
  };

  handlePageChange(pageNumber ,defaultAmountPage = this.state.size) {
    api.getRecords(pageNumber - 1, defaultAmountPage, 'correct').then(response => {
      if (response.success) {
        let rc = response.data.content;
        this.setState({
          recordsCorrect: [...rc],
          activePage: pageNumber
        });
      }
    });
  }

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
      let newSelected = this.state.recordsCorrect.map(n => n.id);
      this.setState({selectList:newSelected});
      return;
    }
    this.setState({selectList:[]});
  };
  
  handleSwitchStatus = (userId, recordId, status) => {
    if(status === 'delete'){
      this.onDeleteRecord(recordId)
    }else if(status === 'accepted'){
      this.onChangeStatusRecords(userId, recordId,'accepted')
    }
  };

  clearSelectList = ()=>this.setState({selectList:[]}) ;

  render() {
    let {recordsCorrect} = this.state;
    const statusList = [
      {ic: <DeleteIcon/>, status:"delete", title:"xóa", color:"secondary"},
      {ic: <CheckBoxIcon/>, status: "accepted", title:"xác nhận", color:"primary"},
    ];
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        className="editor-container"
      >
        <Grid item xs={12} sm={12}>
          <div className="sub-contain">
            <h4 id="title-content" >BẢN TIN BIÊN TẬP VIÊN</h4>
            <EnhancedTableToolbar
              clearSelectList={this.clearSelectList}
              statusList={statusList}
              handleSwitchStatus={this.handleSwitchStatus}
              selectList={this.state.selectList}
              userId={this.state.user.id}/>
            <ReactTable
              className="-striped -highlight"
              data={recordsCorrect}
              pageSize={this.state.size}
              columns={this.columns}
              showPagination={false}
              resizable={false}
              sortable={false}
              style={{
                height: "80vh"
              }}
              getTrProps={(state, rowInfo) => ({
                onClick: (event) => {
                  this.handleChange(event, rowInfo.original.id);
                }
              })}
            />

            <PagingGrid
              defaultAmountPage={this.state.size}
              activePage={this.state.activePage}
              totalElements={this.state.totalElements}
              handlePageChange={this.handlePageChange}
              handleChangeState={this.handleChangeSize}
            />
          </div>
        </Grid>

        <div className='col-md-2 d-flex justify-content-center align-content-end'>
          <Messages user={this.state.user}/>
        </div>

        <div>
          <ConfirmModel
            label={"xóa"}
            swapFunc={this.handleSwapDeleteDialog}
            showDialog={this.state.showDeleteDialog}
            confirmFunction={()=>{
              this.clearSelectList();
              this.handleSwapDeleteDialog();
              this.onDeleteRecord(this.state.targetId);

            }}
          />
          <ConfirmModel
            label={"xác nhận"}
            swapFunc={this.handleSwapConfirmDialog}
            showDialog={this.state.showConfirmDialog}
            confirmFunction={()=>{
              this.clearSelectList();
              this.handleSwapConfirmDialog();
              this.onChangeStatusRecords(this.state.user.id, this.state.targetId,'accepted');
            }}
          />
          <Dialog
            fullWidth
            open={this.state.showModal}
            onClose={this.close}
            aria-labelledby="max-width-dialog-title"
            className={"dialogPaper"}
            id={"dialog"}
            maxWidth={"md"}
          >
            <DialogTitle id="max-width-dialog-title">CẬP NHẬT THÔNG TIN</DialogTitle>
            <DialogContent className={"dialogPaper"} id={"dialogContent"} >
              <FormInput
                input={this.state.currentInfoForm}
                isModify={true}
                idList={this.state.idList}
                recordId={this.state.recordId}
                close={this.close}
                updateRecord = {(indexItem,newData)=>{this.updateRecord(indexItem,newData)}}
                showIndex={ this.state.showIndex}
                onRef={ref => (this.child = ref)}
              />
            </DialogContent>
            <DialogActions>
              {this.state.modify ? "" :
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={(event)=>this.confirmUpdateRecord(event)}
                >
                  CẬP NHẬT
                </Button>
              }
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CloseIcon />}
                onClick={this.close}
              >
                HỦY
              </Button>
            </DialogActions>
          </Dialog>
          <Toast ref={(ref) => this.toast = ref} />
        </div>
      </Grid>
    )
  }
}