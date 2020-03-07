import React from "react";
import {keyToDistrictObject} from "../../constants/districts";

export const showTooltipInfo = record => {
  return record ?
    <div>
      <p>
        <b>Người chia sẻ : </b>
        {record.personSharing ? record.personSharing.name : ''} - {
        record.personSharing ? record.personSharing.phoneNumber : ''}
      </p>
      <p>
        <b>Địa điểm : </b>
        {(record.address ? record.address.name : '')}
        <b>{record.address.direction ? ' hướng ' : ''}</b>
        {record.address.direction ? record.address.direction : ''} ( {record.address.district ?
          keyToDistrictObject(record.address.district).map((item,index) =>index===0?item.name:(' - '+item.name))
          : ''} )
      </p>
      <p>
        <b>Nguyên nhân : </b>
        {record.reason ? record.reason.name : ''}</p>
      <p>
        <b>Tình trạng : </b>
        {record.speed ? record.speed.name : ''} ({(record.speed ? record.speed.value : '') + ' km/h'})
      </p>
      <p><b>Thời gian : </b> {subTimeString(record.createdOn)}</p>
      <p>
        <b>Ghi chú thêm : </b>
        {record.notice ? record.notice : ''}
      </p>
    </div>:null;
};

export const subTimeString = (time) => {
  return time.substring(11, 16) + " " +
    time.substring(8, 10) + "/" +
    time.substring(5, 7) + "/" +
    time.substring(0, 4);
};