package hcmut.cse.trafficnotices.dto;

import hcmut.cse.trafficnotices.entity.Address;
import hcmut.cse.trafficnotices.entity.PersonSharing;
import hcmut.cse.trafficnotices.entity.Reason;
import hcmut.cse.trafficnotices.entity.Speed;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RestRecordDTO {
  private String id;
  private PersonSharing personSharing ;
  private Address address ;
  private Speed speed ;
  private Reason reason;
  private String createdOn;
  private Integer sharesCount ;
  private String notice ;
  private String userCreated;
  private String userRead;
  private String userRemove;
  private String removeReason;
}
