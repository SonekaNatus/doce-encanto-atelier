package com.doceencanto.controller;

import com.doceencanto.dto.ProdutoDTO;
import com.doceencanto.model.Produto;
import com.doceencanto.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Produtos")
public class ProdutoController {
    private final ProdutoService produtoService;

    // ---- Rotas públicas ----
    @GetMapping("/api/produtos")
    @Operation(summary = "Listar produtos disponíveis")
    public ResponseEntity<List<ProdutoDTO.Response>> listar(
            @RequestParam(required = false) Produto.CategoriaProduto categoria) {
        if (categoria != null) return ResponseEntity.ok(produtoService.listarPorCategoria(categoria));
        return ResponseEntity.ok(produtoService.listarDisponiveis());
    }

    @GetMapping("/api/produtos/{id}")
    @Operation(summary = "Detalhe de produto")
    public ResponseEntity<ProdutoDTO.Response> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    // ---- Rotas admin ----
    @GetMapping("/admin/produtos")
    @Operation(summary = "Listar todos os produtos (admin)", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<List<ProdutoDTO.Response>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @PostMapping("/admin/produtos")
    @Operation(summary = "Criar produto", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<ProdutoDTO.Response> criar(@Valid @RequestBody ProdutoDTO.Request dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.criar(dto));
    }

    @PutMapping("/admin/produtos/{id}")
    @Operation(summary = "Atualizar produto", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<ProdutoDTO.Response> atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoDTO.Request dto) {
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }

    @DeleteMapping("/admin/produtos/{id}")
    @Operation(summary = "Deletar produto", security = @SecurityRequirement(name = "bearer-key"))
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
