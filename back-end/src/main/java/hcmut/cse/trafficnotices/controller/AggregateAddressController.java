package hcmut.cse.trafficnotices.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.AggregateAddressService;
import net.minidev.json.JSONObject;

@RestController
@RequestMapping("/api/addresses/aggregate")
public class AggregateAddressController {
  
  @Autowired
  private AggregateAddressService aggregateAddressService ;
  
  @GetMapping("/address-{fieldName}")
  public Response<JSONObject>  aggregateBySpeed(
      @RequestParam(value = "id", required=true) String addressId,
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime,
      @PathVariable String fieldName
    ) {
    int totalItems = 0;
    AggregationResults<JSONObject> list = aggregateAddressService.aggAddressWith(fromTime, toTime, addressId ,fieldName);
    List<JSONObject> listResult = list.getMappedResults();
    for (JSONObject item : listResult) {
      totalItems += item.getAsNumber("count").intValue();
    }
    JSONObject entity = new JSONObject();
    entity.put("list", list.getMappedResults());
    entity.put("total", totalItems);
    return new  Response<JSONObject>(200, "Success", entity);
  }
  
  @GetMapping("/address-day")
  public Response<JSONObject>  aggregateByDays(
      @RequestParam(value = "id", required=true) String addressId,
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime
    ) {
    int totalItems = 0;
    AggregationResults<JSONObject> list = aggregateAddressService.aggAddressWithDays(fromTime, toTime, addressId );
    List<JSONObject> listResult = list.getMappedResults();
    for (JSONObject item : listResult) {
      totalItems += item.getAsNumber("count").intValue();
    }
    JSONObject entity = new JSONObject();
    entity.put("list", list.getMappedResults());
    entity.put("total", totalItems);
    return new  Response<JSONObject>(200, "Success", entity);
  }
  
  
  @GetMapping("/top-address-min-speed")
  public Response<JSONObject>  aggAddressHasSpeed(
      @RequestParam(value = "speedId", required=true) String speedId,
      @RequestParam(value = "reasonId", required=true) String reasonId,
      @RequestParam(value = "from", required=true) String fromTime,
      @RequestParam(value = "to", required=true) String toTime
    ) {
    int totalItems = 0;
    AggregationResults<JSONObject> list = 
    aggregateAddressService.aggAddressHasSpeed(fromTime, toTime, speedId, reasonId);
    List<JSONObject> listResult = list.getMappedResults();
    for (JSONObject item : listResult) {
      totalItems += item.getAsNumber("count").intValue();
    }
    JSONObject entity = new JSONObject();
    entity.put("list", list.getMappedResults());
    entity.put("total", totalItems);
    return new  Response<JSONObject>(200, "Success", entity);
  }

  
}
