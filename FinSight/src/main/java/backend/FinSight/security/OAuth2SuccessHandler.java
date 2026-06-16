package backend.FinSight.security;

import backend.FinSight.model.User;
import backend.FinSight.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.security.oauth2.core.user.OAuth2User;

import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        // GOOGLE DATA

        String email =
                oauthUser.getAttribute("email");

        String name =
                oauthUser.getAttribute("name");

        // CHECK USER EXISTS

        User user = userRepository
                .findByEmail(email)
                .orElseGet(() -> {

                    User newUser = new User();

                    newUser.setEmail(email);

                    newUser.setName(name);

                    // AUTO USERNAME
                    newUser.setUsername(
                            email.split("@")[0]
                                    + UUID.randomUUID()
                                    .toString()
                                    .substring(0, 5)
                    );

                    // RANDOM PASSWORD
                    newUser.setPassword(
                            UUID.randomUUID().toString()
                    );

                    // DEFAULT ROLE
                    newUser.setRole("USER");

                    return userRepository.save(newUser);
                });

        // GENERATE JWT TOKEN

        String token =
                jwtService.generateToken(
                        user.getUsername(),
                        user.getRole()
                );


        String redirectUrl =
                "http://localhost:5173/oauth-success"
                        + "?token=" + token
                        + "&username=" + user.getUsername()
                        + "&name=" + user.getName()
                        + "&role=" + user.getRole();

        response.sendRedirect(redirectUrl);
    }
}