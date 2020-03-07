package hcmut.cse.trafficnotices.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import hcmut.cse.trafficnotices.entity.PersonSharing;

public interface PersonSharingRepository extends MongoRepository<PersonSharing, String>{
  public Optional<PersonSharing> findById(String id);
  public List<PersonSharing> findByPhoneNumber(String phoneNumber);
  public List<PersonSharing> findByName(String name);
  @Query(value = "{'name': {$regex : ?0, $options: 'i'}}")
  public List<PersonSharing> findByNameRegex(String name);
}
