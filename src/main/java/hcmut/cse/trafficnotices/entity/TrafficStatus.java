package hcmut.cse.trafficnotices.entity;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import hcmut.cse.trafficnotices.model.Polyline;
import hcmut.cse.trafficnotices.util.Constants;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document(collection = "traffic_status")
@NoArgsConstructor
public class TrafficStatus {
    @Id 
    private String id;

    private Long segment_id;
    private Long created_date;
    private Integer velocity;
    private Long frame_id;
    private String source_id;
    private Polyline polyline;
    private String color;
    @Field("created_on")
    private String createdOn = Constants.DATETIMEFORMAT_F.format(new Date());
}