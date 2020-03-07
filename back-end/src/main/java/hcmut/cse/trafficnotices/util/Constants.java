package hcmut.cse.trafficnotices.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class Constants {
  public static final String USERNAME = "username";
  public static final String SECRET_KEY = "11111111111111111111111111111111";
  public static final int EXPIRE_TIME = 86400000; // one day
  private static String DATEFORMAT_S = "yyyy-MM-dd" ;
  private static String DATETIMEFORMAT_S = "yyyy-MM-dd HH:mm:ss" ;
  public static final DateFormat DATETIMEFORMAT_F = new SimpleDateFormat(DATETIMEFORMAT_S);
  public static final SimpleDateFormat DATEFORMAT_F = new SimpleDateFormat(DATEFORMAT_S);
  public static final String ERROR_CODE = "errorCode";
  public static final String ERROR_DESC = "errorDesc";
  public static final String DATA = "data";
  public static final String CODE = "code";
  
  public enum StatusOfRecord {
    pending,
    correct,
    accepted,    
    read,
    unread,
    solved,
    removed
  }
  
  public enum RoleOfUser {
    ROLE_ADMIN,
    ROLE_MC,
    ROLE_EDITOR,
    ROLE_DATAENTRY,
    ROLE_DATAENTRY_EDITOR,
    ROLE_TK_MC_BTV
  }
}
