package hcmut.cse.trafficnotices.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import hcmut.cse.trafficnotices.entity.TrafficStatus;

public interface TrafficStatusRepository extends MongoRepository<TrafficStatus, String>{
  public Optional<TrafficStatus> findById(String id);
}
