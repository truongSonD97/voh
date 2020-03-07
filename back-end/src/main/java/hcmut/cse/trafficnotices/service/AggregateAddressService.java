package hcmut.cse.trafficnotices.service;

import java.text.ParseException;
import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import net.minidev.json.JSONObject;
import hcmut.cse.trafficnotices.util.Constants;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class AggregateAddressService {
  
  @Autowired
  private MongoTemplate mongoTemplate;
  
  public AggregationResults<JSONObject> aggAddressWith(String from ,String to ,String addressId ,String fieldName) {
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(from);
      endDate = Constants.DATEFORMAT_F.parse(to);
    } catch (ParseException e) {
      e.printStackTrace();
    }
    Criteria c = new Criteria().andOperator(
        Criteria.where("address.$id").is(new ObjectId(addressId)),
        Criteria.where("created_on").gte(Constants.DATEFORMAT_F.format(startDate) + " 00:00:00"), 
        Criteria.where("created_on").lte(Constants.DATEFORMAT_F.format(endDate) + " 23:59:59"));
        
    Aggregation aggregation = Aggregation.newAggregation(
        match(c),
        group(fieldName).count().as("count").first(fieldName).as(fieldName),
        project("count",fieldName).andExclude("_id"),
        sort(Direction.DESC, "count"));
    
    return mongoTemplate.aggregate(aggregation, "record", JSONObject.class);
  }
  
  
  public AggregationResults<JSONObject> aggAddressWithDays(String from ,String to ,String addressId) {
    Date startDate = null ,endDate = null;
    try {
      startDate = Constants.DATEFORMAT_F.parse(from);
      endDate = Constants.DATEFORMAT_F.parse(to);
    } catch (ParseException e) {
      e.printStackTrace();
    }
    Criteria c = new Criteria().andOperator(
        Criteria.where("address.$id").is(new ObjectId(addressId)),
        Criteria.where("created_on").gte(Constants.DATEFORMAT_F.format(startDate) + " 00:00:00"), 
        Criteria.where("created_on").lte(Constants.DATEFORMAT_F.format(endDate) + " 23:59:59"));
        
    Aggregation aggregation = Aggregation.newAggregation(
        match(c),
        project().and("created_on").substring(0, 10).as("day"),
        group("day").count().as("count").first("day").as("day"),
        project("count","day").andExclude("_id"),
        sort(Direction.DESC, "day"));
    
    return mongoTemplate.aggregate(aggregation, "record", JSONObject.class);
  }
  
    
  public AggregationResults<JSONObject> aggAddressHasSpeed(String from ,String to ,String speedId, String reasonId) {
    Date startDate = null ,endDate = null;
      try {
        startDate = Constants.DATEFORMAT_F.parse(from);
        endDate = Constants.DATEFORMAT_F.parse(to);
      } catch (ParseException e) {
        e.printStackTrace();
      }
    Criteria c = new Criteria().andOperator(
        Criteria.where("speed.$id").is(new ObjectId(speedId)),
        Criteria.where("reason.$id").is(new ObjectId(reasonId)),
        Criteria.where("created_on").gte(Constants.DATEFORMAT_F.format(startDate) + " 00:00:00"), 
        Criteria.where("created_on").lte(Constants.DATEFORMAT_F.format(endDate) + " 23:59:59"));
    
    Aggregation aggregation = Aggregation.newAggregation(        
        match(c) ,
        group("address").count().as("count").first("address").as("address"),
        project("count","address").andExclude("_id"),
        sort(Direction.DESC, "count"),
        limit(10)
        );
    
    return mongoTemplate.aggregate(aggregation, "record", JSONObject.class);
  }  
    
}
