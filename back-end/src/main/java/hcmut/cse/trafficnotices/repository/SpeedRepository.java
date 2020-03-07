package hcmut.cse.trafficnotices.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import hcmut.cse.trafficnotices.entity.Speed;

public interface SpeedRepository extends MongoRepository<Speed, String>{
  public Optional<Speed> findById(String id);
}
