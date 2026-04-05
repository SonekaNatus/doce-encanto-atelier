package com.doceencanto.config;

import com.doceencanto.model.Usuario;
import com.doceencanto.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner init() {
        return args -> {
            if (!usuarioRepository.existsByEmail("admin@doceencanto.com.br")) {
                Usuario admin = Usuario.builder()
                        .nome("Administrador")
                        .email("admin@doceencanto.com.br")
                        .senha(passwordEncoder.encode("admin123"))
                        .role(Usuario.Role.ADMIN)
                        .ativo(true).build();
                usuarioRepository.save(admin);
                log.info("Usuário admin criado: admin@doceencanto.com.br / admin123");
            }
        };
    }
}
