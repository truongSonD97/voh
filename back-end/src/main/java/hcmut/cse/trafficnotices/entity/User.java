package hcmut.cse.trafficnotices.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import hcmut.cse.trafficnotices.util.Constants;
import hcmut.cse.trafficnotices.util.Constants.RoleOfUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(value = { "authorities" })
//@JsonIgnoreProperties(value = { "role", "authorities" })

@Data
@Document
@NoArgsConstructor
public class User {
  
  @Id
  private String id;
  @NotNull
  @Size(min = 5, message = "Username should have atleast 5 characters")
  @Indexed(unique=true)
  private String username;
  @NotNull
  @Size(min = 5, message = "Password should have atleast 5 characters")
  private String password;
  @NotNull
  @Size(min = 5, message = "Name of User should have atleast 5 characters")
  private String name;
  @Field("phone_number")
  @NotNull
  @Size(min = 5, message = "Phone Number have atleast 5 characters")
  private String phoneNumber;
  @Field("created_on")
  private String createdOn = Constants.DATETIMEFORMAT_F.format(new Date());
  private RoleOfUser role;
  
  public List<GrantedAuthority> getAuthorities() {
    List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
    authorities.add(new SimpleGrantedAuthority(role.toString()));
    return authorities;
  }
}
