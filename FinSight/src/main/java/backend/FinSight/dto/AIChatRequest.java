package backend.FinSight.dto;

public class AIChatRequest {

    private String userId;
    private String message;

    public AIChatRequest() {
    }

    public AIChatRequest(String userId, String message) {
        this.userId = userId;
        this.message = message;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}