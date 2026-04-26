package com.doceencanto.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

public class ItemPedidoDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        @NotNull(message = "Produto é obrigatório")
        private Long produtoId;

        @NotNull(message = "Quantidade é obrigatória")
        @Min(value = 1, message = "Quantidade mínima é 1")
        private Integer quantidade;

        private String sabor;
        private String tamanho;
        private String personalizacao;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private Long produtoId;
        private String nomeProduto;
        private Integer quantidade;
        private String sabor;
        private String tamanho;
        private String personalizacao;
        private BigDecimal precoUnitario;
        private BigDecimal subtotal;
    }
}
