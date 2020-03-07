import React from 'react';
import TableCustom from '../TableCustom';
import api from '../../../../utils/api';
import Toast from '../../../../utils/Toast';
import TableCustomTitle from '../Title/TableCustomTitle';
import PagingGrid from "../../../Common/_TablePagination/PagingGrid";
import Messages from "../../../Common/messages/Messages";

export default class HistoricalTable extends React.Component{
  constructor(props){
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.defaultStartPage = 0;
    this.defaultStatus = props.status;
    this.records = [];
    let trafficState = localStorage.getItem('trafficState');
    this.user = null;
    if(trafficState){
      this.user = JSON.parse(trafficState).user ;
    }
    this.state = {
      isRecordChange: false,
      records: [],
      activePage: 1,
      totalElements: 1,
      defaultAmountPage:10,
    }
  }
  handleGetRecord =() =>{
    api.getRecords(this.defaultStartPage,this.state.defaultAmountPage, this.defaultStatus)
      .then(response => {
        if(response.success){
          this.records = response.data.content;
          this.setState({
            records: response.data.content,
            activePage: response.data.number + 1,
            totalElements: response.data.totalElements
          });
        }
        else {
          this.toast.showMessage('Lỗi hệ thống');
        }
      })
  };

  componentDidMount(){
    this.handleGetRecord();
  }

  handlePageChange(pageNumber, defaultAmountPage = this.state.defaultAmountPage) {
    api.getRecords(pageNumber - 1, defaultAmountPage, this.defaultStatus).then(response => {
      if(response.success){
        this.setState({
          records: response.data.content,
          activePage: pageNumber
        });
      }
      else {
        this.toast.showMessage('Lỗi hệ thống');
      }
    })
  }

  handleSortBYSpeed = (key) =>{
    let records = this.records.filter((item)=>{
      return (item.speed.name.toString().toUpperCase() === key.toString().toUpperCase());
    });
    this.setState({records})
  };

  handleSortByDistrict = (key) =>{
    let records = this.records.filter((item) =>{
      if(item.address.district){
        return (item.address.district.toString().toUpperCase() === key.toString().toUpperCase()
        )
      }
      else return
    });
    this.setState({records})
  };

  showAllRecord =() =>{
    let records = this.records;
    this.setState({
      records
    })
  };

  handleChangeState = event => {
    let defaultAmountPage = event.target.value;
    this.setState({defaultAmountPage});
    this.handlePageChange(1, defaultAmountPage);
  };

  render(){
    return(
      <div id="page-content-wrapper">
        <div className="container-fluid p-0">
          <div className="sub-contain">
            <Toast ref={(ref) => this.toast = ref} />
            <TableCustomTitle
              titleTable ={this.props.status === "solved" ? "BẢN TIN ĐÃ GIẢI QUYẾT":"BẢN TIN BỎ QUA"}
              onSortSpeed={(key) => this.handleSortBYSpeed(key)}
              onSOrtDistrict={(key)=> this.handleSortByDistrict(key)}
              onDefault={()=>this.showAllRecord()}
            />

            <TableCustom
              data={this.state.records}
              status={"old"}
              user = {this.user}
              readOnly={true}
              totalElements={this.state.totalElements}
            />

            <PagingGrid
              defaultAmountPage={this.state.defaultAmountPage}
              activePage={this.state.activePage}
              totalElements={this.state.totalElements}
              handlePageChange={this.handlePageChange}
              handleChangeState={this.handleChangeState}
            />

            <Messages user={this.state.user}/>
          </div>
        </div>
      </div>
    )
  }
}