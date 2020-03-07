package hcmut.cse.trafficnotices.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmut.cse.trafficnotices.entity.Address;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController{
  
  @Autowired
  private AddressService addressService ;
  
  /* ---------------- GET ALL ADDRESSES ------------------------ */
  @GetMapping(value = "")
  public Response<List<Address>> getAddresses() {
    List<Address> list = addressService.findAll();
    return new  Response<List<Address>>(200, "Success", list);   
  }
  
  
  /* ---------------- CREATE NEW ADDRESS ------------------------ */
  @PostMapping(value = "")
  public Response<Address> createAddress(@Valid @RequestBody Address address) {
    Address result = addressService.save(address);
    if (result != null) {
      return new Response<Address>(201, "Created", result); 
    } else {
      return new Response<Address>(400, "Error", result); 
    }
  }
  
  /* ---------------- SEARCH ADDRESSES ------------------------ */
  @GetMapping(value = "/search/{addressFinding}")
  public Response<List<Address>> searchAddresses(@PathVariable String addressFinding) {
      return new  Response<List<Address>>(200, "Success", addressService.searchAddresses(addressFinding));   
  }
  
  
  /* ---------------- UPDATE DISTRICT ------------------------ */
  @PutMapping(value = "/update-address")
  public Response<Address> updateAddress(@RequestBody Address address) {
    Address result = addressService.updateAddress(address);
    if (result != null) {
      return new Response<Address>(201, "Success", result);
    } else {
      return new Response<Address>(400, "Error", result);
    }
  }
  
  /* ---------------- DELETE ADDRESS ------------------------ */
  @DeleteMapping(value = "/{id}" )
  public Response<String> deleteAddressById(@PathVariable String id) {
    if(addressService.delete(id)) {
      return new Response<String>(200, "Deleted", null);   
    }
    else {
      return new Response<String>(400, "Error", null);   
    }
  }
}
