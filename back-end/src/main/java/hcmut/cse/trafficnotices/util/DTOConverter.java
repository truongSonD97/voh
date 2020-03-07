package hcmut.cse.trafficnotices.util;

import java.util.List;

import hcmut.cse.trafficnotices.dto.RestRecordDTO;
import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.entity.RecordStatusLog;

public class DTOConverter {
  public static RestRecordDTO convertRecord2RestDTO(Record record, List<RecordStatusLog> recordStatusList){
    RestRecordDTO recordDTO = new RestRecordDTO();
    recordDTO.setAddress(record.getAddress());
    recordDTO.setId(record.getId());
    recordDTO.setCreatedOn(record.getCreatedOn());
    recordDTO.setPersonSharing(record.getPersonSharing());
    recordDTO.setReason(record.getReason());
    recordDTO.setSpeed(record.getSpeed());
    recordDTO.setNotice(record.getNotice());
    for(RecordStatusLog recordStatus : recordStatusList) {
      if(recordStatus.getStatus() == Constants.StatusOfRecord.accepted)
        recordDTO.setUserCreated(recordStatus.getUser().getName());
      else if(recordStatus.getStatus() == Constants.StatusOfRecord.read)
        recordDTO.setUserRead(recordStatus.getUser().getName());
      else if(recordStatus.getStatus() == Constants.StatusOfRecord.removed) {
        recordDTO.setUserRemove(recordStatus.getUser().getName());
        recordDTO.setRemoveReason(recordStatus.getContent());
      } 
    }
    return recordDTO;
  }
}
