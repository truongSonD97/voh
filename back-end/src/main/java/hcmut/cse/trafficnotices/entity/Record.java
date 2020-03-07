package hcmut.cse.trafficnotices.entity;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.Constants.StatusOfRecord;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Document
@NoArgsConstructor
public class Record {
  @Id
  private String id;
  @DBRef
  private PersonSharing personSharing ;
  @NotNull
  @DBRef
  private Address address ;
  @DBRef
  private Speed speed ;
  @DBRef
  private Reason reason;
  private Integer distance ;
  @Field("created_on")
  private String createdOn = Constants.DATETIMEFORMAT_F.format(new Date());
  @Field("shares_count")
  private Integer sharesCount = 0;
  private String notice = "";
  private StatusOfRecord status = StatusOfRecord.pending;
  private Boolean priority = false;
  
}
