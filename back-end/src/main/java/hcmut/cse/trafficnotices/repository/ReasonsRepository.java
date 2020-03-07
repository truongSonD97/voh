package hcmut.cse.trafficnotices.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import hcmut.cse.trafficnotices.entity.Reason;
public interface ReasonsRepository extends MongoRepository<Reason, String>{
  public Optional<Reason> findById(String id);
  public Reason findByName(String name);
}
