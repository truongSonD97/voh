package hcmut.cse.trafficnotices.service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.entity.RecordStatusLog;
import hcmut.cse.trafficnotices.repository.RecordStatusLogRepository;
import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;

@Service
public class RecordStatusLogService {
  
  @Autowired
  private RecordStatusLogRepository recordStatusLogRepository;
  
  public List<RecordStatusLog> findAll(){
    return recordStatusLogRepository.findAll();
  }
  
  public List<RecordStatusLog> findByRecord(Record record){
    return recordStatusLogRepository.findByRecord(record);
  }
  
  public Page<RecordStatusLog> findAllPagingBetween(int page, int size, StatusOfRecord status, String fromTime, String toTime,Sort sortValue){
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(fromTime);
      endDate = Constants.DATEFORMAT_F.parse(toTime);
    } catch (ParseException e) {
      e.printStackTrace();
      return null;
    }  
    
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size, sortValue);
    return recordStatusLogRepository.findByStatusAndCreatedOnBetween(status, 
        Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
        Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59", 
        request);
  }
}
