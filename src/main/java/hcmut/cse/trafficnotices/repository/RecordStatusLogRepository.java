package hcmut.cse.trafficnotices.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import hcmut.cse.trafficnotices.entity.Record;
import hcmut.cse.trafficnotices.entity.RecordStatusLog;
import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;

public interface RecordStatusLogRepository extends MongoRepository<RecordStatusLog, String> {
  
//  @Query(fields="{'user.username' : 0}")
  public Page<RecordStatusLog> findByStatusAndCreatedOnBetween(
      StatusOfRecord status,
      String timeGTE,
      String timeLTE,
      PageRequest request);
  public List<RecordStatusLog> findByRecord(Record record);
  public RecordStatusLog findByRecordAndStatus(Record record, Constants.StatusOfRecord status);
}
