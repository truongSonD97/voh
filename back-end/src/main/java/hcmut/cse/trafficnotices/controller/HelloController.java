package hcmut.cse.trafficnotices.controller;

import java.util.Date;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import hcmut.cse.trafficnotices.model.Response;
import hcmut.cse.trafficnotices.util.Constants;

@RestController
@RequestMapping("")
public class HelloController {
  /* ---------------- GET ALL REASON ------------------------ */
  @GetMapping(value = "")
  public Response<String> getNothing() {
    String time = Constants.DATETIMEFORMAT_F.format(new Date());
    return new Response<String>(200, "Success", "Wellcome to VOH server V1.2 Clock: " + time);
  }
  
  @GetMapping(value = "/api")
  public Response<String> getNothing_2() {
    return new Response<String>(200, "Success", "Wellcome to VOH APIES v1.2");
  }
}
