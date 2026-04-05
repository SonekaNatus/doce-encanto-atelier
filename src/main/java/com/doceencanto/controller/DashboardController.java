package com.doceencanto.controller;

import com.doceencanto.model.Pedido;
import com.doceencanto.repository.PedidoRepository;
import com.doceencanto.service.ContatoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
public class DashboardController {
    private final PedidoRepository pedidoRepository;
    private final ContatoService contatoService;

    @GetMapping
    @Operation(summary = "Resumo do painel admin", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<Map<String,Object>> resumo() {
        return ResponseEntity.ok(Map.of(
            "totalPedidos", pedidoRepository.count(),
            "pedidosPendentes", pedidoRepository.countByStatus(Pedido.StatusPedido.PENDENTE),
            "pedidosConfirmados", pedidoRepository.countByStatus(Pedido.StatusPedido.CONFIRMADO),
            "pedidosEmProducao", pedidoRepository.countByStatus(Pedido.StatusPedido.EM_PRODUCAO),
            "pedidosProntos", pedidoRepository.countByStatus(Pedido.StatusPedido.PRONTO),
            "pedidosEntregues", pedidoRepository.countByStatus(Pedido.StatusPedido.ENTREGUE),
            "mensagensNaoLidas", contatoService.contarNaoLidos()
        ));
    }
}
