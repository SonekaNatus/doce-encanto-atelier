package com.doceencanto.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoBase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaProduto categoria;

    @Column(nullable = false)
    private boolean disponivel = true;

    @Column(length = 500)
    private String imagemUrl;

    @ElementCollection
    @CollectionTable(name = "produto_sabores", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "sabor")
    private List<String> saboresDisponiveis;

    @ElementCollection
    @CollectionTable(name = "produto_tamanhos", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "tamanho")
    private List<String> tamanhosDisponiveis;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    private LocalDateTime atualizadoEm;

    @PrePersist
    void prePersist() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    public enum CategoriaProduto {
        BOLO_DECORADO,
        BOLO_NO_POTE,
        CUPCAKE,
        BRIGADEIRO,
        TORTA,
        DOCINHOS,
        OUTROS
    }
}
