package hcmut.cse.trafficnotices.entity;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import hcmut.cse.trafficnotices.util.Constants;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document(collection = "person_sharing")
@NoArgsConstructor
public class PersonSharing {
  @Id
  private String id;
  @NotNull
  @Size(min = 4, message = "Phone Number should have atleast 4 characters")
  @Indexed(unique=true)
  @Field("phone_number")
  private String phoneNumber;
  private String name;
  @Field("created_on")
  private String createdOn = Constants.DATETIMEFORMAT_F.format(new Date());
  
}
