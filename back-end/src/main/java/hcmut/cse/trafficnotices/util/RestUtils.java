package hcmut.cse.trafficnotices.util;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import hcmut.cse.trafficnotices.model.Response;

public class RestUtils {
  static public Response<Object> createRestOutput(Map<String, Object> outputMap) {
    Response<Object> output = new Response<>();
    ErrorDescMap errorCode = (ErrorDescMap) outputMap.get(Constants.ERROR_CODE);
    String errorDesc = errorCode.name();
    if(errorCode != null && (errorCode.getValue() == 201 || errorCode.getValue() == 200)){
      output.setData(outputMap.get(Constants.DATA));
      output.setCode(errorCode.getValue());
      output.setMessage(errorCode.name());
    }else{
      output.setCode(errorCode.getValue());
      output.setMessage(StringUtils.isNotBlank(errorDesc)? errorDesc: errorCode.name());
      output.setData(outputMap.get(Constants.DATA)!=null?outputMap.get(Constants.DATA):null);
    }
    return output;
  }
  static public Map<String, Object> createInvalidOutput(Map<String, Object> output, ErrorDescMap errorCode ) {
    output.put(Constants.ERROR_CODE, errorCode);
    output.put(Constants.ERROR_DESC, errorCode.name());
    return output;
  }
}
