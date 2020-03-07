package hcmut.cse.trafficnotices.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Coordinate {
	String longitude ;
	String latitude ;

  @Override
  public String toString() {
	return  "Lng : "+this.longitude +" Lat : " + this.latitude  ;
  }
	
}
