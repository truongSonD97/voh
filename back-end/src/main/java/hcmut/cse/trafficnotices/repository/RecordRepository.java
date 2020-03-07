package hcmut.cse.trafficnotices.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import hcmut.cse.trafficnotices.entity.Address;
import hcmut.cse.trafficnotices.entity.PersonSharing;
import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;

public interface RecordRepository extends MongoRepository<Record, String>{
  public Optional<Record> findById(String id);
  public Long countByAddressId(String id);
  public Long countByReasonId(String id);
  public Long countByPersonSharingId(String id);
  
  public Page<Record> findByStatusAndCreatedOnBetween(
              StatusOfRecord status,
              String timeGTE,
              String timeLTE,
              PageRequest request);
  
  public Page<Record> findByCreatedOnBetween(
              String timeGTE ,
              String timeLTE ,
              PageRequest request);
  
  public Page<Record> findByStatus(StatusOfRecord status, PageRequest request );
  
  public List<Record> findByCreatedOnBetween(
      String timeGTE,
      String timeLTE);
  
  public List<Record> findByStatusNotInAndCreatedOnBetween(
      List<StatusOfRecord> status,
      String timeGTE,
      String timeLTE);
  
  public List<Record> findByAddressIdAndCreatedOnBetween(
      String id,
      String timeGTE,
      String timeLTE);
  
  public List<Record> findByAddressIdAndStatusNotInAndCreatedOnBetween(
      String id,
      List<StatusOfRecord> status,
      String timeGTE,
      String timeLTE);
  
  public Page<Record> findBySpeedAndStatusAndCreatedOnBetween(
      String id,
      StatusOfRecord status,
      String timeGTE,
      String timeLTE,
      PageRequest request);
  
//@Query(value = "{ 'address.$id' : { $in : ?0 } }",
//fields="{'distance' : 0,'status':0,'shares_count':0,'id':0}")
  public Page<Record> findByAddressInAndStatusAndCreatedOnBetween(
      List<Address> address, 
      StatusOfRecord status,
      String timeGTE,
      String timeLTE,
      PageRequest request);
  
  public Page<Record> findByAddressInAndSpeedAndStatusAndCreatedOnBetween(
      List<Address> address, 
      String id,
      StatusOfRecord status,
      String timeGTE,
      String timeLTE,
      PageRequest request);
  
  public List<Record> findByAddressId(String id);
  
  public List<Record> findByPersonSharingIn(List<PersonSharing> personSharings);
  
}
