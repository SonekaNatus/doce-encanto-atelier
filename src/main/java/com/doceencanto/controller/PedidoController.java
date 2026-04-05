package com.doceencanto.controller;

import com.doceencanto.dto.PedidoDTO;
import com.doceencanto.model.Pedido;
import com.doceencanto.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Pedidos")
public class PedidoController {
    private final PedidoService pedidoService;

    @PostMapping("/api/pedidos")
    @Operation(summary = "Criar novo pedido (encomenda)")
    public ResponseEntity<PedidoDTO.Response> criar(@Valid @RequestBody PedidoDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.criar(dto));
    }

    @GetMapping("/api/pedidos/consulta/{numeroPedido}")
    @Operation(summary = "Consultar status do pedido pelo número")
    public ResponseEntity<PedidoDTO.Response> consultarPorNumero(@PathVariable String numeroPedido) {
        return ResponseEntity.ok(pedidoService.buscarPorNumero(numeroPedido));
    }

    @GetMapping("/admin/pedidos")
    @Operation(summary = "Listar todos os pedidos", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<List<PedidoDTO.Response>> listar(
            @RequestParam(required = false) Pedido.StatusPedido status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        if (status != null) return ResponseEntity.ok(pedidoService.listarPorStatus(status));
        if (data != null) return ResponseEntity.ok(pedidoService.listarPorData(data));
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/admin/pedidos/{id}")
    @Operation(summary = "Detalhe do pedido", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<PedidoDTO.Response> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @PatchMapping("/admin/pedidos/{id}/status")
    @Operation(summary = "Atualizar status do pedido", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<PedidoDTO.Response> atualizarStatus(@PathVariable Long id, @Valid @RequestBody PedidoDTO.StatusUpdate dto) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, dto.getStatus()));
    }
}
