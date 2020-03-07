package hcmut.cse.trafficnotices.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.model.Output;
import hcmut.cse.trafficnotices.model.OutputSecond;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.AggregateRecordService;
import net.minidev.json.JSONObject;

@RestController
@RequestMapping("/api/aggregate")
public class AggregateRecordController {

  @Autowired
  private AggregateRecordService aggregateRecordService ;
  
  @GetMapping("/reasons")
  public Response<JSONObject>  aggregateByReasons(
    @RequestParam(value = "from", required=false) String fromTime,
    @RequestParam(value = "to", required=false) String toTime) {
    int totalItems = 0;
    AggregationResults<Output> list = null;
    if(fromTime != null && toTime != null){
      list = aggregateRecordService.aggregateByReasons(fromTime ,toTime);
    }
    else
      list = aggregateRecordService.aggregateByReasons();
    
    List<Output> listResult = list.getMappedResults();
    for (Output item : listResult) {
      totalItems += item.getCount();
    }
    JSONObject entity = new JSONObject();
    entity.put("list", list.getMappedResults());
    entity.put("total", totalItems);
    return new  Response<JSONObject>(200, "Success", entity);
  }
  
  @GetMapping("/days")
  public Response<JSONObject>  aggregateByDays(
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime,
      @RequestParam(value = "sort", required=false) String sort) {
    int totalItems = 0;
    SortOperation sortValue = Aggregation.sort(Sort.Direction.DESC, "day");
    if(sort != null) {
      if(sort.equals("asc")) 
        sortValue = Aggregation.sort(Sort.Direction.ASC, "day");
      else if(!sort.equals("desc")) 
        return new Response<JSONObject>(400, "Error", null);
    }
    AggregationResults<Output> list = 
        aggregateRecordService.aggregateByDays(fromTime ,toTime ,sortValue);
    List<Output> listResult = list.getMappedResults();
    for (Output item : listResult) {
      totalItems += item.getCount();
    }
    JSONObject entity = new JSONObject();
    entity.put("list", list.getMappedResults());
    entity.put("total", totalItems);
    return new  Response<JSONObject>(200, "Success", entity);
  }
  
  @GetMapping("/status")
  public Response<JSONObject>  aggregateByStatus(
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime,
      @RequestParam(value = "sort", required=false) String sort) {
    int totalItems = 0;
    SortOperation sortValue = Aggregation.sort(Sort.Direction.DESC, "day");
    if(sort != null) {
      if(sort.equals("asc")) 
        sortValue = Aggregation.sort(Sort.Direction.ASC, "day");
      else if(!sort.equals("desc")) 
        return new Response<JSONObject>(400, "Error", null);
    }
    AggregationResults<OutputSecond> list = 
        aggregateRecordService.aggregateByStatus(fromTime ,toTime ,sortValue );
    List<OutputSecond> listResult = list.getMappedResults();
    for (OutputSecond item : listResult) {
      totalItems += item.getCount();
    }
    JSONObject entity = new JSONObject();
    entity.put("list", list.getMappedResults());
    entity.put("total", totalItems);
    return new  Response<JSONObject>(200, "Success", entity);
  }
  
}
