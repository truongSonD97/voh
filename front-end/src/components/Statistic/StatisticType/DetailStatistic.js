import React from 'react';
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import Pagination from "react-js-pagination";
import TableCustom from '../../Read/ReadTable/TableCustom';
import "../../../screens/App/App.css";
import ExportRecord from '../ExportRecord';
import { districtList } from "../../Common/constants/districts";
import Calendar from '../Calendar';
import {Box, Tabs, Tab} from "@material-ui/core";
import '../Statistic.css';
import PagingGrid from "../../Common/_TablePagination/PagingGrid";

const moment = require('moment');
moment().format();

export default class DetailStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.defaultStartPage = 0;
    this.defaultAmountPage = 10;
    let trafficState = localStorage.getItem('trafficState');
    this.user = null;
    if (trafficState) {
      this.user = JSON.parse(trafficState).user;
    }
    this.fileName = "BanTinGiaoThong.csv";

    let startDefaultDate = new Date();
    startDefaultDate.setDate(startDefaultDate.getDate() - 7);
    let endDefaultDate= new Date();
    this.state = {
      isEmptyRecord: true,
      records: [],
      activePage: 1,
      totalElements: 0,
      Dates: {
        StartDate: startDefaultDate,
        EndDate: endDefaultDate
      },
      recordExport: [],
      defaultStatusdefaultStatus:"solved"
    }
  }

  getStartEndDate(date) {
    let monthFromDate = date.StartDate.getMonth() + 1;
    let monthToDate = date.EndDate.getMonth() + 1;
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  }
  generateDistrictString(districts) {
    let districtString = '  ';
    districts.map(item => {
      districtString = districtString.concat(districtList.find(x => x['key'] === item).name, " ,");
    });
    return districtString.slice(0, -2);
  }

  
  handleGetRecordForTable = (status) => {
    let dateList = this.getStartEndDate(this.state.Dates);
    api.getRecords(this.defaultStartPage, this.defaultAmountPage, status, "desc", dateList[0], dateList[1] )
      .then(response => {
        if (response.success) {
          this.setState({
            records: response.data.content,
            activePage: response.data.number + 1,
            totalElements: response.data.totalElements,
            defaultStatus: status
          });
        }
        else {
          this.toast.showMessage("Lỗi hệ thống");
        }
      })
  };

  componentDidMount() {
    this.handleGetRecordForTable(this.state.defaultStatus);
  }

  handlePageChange = (pageNumber, defaultAmountPage = this.state.defaultAmountPage) => {
    let dateList = this.getStartEndDate(this.state.Dates);
    api.getRecords(pageNumber - 1, defaultAmountPage, this.state.defaultStatus ,"desc", dateList[0] ,dateList[1])
      .then(response => {
        if (response.success) {
          this.setState({
            records: response.data.content,
            activePage: pageNumber
          });
          if (response.data.content.length < 0) {
            if (this.toast) {
              this.toast.showMessage("Không có tin nào");
            }
          }
        }else{
          if (this.toast) {
            this.toast.showMessage("Lỗi hệ thống");
          }
        }      
      })
    };
  

  handleDateChange = (key, dateValue) => {
    let Dates = { ...this.state.Dates };
    Dates[key] = dateValue;
    this.setState({ Dates });
  };

  handleChangeStatusTabs =  (event, value) => {
    if(value!==this.state.defaultStatus){
      this.handleGetRecordForTable(value);
    }
  };

  handleChangeState = event => {
    let defaultAmountPage = event.target.value;
    this.setState({defaultAmountPage});
    this.handlePageChange(1, defaultAmountPage);
  };

  render() {
    return (
      <div>
        <h3 className='pt-2'>CHI TIẾT BẢNG TIN</h3>
        <Calendar
          Dates = {this.state.Dates}
          handleDateChange = {(key,value) => {this.handleDateChange(key,value)}}
          getRecord = {(key)=>{this.handleGetRecordForTable(key)}}
          defaultStatus={this.state.defaultStatus}
        />

        <Tabs
          value={this.state.defaultStatus}
          onChange={this.handleChangeStatusTabs}
          indicatorColor="primary"
          textColor="primary"
          variant='scrollable'
          className='detail-tabs p-0'
        >
          <Tab label="Tin đã giải quyết" value='solved'/>
          <Tab label="Tin đã bỏ qua" value='unread'/>
        </Tabs>

        <div className='pt-3'>
          <TableCustom
            data={this.state.records}
            status="old"
            user={this.user}
            readOnly={true}
            page='statistic'
            totalElements={this.state.totalElements}
          />
        </div>

        {/* <ExportRecord
          getRecordForExport={this.getRecordForExport}
          recordExport={this.state.recordExport}
          fileName={this.fileName}
        /> */}
        <ExportRecord
          listDate = {this.state.Dates}
          fileName = {this.fileName}
        />

        <PagingGrid
          defaultAmountPage={this.state.defaultAmountPage}
          activePage={this.state.activePage}
          totalElements={this.state.totalElements}
          handlePageChange={this.handlePageChange}
          handleChangeState={this.handleChangeState}
        />

        {/*<div className='detail-pagination'>*/}
        {/*  <Box display="flex" justifyContent="center">*/}
        {/*    <Pagination*/}
        {/*      activePage={this.state.activePage}*/}
        {/*      itemsCountPerPage={this.defaultAmountPage}*/}
        {/*      totalElements={this.state.totalElements}*/}
        {/*      pageRangeDisplayed={5}*/}
        {/*      itemClass="page-item"*/}
        {/*      linkClass="page-link"*/}
        {/*      onChange={this.handlePageChange}*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*</div>*/}
        <Toast ref={(ref) => this.toast = ref} />
      </div>

    )
  }
}