package hcmut.cse.trafficnotices.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.entity.Speed;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.SpeedService;

@RestController
@RequestMapping("/api/speeds")
public class SpeedController {

  @Autowired
  private SpeedService speedService ;
  
  /* ---------------- GET ALL SPEEDS ------------------------ */
  @GetMapping(value = "" )
  public Response<List<Speed>> getReasons() {
      return new  Response<List<Speed>>(200, "Success", this.speedService.findAll());   
  }
  
  /* ---------------- CREATE NEW SPEED ------------------------ */
  @PostMapping(value = "")
  public Response<Speed> createReason(@Valid @RequestBody Speed speed) {
    Speed result = speedService.save(speed) ;
    if (result != null) {
      return new Response<Speed>(201, "Created", result);   
    } else {
      return new Response<Speed>(400, "Error", result);   
    }
  }
  
  /* ---------------- DELETE SPEED ------------------------ */
  @DeleteMapping(value = "/{id}" )
  public Response<String> deleteSpeedById(@PathVariable String id) {
    if(speedService.delete(id)) {
      return new Response<String>(200, "Deleted", null);   
    }
    else {
      return new Response<String>(400, "Error", null);   
    }
  }
  
}
