package hcmut.cse.trafficnotices.entity;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import hcmut.cse.trafficnotices.model.Coordinate;
import hcmut.cse.trafficnotices.util.Constants;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document
@NoArgsConstructor
public class Address{
    @Id
    private String id;
    @NotNull
    @Size(min = 5, message = "Name of Address should have atleast 5 characters")
    private String name;
    @Field("start_coordinate")
    private Coordinate startCoordinate ;
    @Field("end_coordinate")
    private Coordinate endCoordinate ;
    private String direction ;
    private List<String> district ;
    @Field("created_on")
    private String createdOn = Constants.DATETIMEFORMAT_F.format(new Date());
}