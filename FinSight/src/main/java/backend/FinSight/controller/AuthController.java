package backend.FinSight.controller;

import backend.FinSight.dto.LoginRequest;
import backend.FinSight.dto.LoginResponse;
import backend.FinSight.dto.RegisterRequest;
import backend.FinSight.model.User;
import backend.FinSight.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public User register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    // LOGIN
    @PostMapping("/manual-login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
    // GOOGLE LOGIN SUCCESS
    @GetMapping("/google/success")
    public Object googleLoginSuccess(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        if (oauthUser == null) {
            return "Google login failed";
        }

        return oauthUser.getAttributes();
    }
}