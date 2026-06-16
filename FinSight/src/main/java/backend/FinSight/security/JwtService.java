package backend.FinSight.security;

import io.jsonwebtoken.Claims;

import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.stereotype.Service;

import java.util.Date;

import java.util.HashMap;

import java.util.Map;

@Service
public class JwtService {

    // SECRET KEY

    private final String SECRET =
            "myVeryStrongSecretKeyForFinSightProject2026SecureKey";

    // =========================
    // GENERATE JWT TOKEN
    // =========================

    public String generateToken(
            String username,
            String role
    ) {

        Map<String, Object> claims =
                new HashMap<>();

        // ADD ROLE IN TOKEN

        claims.put("role", role);

        return Jwts.builder()

                .setClaims(claims)

                .setSubject(username)

                .setIssuedAt(
                        new Date()
                )

                .setExpiration(

                        new Date(
                                System.currentTimeMillis()
                                        + 1000 * 60 * 60
                        )
                )

                .signWith(
                        SignatureAlgorithm.HS256,
                        SECRET.getBytes()
                )

                .compact();
    }

    // =========================
    // EXTRACT USERNAME
    // =========================

    public String extractUsername(
            String token
    ) {

        return extractClaims(token)
                .getSubject();
    }

    // =========================
    // EXTRACT ROLE
    // =========================

    public String extractRole(
            String token
    ) {

        return extractClaims(token)
                .get(
                        "role",
                        String.class
                );
    }

    // =========================
    // EXTRACT ALL CLAIMS
    // =========================

    private Claims extractClaims(
            String token
    ) {

        return Jwts.parser()

                .setSigningKey(
                        SECRET.getBytes()
                )

                .parseClaimsJws(token)

                .getBody();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================

    public boolean isTokenValid(
            String token,
            String username
    ) {

        String extractedUsername =
                extractUsername(token);

        return extractedUsername
                .equals(username)
                && !isTokenExpired(token);
    }

    // =========================
    // CHECK TOKEN EXPIRATION
    // =========================

    private boolean isTokenExpired(
            String token
    ) {

        return extractClaims(token)

                .getExpiration()

                .before(new Date());
    }
}
