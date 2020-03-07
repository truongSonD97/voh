package hcmut.cse.trafficnotices.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.entity.Address;
import hcmut.cse.trafficnotices.repository.AddressRepository;

@Service
public class AddressService {
  
  @Autowired
  private AddressRepository addressRepository;
  
  public List<Address> findAll(){
    return addressRepository.findAll(Sort.by(Sort.Direction.DESC, "created_on"));
  }
  
  public Address save(Address address) {
    try {
      return addressRepository.save(address);
    } catch (Exception e) {
      return null;
    }
  }
  
  public List<Address> searchAddresses(String addressFinding) {
    return addressRepository.findByName(addressFinding);
  }

  
  public Address updateAddress(Address address) {
    Optional<Address> result = addressRepository.findById(address.getId());
    if(result != null && result.isPresent()) {
      if(address.getDistrict() != null) {
        result.get().setDistrict(address.getDistrict());
      }
      if(address.getName() != null) {
        result.get().setName(address.getName());
      }
      if(address.getDirection() != null) {
        result.get().setDirection(address.getDirection());
      }
      if(address.getStartCoordinate() != null) {
        result.get().setStartCoordinate(address.getStartCoordinate());
      }
      if(address.getEndCoordinate() != null) {
        result.get().setEndCoordinate(address.getEndCoordinate());
      }
      try {
        return addressRepository.save(result.get());
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return null;
      }
    }
    else
      return null;
  }
  
  public boolean delete(String id) {
  Optional<Address> address = addressRepository.findById(id);
  if(address != null && address.isPresent()) {
    addressRepository.deleteById(id);
    return true;
  }else
    return false;
  }
  
  public List<Address> findByDistrict(String district) {
    return addressRepository.findByDistrict(district);
  }
}
