package hcmut.cse.trafficnotices.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Polyline{
    private String type;
    private ArrayList<List<Long>> coordinates;

}