package hcmut.cse.trafficnotices.model;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Segment{
    private Long id;
    private Polyline polyline;
    private Long streetId;
    private Integer length;

}