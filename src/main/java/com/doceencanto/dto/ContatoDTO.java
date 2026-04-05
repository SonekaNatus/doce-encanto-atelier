package com.doceencanto.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

// ========== CONTATO DTO ==========
public class ContatoDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        @NotBlank(message = "Nome é obrigatório")
        private String nome;

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        private String email;

        private String telefone;

        @NotBlank(message = "Assunto é obrigatório")
        private String assunto;

        @NotBlank(message = "Mensagem é obrigatória")
        @Size(min = 10, message = "Mensagem deve ter ao menos 10 caracteres")
        private String mensagem;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String nome;
        private String email;
        private String telefone;
        private String assunto;
        private String mensagem;
        private boolean lido;
        private LocalDateTime enviadoEm;
    }
}
