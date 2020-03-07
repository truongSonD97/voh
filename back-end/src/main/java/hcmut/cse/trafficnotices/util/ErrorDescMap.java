package hcmut.cse.trafficnotices.util;

public enum ErrorDescMap {
    FAILURE_EXCEPTION(-1),
    SUCCESSFUL(200),
    CREATED(201),
    FAILURE_USERNAME_EXISTED(400),
    FAILURE_PHONE_NUMBER_EXISTED(400);

    private final int value;

    private ErrorDescMap(int value){
        this.value = value;
    }
    public int getValue() {
        return value;
    }
}
