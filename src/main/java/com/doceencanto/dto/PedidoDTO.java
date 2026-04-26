package com.doceencanto.dto;

import com.doceencanto.model.Pedido;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        @NotBlank(message = "Nome do cliente é obrigatório")
        private String nomeCliente;

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        private String emailCliente;

        @NotBlank(message = "Telefone é obrigatório")
        private String telefoneCliente;

        @NotNull(message = "Data de entrega é obrigatória")
        @Future(message = "Data de entrega deve ser no futuro")
        private LocalDate dataEntrega;

        private String observacoes;
        private String enderecoEntrega;
        private boolean retiradaNoAtelier = false;

        @NotNull(message = "Forma de pagamento é obrigatória")
        private Pedido.FormaPagamento formaPagamento;

        @NotEmpty(message = "O pedido deve ter ao menos um item")
        @Valid
        private List<ItemPedidoDTO.Request> itens;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String numeroPedido;
        private String nomeCliente;
        private String emailCliente;
        private String telefoneCliente;
        private LocalDate dataEntrega;
        private String observacoes;
        private String enderecoEntrega;
        private boolean retiradaNoAtelier;
        private BigDecimal valorTotal;
        private Pedido.FormaPagamento formaPagamento;
        private Pedido.StatusPedido status;
        private List<ItemPedidoDTO.Response> itens;
        private LocalDateTime criadoEm;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdate {
        @NotNull(message = "Status é obrigatório")
        private Pedido.StatusPedido status;
    }
}
