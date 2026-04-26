package com.doceencanto.service;

import com.doceencanto.dto.ProdutoDTO;
import com.doceencanto.exception.*;
import com.doceencanto.model.Produto;
import com.doceencanto.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    private final ProdutoRepository repo;

    public List<ProdutoDTO.Response> listarDisponiveis() {
        return repo.findByDisponivel(true).stream().map(this::toResponse).toList();
    }

    public List<ProdutoDTO.Response> listarTodos() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public List<ProdutoDTO.Response> listarPorCategoria(Produto.CategoriaProduto cat) {
        return repo.findByCategoriaAndDisponivel(cat, true).stream().map(this::toResponse).toList();
    }

    public ProdutoDTO.Response buscarPorId(Long id) {
        return toResponse(repo.findById(id).orElseThrow(() -> new NotFoundException("Produto não encontrado")));
    }

    public ProdutoDTO.Response criar(ProdutoDTO.Request dto) {
        Produto p = Produto.builder()
                .nome(dto.getNome()).descricao(dto.getDescricao())
                .precoBase(dto.getPrecoBase()).categoria(dto.getCategoria())
                .disponivel(dto.isDisponivel()).imagemUrl(dto.getImagemUrl())
                .saboresDisponiveis(dto.getSaboresDisponiveis())
                .tamanhosDisponiveis(dto.getTamanhosDisponiveis()).build();
        return toResponse(repo.save(p));
    }

    public ProdutoDTO.Response atualizar(Long id, ProdutoDTO.Request dto) {
        Produto p = repo.findById(id).orElseThrow(() -> new NotFoundException("Produto não encontrado"));
        p.setNome(dto.getNome()); p.setDescricao(dto.getDescricao());
        p.setPrecoBase(dto.getPrecoBase()); p.setCategoria(dto.getCategoria());
        p.setDisponivel(dto.isDisponivel()); p.setImagemUrl(dto.getImagemUrl());
        p.setSaboresDisponiveis(dto.getSaboresDisponiveis());
        p.setTamanhosDisponiveis(dto.getTamanhosDisponiveis());
        return toResponse(repo.save(p));
    }

    public void deletar(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Produto não encontrado");
        repo.deleteById(id);
    }

    public Produto buscarEntidade(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Produto id " + id + " não encontrado"));
    }

    private ProdutoDTO.Response toResponse(Produto p) {
        return ProdutoDTO.Response.builder()
                .id(p.getId()).nome(p.getNome()).descricao(p.getDescricao())
                .precoBase(p.getPrecoBase()).categoria(p.getCategoria())
                .disponivel(p.isDisponivel()).imagemUrl(p.getImagemUrl())
                .saboresDisponiveis(p.getSaboresDisponiveis())
                .tamanhosDisponiveis(p.getTamanhosDisponiveis())
                .criadoEm(p.getCriadoEm()).build();
    }
}
