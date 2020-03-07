package hcmut.cse.trafficnotices.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.entity.RecordStatusLog;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.RecordStatusLogService;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;

@RestController
@RequestMapping("/api/record-log")
public class RecordStatusController {

  @Autowired
  private RecordStatusLogService recordStatusLogService;
  
  /* ---------------- GET ALL RECORDS LOG FORM STATUS ------------------------ */
  @GetMapping(value = "")
  public Response<Page<RecordStatusLog>> getRecordsPaging(
      @RequestParam(value = "page", required=true) int page, 
      @RequestParam(value = "size", required=true) int size,
      @RequestParam(value = "status", required=true) StatusOfRecord status,
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime,
      @RequestParam(value = "sort", required=false) String sort){
        
    Sort.Direction direction = sort!=null?
        (sort.equals("asc")?Sort.Direction.ASC:Sort.Direction.DESC):Sort.Direction.DESC;
        
    Sort sortValue = new Sort(direction,"created_on");
    
    return new  Response<Page<RecordStatusLog>>(200, "Success", 
        recordStatusLogService.findAllPagingBetween(page ,size ,status ,fromTime ,toTime, sortValue)); 
     
  }
  
}
