package com.doceencanto.controller;

import com.doceencanto.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login do painel admin")
    public ResponseEntity<Map<String,String>> login(@Valid @RequestBody LoginRequest req) {
        String token = authService.login(req.getEmail(), req.getSenha());
        return ResponseEntity.ok(Map.of("token", token, "tipo", "Bearer"));
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String senha;
    }
}
