package hcmut.cse.trafficnotices.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;
import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.entity.PersonSharing;
import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.PersonSharingService;
import hcmut.cse.trafficnotices.util.RestUtils;

@RestController
@RequestMapping("/api/person-sharing")
public class PersonSharingController {
  @Autowired
  private PersonSharingService personSharingService ;
  
  /* ---------------- GET ALL PERSON SHARING ------------------------ */
  @GetMapping(value = "" )
  public Response<List<PersonSharing>> getPersonSharing() {
      return new  Response<List<PersonSharing>>(200, "Success", personSharingService.findAll());   
  }
  
  /* ---------------- GET ALL PERSON SHARING ------------------------ */
  @GetMapping(value = "/find-same" )
  public Response<Map<String, Object>> getPersonSharing(@RequestParam(value = "phone", required=true) String phone ) {
      return new  Response<Map<String, Object>>(200, "Success", personSharingService.findSame(phone));   
  }
  
  /* ---------------- CREATE NEW PERSON SHARING ------------------------ */
  @PostMapping(value = "")
  public Response<Object> createPersonSharing(@Valid @RequestBody PersonSharing personSharing) {
    return RestUtils.createRestOutput(personSharingService.save(personSharing));
  }
  
  /* ---------------- UPDATE PERSON SHARING ------------------------ */
  @PutMapping(value = "/update-person-sharing")
  public Response<PersonSharing> updatePersonSharing(@Valid @RequestBody PersonSharing personSharing) {
    PersonSharing result = personSharingService.updatePersonSharing(personSharing);
    if (result != null ) {
      return new Response<PersonSharing>(201, "Success", result);   
    } else {
      return new Response<PersonSharing>(400, "Error", result);   
    }
  }
  
  /* ---------------- DELETE ADDRESS ------------------------ */
  @DeleteMapping(value = "/{id}" )
  public Response<String> deletePersonSharingById(@PathVariable String id) {
    if(personSharingService.delete(id)) {
      return new Response<String>(200, "Deleted", null);   
    }
    else {
      return new Response<String>(400, "Error", null);   
    }
  }
}
