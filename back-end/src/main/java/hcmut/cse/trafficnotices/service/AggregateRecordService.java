package hcmut.cse.trafficnotices.service;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import hcmut.cse.trafficnotices.model.Output;
import hcmut.cse.trafficnotices.model.OutputSecond;
import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;


@Service
public class AggregateRecordService {
  
  @Autowired
  private MongoTemplate mongoTemplate;
  
  private ArrayList<StatusOfRecord> recordStatuslist;
 
  
  public AggregateRecordService() {
    super();
    ArrayList<StatusOfRecord> recordStatuslist = new ArrayList<StatusOfRecord>() ;
    recordStatuslist.add(StatusOfRecord.solved);
    recordStatuslist.add(StatusOfRecord.unread);  
    this.recordStatuslist = recordStatuslist;
  }

  public AggregationResults<Output> aggregateByReasons(String from ,String to) {
    Date startDate = null ,endDate = null;
      try {
        startDate = Constants.DATEFORMAT_F.parse(from);//"2019-07-1"
        endDate = Constants.DATEFORMAT_F.parse(to);//"2019-07-15"
      } catch (ParseException e) {
        e.printStackTrace();
      }
    Criteria c = new Criteria().andOperator(
        Criteria.where("created_on").gte(Constants.DATEFORMAT_F.format(startDate) + " 00:00:00"), 
        Criteria.where("created_on").lte(Constants.DATEFORMAT_F.format(endDate) + " 23:59:59"),
        Criteria.where("status").in(recordStatuslist));
    Aggregation aggregation = Aggregation.newAggregation(
        match(c), 
        group("reason").count().as("count").first("reason").as("content"),
        sort(Direction.DESC, "count"));
    AggregationResults<Output> list= mongoTemplate.aggregate(aggregation,"record", Output.class);
    return list ;
  }

  public AggregationResults<Output> aggregateByReasons() {
    Aggregation aggregation = Aggregation.newAggregation(
        match(new Criteria().andOperator(Criteria.where("status").in(recordStatuslist))), 
        group("reason").count().as("count").first("reason").as("content"),
        sort(Direction.DESC, "count"));
    AggregationResults<Output> list= mongoTemplate.aggregate(aggregation,"record", Output.class);
    return list ;
  }

  public AggregationResults<Output> aggregateByDays(String from ,String to ,SortOperation sortValue) {
    Date startDate = null ,endDate = null;
 
      try {
        startDate = Constants.DATEFORMAT_F.parse(from);//"2019-07-1"
        endDate = Constants.DATEFORMAT_F.parse(to);//"2019-07-15"
      } catch (ParseException e) {
        e.printStackTrace();
      }
    Criteria c = new Criteria().andOperator(
        Criteria.where("created_on").gte(Constants.DATEFORMAT_F.format(startDate) + " 00:00:00"), 
        Criteria.where("created_on").lte(Constants.DATEFORMAT_F.format(endDate) + " 23:59:59"),
        Criteria.where("status").in(recordStatuslist));
    MatchOperation matchStage = Aggregation.match(c);
    ProjectionOperation project = Aggregation.project()
        .and("created_on").substring(0, 10).as("day")
        .and("created_on").substring(2, 4).as("month");
    GroupOperation group = Aggregation.group("day","month").count().as("count").first("day").as("content");
    Aggregation aggregation = Aggregation.newAggregation(matchStage,project,group,sortValue);
    return mongoTemplate.aggregate(aggregation,"record", Output.class );
  }
  
  public AggregationResults<OutputSecond> aggregateByStatus(String from ,String to ,SortOperation sortValue) {
    Date startDate = null ,endDate = null;
      try {
        startDate = Constants.DATEFORMAT_F.parse(from);//"1-07-2019"
        endDate = Constants.DATEFORMAT_F.parse(to);//"15-07-2019"
      } catch (ParseException e) {
        e.printStackTrace();
      }
    Criteria c = new Criteria().andOperator(
        Criteria.where("created_on").gte(Constants.DATEFORMAT_F.format(startDate) + " 00:00:00"), 
        Criteria.where("created_on").lte(Constants.DATEFORMAT_F.format(endDate) + " 23:59:59"),
        Criteria.where("status").in(recordStatuslist));
    MatchOperation matchStage = Aggregation.match(c);
    ProjectionOperation project = Aggregation.project()
        .and("created_on").substring(0, 10).as("day")
        .and("status").as("status");
    GroupOperation group = Aggregation.group("day","status").count().as("count").first("day").as("day")
        .first("status").as("status");
    Aggregation aggregation = Aggregation.newAggregation(matchStage,project,group,sortValue);
    AggregationResults<OutputSecond> list= mongoTemplate.aggregate(aggregation,"record", OutputSecond.class );
    return list ;
  }
  
}
