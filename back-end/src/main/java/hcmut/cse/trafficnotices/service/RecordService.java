package hcmut.cse.trafficnotices.service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.dto.RestRecordDTO;
import hcmut.cse.trafficnotices.entity.Address;
import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.entity.RecordStatusLog;
import hcmut.cse.trafficnotices.entity.User;
import hcmut.cse.trafficnotices.repository.RecordRepository;
import hcmut.cse.trafficnotices.repository.RecordStatusLogRepository;
import hcmut.cse.trafficnotices.repository.UserRepository;
import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.DTOConverter;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;


@Service
public class RecordService {
  
  @Autowired
  private RecordRepository recordRepository ;
  
  @Autowired
  private UserRepository userRepository ;
  
  @Autowired
  private RecordStatusLogRepository recordStatusLogRepository ;
  
  @Autowired
  private AddressService addressService ;
  
  public Page<Record> findAllPaging(int page, int size , Sort sort){
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size ,sort);
    return recordRepository.findAll(request);
  }
 
  public Page<Record> findAllPaging(int page, int size, StatusOfRecord status, Sort sort){
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size ,sort);
    return recordRepository.findByStatus(status, request);
  }
  
  public Page<Record> findPagingBySpeed(int page, int size, String speedId,StatusOfRecord status,
      String fromTime ,String toTime, Sort sort){
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(fromTime);
      endDate = Constants.DATEFORMAT_F.parse(toTime);
    } catch (ParseException e) {
      e.printStackTrace();
      return null;
    }  
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size ,sort);
    return recordRepository.findBySpeedAndStatusAndCreatedOnBetween(
        speedId, 
        status,
        Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
        Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59", 
        request);
  }
  
  public Page<Record> findAllPagingBetween(int page, int size , String fromTime ,String toTime ,Sort sort){
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(fromTime);
      endDate = Constants.DATEFORMAT_F.parse(toTime);
    } catch (ParseException e) {
      e.printStackTrace();
      return null;
    }  
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size, sort);
    return recordRepository.findByCreatedOnBetween(Constants.DATETIMEFORMAT_F.format(startDate),
                                              Constants.DATEFORMAT_F.format(endDate) + " 23:59:59",
                                              request);
  }
  
  public Map<String, Object> findAllPagingWithUserBetween(int page, int size , String fromTime ,String toTime ,Sort sort){
    Map<String, Object> output = new HashMap<String, Object>();
    Page<Record> records = findAllPagingBetween(page, size, fromTime, toTime, sort);
    List<RestRecordDTO> recordDTOList = new ArrayList<RestRecordDTO>();
    for(Record record : records.getContent()) {
      List<RecordStatusLog> recordStatusList = recordStatusLogRepository.findByRecord(record);
      recordDTOList.add(DTOConverter.convertRecord2RestDTO(record, recordStatusList));
    }
    output.put("content", recordDTOList);
    output.put("totalPages", records.getTotalPages());
    output.put("totalElements", records.getTotalElements());
    output.put("number", records.getNumber());
    output.put("numberOfElements", records.getNumberOfElements());
    return output;
  }
  
  public Map<String, Object> findAllPagingWithUserBetween(int page, int size , StatusOfRecord status, 
      String fromTime ,String toTime ,Sort sort){
    Map<String, Object> output = new HashMap<String, Object>();
    Page<Record> records = findAllPagingBetween(page, size, status, fromTime, toTime, sort);
    List<RestRecordDTO> recordDTOList = new ArrayList<RestRecordDTO>();
    for(Record record : records.getContent()) {
      List<RecordStatusLog> recordStatusList = recordStatusLogRepository.findByRecord(record);
      recordDTOList.add(DTOConverter.convertRecord2RestDTO(record, recordStatusList));
    }
    output.put("content", recordDTOList);
    output.put("totalPages", records.getTotalPages());
    output.put("totalElements", records.getTotalElements());
    output.put("number", records.getNumber());
    output.put("numberOfElements", records.getNumberOfElements());
    return output;
  }
  
  
  public Page<Record> findAllPagingBetween(int page, int size, StatusOfRecord status, 
      String fromTime, String toTime, Sort sort){
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(fromTime);
      endDate = Constants.DATEFORMAT_F.parse(toTime);
    } catch (ParseException e) {
      e.printStackTrace();
      return null;
    }  
    
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size, sort);
    return recordRepository.findByStatusAndCreatedOnBetween(status, 
        Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
        Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59", 
        request);
  }
  
  public Page<Record> findAllPagingByDistrictAndSpeed(int page, int size, String districtName,
      String speedId, StatusOfRecord status, String fromTime, String toTime){
    
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(fromTime);
      endDate = Constants.DATEFORMAT_F.parse(toTime);
    } catch (ParseException e) {
      e.printStackTrace();
      return null;
    }  
    
    Sort sortValue = new Sort(Sort.Direction.DESC,"created_on");    
    List<Address> addressList = addressService.findByDistrict(districtName);    
    @SuppressWarnings("deprecation")
    PageRequest request = new PageRequest(page, size ,sortValue);
    
    if(speedId.equals("")) {
      return recordRepository.findByAddressInAndStatusAndCreatedOnBetween(
          addressList,
          status,
          Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
          Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59", 
          request);  
    }
    else {
      return recordRepository.findByAddressInAndSpeedAndStatusAndCreatedOnBetween(
          addressList,
          speedId,
          status,
          Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
          Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59", 
          request);  
    } 

  }
  
  
  public List<RestRecordDTO> exportRecord(String fromTime, String toTime, String addressId, Boolean includeRemove){
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(fromTime);
      endDate = Constants.DATEFORMAT_F.parse(toTime);
    } catch (ParseException e) {
      e.printStackTrace();
      return null;
    }  
    List<Record> records ;
    if(includeRemove)
      if(addressId != null) {
        records = recordRepository.findByAddressIdAndCreatedOnBetween(
            addressId,
            Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
            Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59");
      }else {
        records = recordRepository.findByCreatedOnBetween(
            Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
            Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59");
      }
    else {
      List<StatusOfRecord> statusList = Arrays.asList(StatusOfRecord.removed, StatusOfRecord.unread);  
      if(addressId != null) {
        records = recordRepository.findByAddressIdAndStatusNotInAndCreatedOnBetween(
            addressId,
            statusList, 
            Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
            Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59");
      }else {
        records = recordRepository.findByStatusNotInAndCreatedOnBetween(
            statusList, 
            Constants.DATEFORMAT_F.format(startDate)  + " 00:00:00", 
            Constants.DATEFORMAT_F.format(endDate)    + " 23:59:59");
      }
    }
    List<RestRecordDTO> recordDTOList = new ArrayList<RestRecordDTO>();
    for(Record record : records) {
      List<RecordStatusLog> recordStatusList = recordStatusLogRepository.findByRecord(record);
      recordDTOList.add(DTOConverter.convertRecord2RestDTO(record, recordStatusList));
    }
    return recordDTOList;
  }
  
  
  public Record save(Record record) {
    try {
      return recordRepository.save(record);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return null;
    }
  }
  
  public Record updatePriority(Record record) {
    Optional<Record> result = recordRepository.findById(record.getId());
    if(result != null && result.isPresent()) {
      result.get().setPriority(true);
      try {
        return recordRepository.save(result.get());
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return null;
      }
    }
    else
      return null;
  }
  
  public Record updateRecord(Record record) {
    Optional<Record> result = recordRepository.findById(record.getId());
    if(result != null && result.isPresent()) {
      if(record.getPersonSharing() != null) {
        result.get().setPersonSharing(record.getPersonSharing());
      }
      if(record.getNotice() != null) {
        result.get().setNotice(record.getNotice());
      }      
      if(record.getAddress() != null) {
        result.get().setAddress(record.getAddress());
      }      
      if(record.getSpeed() != null) {
        result.get().setSpeed(record.getSpeed());
      }      
      if(record.getReason() != null) {
        result.get().setReason(record.getReason());
      }      
      try {
        return recordRepository.save(result.get());
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return null;
      }
    }
    else
      return null;
  }
  
  
  public RecordStatusLog  switchRecordStatus(String recordId ,String userId ,StatusOfRecord status, String content) {
    Optional<Record> record = recordRepository.findById(recordId);
    Optional<User> user = userRepository.findById(userId);
    if(record != null && record.isPresent() && user != null && user.isPresent()){ 
      RecordStatusLog recordStatusLog = recordStatusLogRepository.findByRecordAndStatus(record.get(), status);
      record.get().setStatus(status);
      record.get().setPriority(false);
      recordRepository.save(record.get());
      if(recordStatusLog == null) {
        recordStatusLog = new RecordStatusLog();
        recordStatusLog.setStatus(status);
        recordStatusLog.setRecord(record.get());
      }
      recordStatusLog.setContent(content);
      recordStatusLog.setUser(user.get());
      return recordStatusLogRepository.save(recordStatusLog);      
    }
    else {
      return null;
    }
  }
  
  public boolean delete(String id) {
    Optional<Record> record = recordRepository.findById(id);
    if(record != null && record.isPresent()) {
      recordRepository.deleteById(id);
      return true;
    }else
      return false;
  }
  
  
  public Long countByAddressId(String id) {
    return recordRepository.countByAddressId(id);
  }
  
  public Long countByReasonId(String id) {
    return recordRepository.countByReasonId(id);
  }
  
  public Long countByPersonSharingId(String id) {
    return recordRepository.countByPersonSharingId(id);
  }
}
