package hcmut.cse.trafficnotices.dto;

import hcmut.cse.trafficnotices.util.Constants.RoleOfUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
  private String id;
  private String username;
  private String name;
  private String phoneNumber;
  private String createdOn;
  private RoleOfUser role;
}
