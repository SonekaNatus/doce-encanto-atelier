package com.doceencanto.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroPedido;

    // Dados do cliente
    @Column(nullable = false, length = 150)
    private String nomeCliente;

    @Column(nullable = false, length = 150)
    private String emailCliente;

    @Column(nullable = false, length = 20)
    private String telefoneCliente;

    // Itens do pedido
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens;

    // Dados da encomenda
    @Column(nullable = false)
    private LocalDate dataEntrega;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    // Endereço de entrega (opcional - pode ser retirada)
    private String enderecoEntrega;
    private boolean retiradaNoAtelier = false;

    // Financeiro
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormaPagamento formaPagamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    private LocalDateTime atualizadoEm;

    @PrePersist
    void prePersist() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
        if (status == null) status = StatusPedido.PENDENTE;
    }

    @PreUpdate
    void preUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    public enum StatusPedido {
        PENDENTE,
        CONFIRMADO,
        EM_PRODUCAO,
        PRONTO,
        ENTREGUE,
        CANCELADO
    }

    public enum FormaPagamento {
        PIX,
        CARTAO_CREDITO,
        CARTAO_DEBITO,
        DINHEIRO,
        TRANSFERENCIA
    }
}
