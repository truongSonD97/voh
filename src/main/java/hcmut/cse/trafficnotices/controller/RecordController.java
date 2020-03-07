package hcmut.cse.trafficnotices.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import hcmut.cse.trafficnotices.dto.RestRecordDTO;
import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.entity.RecordStatusLog;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.RecordService;
import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;

@RestController
@RequestMapping("/api/records")
public class RecordController {

  @Autowired
  private RecordService recordService ;  
  
  /* ---------------- GET ALL RECORDS ------------------------ */
  @GetMapping(value = "")
  public Response<Page<Record>> getRecordsPaging(
      @RequestParam(value = "page", required=true) int page, 
      @RequestParam(value = "size", required=true) int size,
      @RequestParam(value = "status", required=false) StatusOfRecord status,
      @RequestParam(value = "from", required=false) String fromTime,
      @RequestParam(value = "to", required=false) String toTime,
      @RequestParam(value = "sort", required=false) String sort) {

    Sort.Direction direction = sort!=null&&sort.equals("asc")?Sort.Direction.ASC:Sort.Direction.DESC;
    Sort sortValue = new Sort(direction,"created_on");
    
    if((fromTime == null && toTime != null) || (fromTime != null && toTime == null)) 
      return new Response<Page<Record>>(400, "Error", null);
    
    
    if(status == null) {
      if(fromTime == null) 
        return new  Response<Page<Record>>(200, "Success", 
            recordService.findAllPaging(page ,size ,sortValue)); 
      else 
        return new  Response<Page<Record>>(200, "Success", 
            recordService.findAllPagingBetween(page ,size ,fromTime ,toTime ,sortValue));
    }
    else {
      if(fromTime == null) 
        return new  Response<Page<Record>>(200, "Success", 
            recordService.findAllPaging(page ,size ,status ,sortValue)); 
      else
        return new  Response<Page<Record>>(200, "Success", 
            recordService.findAllPagingBetween(page ,size ,status ,fromTime ,toTime ,sortValue )); 
    }    
  }
  
  /* ---------------- GET ALL RECORDS ------------------------ */
  @GetMapping(value = "/users")
  public Response<Map<String, Object>> getRecordsPagingWithUser(
      @RequestParam(value = "page", required=true) int page, 
      @RequestParam(value = "size", required=true) int size,
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime,
      @RequestParam(value = "status", required=false) StatusOfRecord status,
      @RequestParam(value = "sort", required=false) String sort) {

    Sort.Direction direction = sort!=null&&sort.equals("asc")?Sort.Direction.ASC:Sort.Direction.DESC;
    Sort sortValue = new Sort(direction,"created_on");
    
   if(status == null) {
      return new  Response<Map<String, Object>>(200, "Success", 
          recordService.findAllPagingWithUserBetween(page ,size ,fromTime ,toTime ,sortValue));
    }
    else {
      return new  Response<Map<String, Object>>(200, "Success", 
          recordService.findAllPagingWithUserBetween(page ,size ,status ,fromTime ,toTime ,sortValue )); 
    }    
  }
  
  /* ---------------- GET ALL RECORDS BY SPEED ------------------------ */
  @GetMapping(value = "/speed")
  public Response<Page<Record>> getRecordsPagingBySpeed(
      @RequestParam(value = "page", required=true) int page, 
      @RequestParam(value = "size", required=true) int size,
      @RequestParam(value = "speedId", required=true) String speedId,
      @RequestParam(value = "status", required=true) StatusOfRecord status,
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime) {
    
    Sort sortValue = new Sort(Sort.Direction.DESC,"created_on");    
    
    return new  Response<Page<Record>>(200, "Success", 
            recordService.findPagingBySpeed(page ,size ,speedId ,status ,fromTime ,toTime ,sortValue )); 
  }
  
  /* ---------------- GET ALL RECORDS BY DISTRICT & SPEED ------------------------ */
  @GetMapping(value = "/speed-and-district")
  public Response<Page<Record>> getRecordsPagingBySpeedAndDistrict(
      @RequestParam(value = "page", required=true) int page, 
      @RequestParam(value = "size", required=true) int size,
      @RequestParam(value = "speedId", required=false) String speedId,
      @RequestParam(value = "district", required=true) String districtName,
      @RequestParam(value = "status", required=true) StatusOfRecord status,
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime) {
    
    if(speedId == null) {
      return new  Response<Page<Record>>(200, "Success", 
          recordService.findAllPagingByDistrictAndSpeed(page, size, districtName, "", status, fromTime, toTime )); 
    }else {
      return new  Response<Page<Record>>(200, "Success", 
          recordService.findAllPagingByDistrictAndSpeed(page, size, districtName, speedId, status, fromTime, toTime )); 
    }
  }
  
  
  /* ---------------- EXPORT RECORDS ------------------------ */
  @GetMapping(value = "/export")
  public Response<List<RestRecordDTO>> exportRecords(
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime,
      @RequestParam(value = "includeRemove", required=false, defaultValue = "true") Boolean includeRemove ) {
    return new  Response<List<RestRecordDTO>>(200, "Success", recordService.exportRecord(fromTime ,toTime,null, includeRemove)); 
        
  }
  
