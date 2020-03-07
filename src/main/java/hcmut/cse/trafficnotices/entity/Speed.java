package hcmut.cse.trafficnotices.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import hcmut.cse.trafficnotices.util.Constants;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document
@NoArgsConstructor
public class Speed {

    @Id
    private String id;
    private String name ;
    private Integer value ;
    @Field("created_on")
    private String createdOn = Constants.DATETIMEFORMAT_F.format(new Date());  
    
}
