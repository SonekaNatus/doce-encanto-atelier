package com.doceencanto.repository;

import com.doceencanto.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByNumeroPedido(String numeroPedido);
    List<Pedido> findByStatus(Pedido.StatusPedido status);
    List<Pedido> findByEmailClienteIgnoreCase(String email);
    List<Pedido> findByDataEntregaBetween(LocalDate inicio, LocalDate fim);
    List<Pedido> findByDataEntregaAndStatus(LocalDate data, Pedido.StatusPedido status);

    @Query("SELECT p FROM Pedido p WHERE p.dataEntrega = :data ORDER BY p.criadoEm ASC")
    List<Pedido> findByDataEntrega(LocalDate data);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.status = :status")
    Long countByStatus(Pedido.StatusPedido status);
}