  /* ---------------- EXPORT RECORDS ------------------------ */
  @GetMapping(value = "/export-with-address-id")
  public Response<List<RestRecordDTO>> exportRecordsWithAddressId(
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime,
      @RequestParam(value = "id", required=true) String addressId,
      @RequestParam(value = "includeRemove", required=false, defaultValue = "true") Boolean includeRemove) {
    return new  Response<List<RestRecordDTO>>(200, "Success", recordService.exportRecord(fromTime ,toTime ,addressId, includeRemove)); 
        
  }
  
  /* ---------------- CREATE NEW RECORD ------------------------ */
  @PostMapping(value = "")
  public Response<Record> createRecord(@RequestBody Record record) {
    Record result = recordService.save(record);
    if (result != null) {
      return new Response<Record>(201, "Created", result);
    } else {
      return new Response<Record>(400, "Error", result);
    }
  }
  
  
  /* ---------------- UPDATE RECORD ------------------------ */
  @PutMapping(value = "/update")
  public Response<Record> updateRecord(@RequestBody Record record) {
    Record result = recordService.updateRecord(record);
    if (result != null) {
      return new Response<Record>(201, "Success", result);
    } else {
      return new Response<Record>(400, "Error", result);
    }
  }
  
  /* ---------------- SWITCH RECORD STATUS------------------------ */
  @PutMapping(value = "/update-priority")
  public Response<Record> updatePriority(@RequestBody Record record) {
    Record result = recordService.updatePriority(record);
    if (result != null) {
      return new Response<Record>(201, "Success", result);
    } else {
      return new Response<Record>(400, "Error", result);
    }
  }
  
  /* ---------------- SWITCH RECORD STATUS------------------------ */
  @PutMapping(value = "/switch-status")
  public Response<RecordStatusLog> switchStatusV2(@RequestBody ObjectNode json) {
    ObjectMapper mapper = new ObjectMapper();
    StatusOfRecord status = null ;
    try {
      status = mapper.treeToValue(json.get("status"), Constants.StatusOfRecord.class);
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return new Response<RecordStatusLog>(400, "Error Status", null);      
    }
    RecordStatusLog recordStatusLog = recordService.switchRecordStatus(
        json.get("recordId").textValue() , 
        json.get("userId").textValue() , 
        status, 
        json.get("content").textValue() );
    if (recordStatusLog != null) {
      return new Response<RecordStatusLog>(201, "Success", recordStatusLog);
    } else {
      return new Response<RecordStatusLog>(400, "Error", recordStatusLog);
    }
  }
  
  /* ---------------- DELETE RECORD ------------------------ */
//  @DeleteMapping(value = "/{id}" )
//  public Response<String> deleteRecordById(@PathVariable String id) {
//    if(recordService.delete(id)) {
//      return new Response<String>(200, "Deleted", null);   
//    }
//    else {
//      return new Response<String>(400, "Error", null);   
//    }
//    
//  }
  
  /* ----------------  RECORD ------------------------ */
  @GetMapping("/count-records-by-address-id")
  public Response<Long> countByAddressId(@RequestParam(value = "id", required=true) String id) {
    return new Response<Long>(200, "Success", recordService.countByAddressId(id));       
  }
  
  /* ----------------  RECORD ------------------------ */
  @GetMapping("/count-records-by-reason-id")
  public Response<Long> countByReasonId(@RequestParam(value = "id", required=true) String id) {
    return new Response<Long>(200, "Success", recordService.countByReasonId(id));       
  }
  
  /* ----------------  RECORD ------------------------ */
  @GetMapping("/count-records-by-personsharing-id")
  public Response<Long> countByPersonSharingId(@RequestParam(value = "id", required=true) String id) {
    return new Response<Long>(200, "Success", recordService.countByPersonSharingId(id));       
  }
  
}
