package backend.FinSight.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String emailOrUsername;

    private String password;

    private String role;

}