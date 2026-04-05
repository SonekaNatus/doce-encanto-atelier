package com.doceencanto.dto;

import com.doceencanto.model.Pedido;
import com.doceencanto.model.Produto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// ========== PRODUTO DTOs ==========

public class ProdutoDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 150)
        private String nome;

        private String descricao;

        @NotNull(message = "Preço é obrigatório")
        @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
        private BigDecimal precoBase;

        @NotNull(message = "Categoria é obrigatória")
        private Produto.CategoriaProduto categoria;

        private boolean disponivel = true;
        private String imagemUrl;
        private List<String> saboresDisponiveis;
        private List<String> tamanhosDisponiveis;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String nome;
        private String descricao;
        private BigDecimal precoBase;
        private Produto.CategoriaProduto categoria;
        private boolean disponivel;
        private String imagemUrl;
        private List<String> saboresDisponiveis;
        private List<String> tamanhosDisponiveis;
        private LocalDateTime criadoEm;
    }
}
