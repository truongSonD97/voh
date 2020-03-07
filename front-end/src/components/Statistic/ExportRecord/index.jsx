import React from 'react';
import { CSVLink } from "react-csv";
import { Fab, Tooltip } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import { districtList } from "../../Common/constants/districts";

export default class ExportRecord extends React.Component {
  constructor(props) {
    super(props);
    let listDate = props.listDate || [];
    this.state = {
      recordExport: [],
      Dates : listDate
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    let listDate = nextProps.listDate;
    if(nextProps.listDate !== this.state.Dates){
      this.setState({ Dates: listDate});
    }
  }
  getRecordForExport = () => {
    let dateList = this.getStartEndDate(this.state.Dates);
    api.getRecordForExport(dateList[0], dateList[1])
      .then(response => {
        if (response.success) {
          if (response.data.length) {   
              let data = response.data.map(x => ({
                "Ngày": x.createdOn.split(" ")[0].toString(),
                "Giờ": x.createdOn.split(" ")[1].toString(),
                "Thính Giả": x.personSharing.name.toString(),
                "Phone": x.personSharing.phoneNumber.toString(),
                "Điểm ùn tác": x.address.name.toString(),
                "Hướng": x.address.direction ? x.address.direction.toString() : "",
                "Quận": this.generateDistrictString(x.address.district),
                "Tình Trạng": x.speed.name.toString(),
                "Ghi chú": x.notice.toString()
              }));
              this.setState({ recordExport: data }, () => {
                this.exportLink.link.click()
              });
            
          }
          else {
            if (this.toast) {
              this.toast.showMessage("Không có bản tin nào");
            }
          }
        }
      })
  };

  generateDistrictString(districts) {
    let districtString = '  ';
    districts.map(item => {
      districtString = districtString.concat(districtList.find(x => x['key'] === item).name, " ,");
    });
    return districtString.slice(0, -2);
  }

  getStartEndDate(date) {
    let monthFromDate = date.StartDate.getMonth() + 1;
    let monthToDate = date.EndDate.getMonth() + 1;
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  }

  render() {
    return (
      <div >
        <Tooltip title="Xuất Excel" aria-label="Xuất Excel">
          <Fab
            className='export-btn'
            id='export-btn'
            size='small'
            variant="contained"
            onClick={()=> {
              this.getRecordForExport()
              }}
          >
            <CloudDownloadIcon/>
          </Fab>
        </Tooltip>

        <CSVLink
          data={this.state.recordExport}
          filename={this.props.fileName}
          ref={(r) => this.exportLink = r}
          className="hidden"
          target="_blank" 
        />
         <Toast ref={(ref) => this.toast = ref} />
      </div>
    )
  }
};