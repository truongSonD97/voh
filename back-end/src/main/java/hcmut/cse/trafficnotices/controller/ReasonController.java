package hcmut.cse.trafficnotices.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.entity.Reason;
import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.ReasonService;

@RestController
@RequestMapping("/api/reasons")
public class ReasonController {
  
  @Autowired
  private ReasonService reasonService;

  /* ---------------- GET ALL REASON ------------------------ */
  @GetMapping(value = "")
  public Response<List<Reason>> getReasons() {
    return new Response<List<Reason>>(200, "Success", reasonService.findAll());
  }

  /* ---------------- CREATE NEW REASON ------------------------ */
  @PostMapping(value = "")
  public Response<Reason> createReason(@Valid @RequestBody Reason reason) {
    Reason result = reasonService.save(reason);
    if (result != null) {
      return new Response<Reason>( 201, "Created", result);
    } else {
      return new Response<Reason>( 400, "Error", result);
    }
  }
  
  @GetMapping(value = "/find")
  public Response<Reason> getReasonByName(
      @RequestParam(value = "name", required=true) String name){
    Reason result = reasonService.findByName(name);
    if (result != null) {
      return new Response<Reason>( 201, "Success", result);
    } else {
      return new Response<Reason>( 400, "Error", result);
    }
  }
  
  /* ---------------- UPDATE REASON ------------------------ */
  @PutMapping(value = "/update-reason")
  public Response<Reason> updatePersonSharing(@Valid @RequestBody Reason reason) {
    Reason result = reasonService.updateReason(reason);
    if (result != null ) {
      return new Response<Reason>(201, "Success", result);   
    } else {
      return new Response<Reason>(400, "Error", result);   
    }
  }
  
  
  /* ---------------- DELETE REASON ------------------------ */
  @DeleteMapping(value = "/{id}" )
  public Response<String> deleteReasonById(@PathVariable String id) {
    if(reasonService.delete(id)) {
      return new Response<String>(200, "Deleted", null);   
    }
    else {
      return new Response<String>(400, "Error", null);   
    }
    
  }

}
