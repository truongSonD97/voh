package hcmut.cse.trafficnotices.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import hcmut.cse.trafficnotices.entity.Address;

public interface AddressRepository extends MongoRepository<Address, String>{
  public Optional<Address> findById(String id);
  public List<Address> findByNameRegex(String name);
  public List<Address> findByName(String name);
  
  @Query(fields="{'id' : 1}")
  List<Address> findByDistrict(String district);
}