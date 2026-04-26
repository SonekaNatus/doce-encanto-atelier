package com.doceencanto.controller;

import com.doceencanto.dto.ContatoDTO;
import com.doceencanto.service.ContatoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Contato")
public class ContatoController {
    private final ContatoService contatoService;

    @PostMapping("/api/contato")
    @Operation(summary = "Enviar mensagem de contato")
    public ResponseEntity<Map<String,String>> enviar(@Valid @RequestBody ContatoDTO.Request dto) {
        contatoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensagem", "Mensagem enviada com sucesso!"));
    }

    @GetMapping("/admin/contatos")
    @Operation(summary = "Listar mensagens de contato", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<List<ContatoDTO.Response>> listar(@RequestParam(required = false) Boolean naoLidas) {
        if (Boolean.TRUE.equals(naoLidas)) return ResponseEntity.ok(contatoService.listarNaoLidos());
        return ResponseEntity.ok(contatoService.listarTodos());
    }

    @PatchMapping("/admin/contatos/{id}/lido")
    @Operation(summary = "Marcar mensagem como lida", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<ContatoDTO.Response> marcarLido(@PathVariable Long id) {
        return ResponseEntity.ok(contatoService.marcarComoLido(id));
    }
}
