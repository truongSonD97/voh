package hcmut.cse.trafficnotices.model;

public class Response<T> {
    private int code;
    private String message;
    private T data;

    public Response(int code, String message, T data){
        this.code = code;
        this.data = data;
        this.message = message;
    }
    
    public Response() {
      super();
    }

    public int getCode(){
        return code;
    }
    public void setCode(int code){
        this.code = code;
    }

    public String getMessage(){
        return message;
    }
    public void setMessage(String message){
        this.message = message;
    }

    public T getData(){
        return data;
    }
    public void setData( T data){
        this.data = data;
    }
}