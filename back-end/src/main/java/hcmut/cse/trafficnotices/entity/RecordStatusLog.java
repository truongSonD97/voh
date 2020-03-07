package hcmut.cse.trafficnotices.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document(collection = "record_status_log")
@NoArgsConstructor
public class RecordStatusLog {  
    @Id
    private String id;
    @DBRef
    private User user ;
    @DBRef
    private Record record ;
    private StatusOfRecord status;
    private String content;
    @Field("created_on")
    private String createdOn = Constants.DATETIMEFORMAT_F.format(new Date());
    
}
