import React from 'react';
import api from '../../../../utils/api';
import firebase from '../../../../utils/firebase';
import TableCustom from '../TableCustom';
import Toast from '../../../../utils/Toast';
import TableCustomTitle from '../Title/TableCustomTitle';
import PagingGrid from "../../../Common/_TablePagination/PagingGrid";

export default class CurrentRecords extends React.Component {
  constructor(props) {
    super(props);
    this.dataVohRealTime = firebase.database();
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleGetRecord = this.handleGetRecord.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.defaultStartPage = 0;
    this.defaultGetStatus = this.props.status === "solved"? "read" : "accepted";
    this.records = [];
    let trafficState = localStorage.getItem('trafficState');
    let user = null;
    if(trafficState){
      user = JSON.parse(trafficState).user ;
    }
    this.state = {
      records: [],
      activePage: 1,
      totalElements: 1,
      user,
      defaultAmountPage: 10,
    };
    this.listenDatabase()
  }

  listenDatabase = () => {
    let defaultGetStatus = this.defaultGetStatus;
    if(defaultGetStatus==="read"){
      this.dataVohRealTime.ref().child('triggerMcSolveRecord').on("value", () => {
        this.handleGetRecord(this.defaultGetStatus, "asc");
      });
    }else if(defaultGetStatus==="accepted"){
      this.dataVohRealTime.ref().child('triggerMcRecord').on("value", () => {
        this.handleGetRecord(this.defaultGetStatus);
      });
    }
  };

  getTriggerPost = (trigger) => {
		this.dataVohRealTime.ref().child(trigger).once("value",(snapShot) =>{
      this.triggerMC = snapShot.val().triggerPost;
		})
  };

	changeTriggerPost = (trigger) => {
    this.getTriggerPost(trigger);
		this.dataVohRealTime.ref().child(trigger).update({
		  triggerPost: !this.triggerMC
		});
  };

  handleGetRecord = (status, sort="desc") => {
    api.getRecords(this.defaultStartPage, this.state.defaultAmountPage, status, sort)
      .then(response => {
        if (response.success) {
          this.records = response.data.content;
          let array = response.data.content;
          this.records.forEach((item,index)=>{
            if(item.priority === true) {
              array.splice(0, 0, array[index]);
              array.splice(index + 1, 1)
            }
          });
          this.setState({
            records: array,
            activePage: response.data.number + 1,
            totalElements: response.data.totalElements
          });
        }
      })
  };

  handlePageChange(pageNumber ,defaultAmountPage = this.state.defaultAmountPage, sort="desc") {
    api.getRecords(pageNumber - 1, defaultAmountPage, this.defaultGetStatus, sort ).then(response => {
      if (response.success) {
        this.setState({
          records: response.data.content,
          activePage: pageNumber
        });
      }
    });
  }

  handleSortBYSpeed = (speedId) => {
    api.sortBySpeed(speedId)
    .then(response =>{
      if(response.success){
        if(response.data){
          this.setState({records:response.data.content})
        }
        else{
          this.setState({records:[]})
        }
        
      }
      else{
        if(this.toast){
          this.toast.showMessage("Kết nối tới server bị lỗi");
        }
      }
    })
  };

  handleSortByDistrict = (key) => {
    api.sortByDistrict(key)
    .then(response =>{
      if(response.success){
        if(response.data){
          this.setState({records:response.data.content})
        }
        else{
          this.setState({records:[]})
        } 
      }
      else {
        if(this.toast){
          this.toast.showMessage("Kết nối tới server bị lỗi");
        }
      }
    })
  };

  handleSortBySpeedAndDistrict(speedId,districtId){
    
    api.sortByDistrictAndSpeed(districtId,speedId)
    .then(response =>{
      if(response.success){
        if(response.data){
          this.setState({records:response.data.content})
        }
        else{
          this.setState({records:[]})
        }
      }
      else {
        if(this.toast){
          this.toast.showMessage("Kết nối tới server bị lỗi");
        }
      }
    })
  }

  showAllRecord = () => {
    let records = this.records;
    this.setState({
      records
    })
  };

  onChangeStatusRecords(userId, recordId, status, content){
    let role = this.state.user.role;
    let newStatus = status==="correct" && (role==="ROLE_DATAENTRY_EDITOR" || role==="ROLE_ADMIN")?"pending":status;
    api.updateStatusRecordsV2(userId, recordId, newStatus, content).then(response => {
      if(response.success){
        if(newStatus === "solved"){
          this.changeTriggerPost("triggerMcSolveRecord");
        }
        else{
          this.changeTriggerPost("triggerMcRecord");
          if(newStatus === "pending"){
            this.changeTriggerPost("triggerDataEntryRecord");
          }
          else if(newStatus === "correct"){
            this.changeTriggerPost("triggerEditorRecord");
          }
          else if(newStatus === "read"){
            this.changeTriggerPost("triggerMcSolveRecord");
          }
        }
      }
      else {
       if(this.toast){
         if(status === "correct") {
           this.toast.showMessage("Xác nhận rút tin thất bại");
         }else if(status === "read"){
           this.toast.showMessage("Xác nhận đọc tin thất bại");
         }else if(status === "unread"){
           this.toast.showMessage("Xác nhận bỏ qua tin thất bại");
         }else if(status === "solved"){
           this.toast.showMessage("Xác nhận giải quyết tin thất bại");
         }
       }
      }
    })
  }

  onChangeUpdatePriorityRecord = (id, index) => {
    api.updatePriorityRecord(id).then(response => {
      if (response.success) {
        // this.toast.showMessage('Đã thêm vào danh sách chờ phát');
        this.changeTriggerPost("triggerMcRecord");
        this.handleGetRecord("accepted");
      }
      else {
        this.toast.showMessage('Đánh dấu danh sách chờ phát thất bại');
      }
    })
  };

  switchPriority = (index) => {
    let array = this.state.records;
    array[index].priority = true;
    array.splice(1, 0, array[index]);
    array.splice(index + 1, 1);
    this.setState({ records: array })
  };

  handleChangeState = event => {
    let defaultAmountPage = event.target.value;
    this.setState({defaultAmountPage});
    this.handlePageChange(1, defaultAmountPage);
  };

  render() {
    return (
      <div className="sub-contain" >
        <Toast ref={(ref) => this.toast = ref} />
        {
          this.props.status==="solved"?null:
            <TableCustomTitle
              titleTable = "DANH SÁCH BẢN TIN HIỆN TẠI"
              role ={this.state.user.role}
              onSortSpeed={(key) => this.handleSortBYSpeed(key)}
              onSOrtDistrict={(key) => this.handleSortByDistrict(key)}
              onSortDistrictAndSpeed={(speed,district) => this.handleSortBySpeedAndDistrict(speed,district)}
              onDefault={() => this.showAllRecord()}
            />
        }
        <TableCustom
          data={this.state.records}
          onChange={(userId, recordId, status, content) => this.onChangeStatusRecords(userId, recordId, status, content)}
          onSwitch = {(idx) => this.switchPriority(idx)}
          onChangeUpdatePriorityRecord={(id) => this.onChangeUpdatePriorityRecord(id)}
          status={this.props.status?this.props.status:'accepted'}
          user = {this.state.user}
          totalElements={this.state.totalElements}
        />
        <PagingGrid
          defaultAmountPage={this.state.defaultAmountPage}
          activePage={this.state.activePage}
          totalElements={this.state.totalElements}
          handlePageChange={this.handlePageChange}
          handleChangeState={this.handleChangeState}
        />
      </div>
    )
  }
}