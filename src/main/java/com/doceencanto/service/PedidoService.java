package com.doceencanto.service;

import com.doceencanto.dto.*;
import com.doceencanto.exception.*;
import com.doceencanto.model.*;
import com.doceencanto.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository repo;
    private final ProdutoService produtoService;

    @Transactional
    public PedidoDTO.Response criar(PedidoDTO.Request dto) {
        Pedido pedido = Pedido.builder()
                .numeroPedido(gerarNumeroPedido())
                .nomeCliente(dto.getNomeCliente())
                .emailCliente(dto.getEmailCliente())
                .telefoneCliente(dto.getTelefoneCliente())
                .dataEntrega(dto.getDataEntrega())
                .observacoes(dto.getObservacoes())
                .enderecoEntrega(dto.getEnderecoEntrega())
                .retiradaNoAtelier(dto.isRetiradaNoAtelier())
                .formaPagamento(dto.getFormaPagamento())
                .status(Pedido.StatusPedido.PENDENTE)
                .build();

        List<ItemPedido> itens = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoDTO.Request itemDto : dto.getItens()) {
            Produto produto = produtoService.buscarEntidade(itemDto.getProdutoId());
            BigDecimal preco = produto.getPrecoBase();
            BigDecimal sub = preco.multiply(BigDecimal.valueOf(itemDto.getQuantidade()));
            ItemPedido item = ItemPedido.builder()
                    .pedido(pedido).produto(produto)
                    .quantidade(itemDto.getQuantidade())
                    .sabor(itemDto.getSabor()).tamanho(itemDto.getTamanho())
                    .personalizacao(itemDto.getPersonalizacao())
                    .precoUnitario(preco).subtotal(sub).build();
            itens.add(item);
            total = total.add(sub);
        }

        pedido.setItens(itens);
        pedido.setValorTotal(total);
        return toResponse(repo.save(pedido));
    }

    public PedidoDTO.Response buscarPorNumero(String numero) {
        return toResponse(repo.findByNumeroPedido(numero)
                .orElseThrow(() -> new NotFoundException("Pedido não encontrado: " + numero)));
    }

    public PedidoDTO.Response buscarPorId(Long id) {
        return toResponse(repo.findById(id).orElseThrow(() -> new NotFoundException("Pedido não encontrado")));
    }

    public List<PedidoDTO.Response> listarTodos() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public List<PedidoDTO.Response> listarPorStatus(Pedido.StatusPedido status) {
        return repo.findByStatus(status).stream().map(this::toResponse).toList();
    }

    public List<PedidoDTO.Response> listarPorData(LocalDate data) {
        return repo.findByDataEntrega(data).stream().map(this::toResponse).toList();
    }

    @Transactional
    public PedidoDTO.Response atualizarStatus(Long id, Pedido.StatusPedido novoStatus) {
        Pedido pedido = repo.findById(id).orElseThrow(() -> new NotFoundException("Pedido não encontrado"));
        pedido.setStatus(novoStatus);
        return toResponse(repo.save(pedido));
    }

    private String gerarNumeroPedido() {
        String data = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%04d", new Random().nextInt(9999));
        return "DE-" + data + "-" + random;
    }

    private PedidoDTO.Response toResponse(Pedido p) {
        List<ItemPedidoDTO.Response> itensResp = p.getItens() == null ? List.of() :
            p.getItens().stream().map(i -> ItemPedidoDTO.Response.builder()
                .id(i.getId()).produtoId(i.getProduto().getId())
                .nomeProduto(i.getProduto().getNome())
                .quantidade(i.getQuantidade()).sabor(i.getSabor())
                .tamanho(i.getTamanho()).personalizacao(i.getPersonalizacao())
                .precoUnitario(i.getPrecoUnitario()).subtotal(i.getSubtotal()).build()).toList();

        return PedidoDTO.Response.builder()
                .id(p.getId()).numeroPedido(p.getNumeroPedido())
                .nomeCliente(p.getNomeCliente()).emailCliente(p.getEmailCliente())
                .telefoneCliente(p.getTelefoneCliente()).dataEntrega(p.getDataEntrega())
                .observacoes(p.getObservacoes()).enderecoEntrega(p.getEnderecoEntrega())
                .retiradaNoAtelier(p.isRetiradaNoAtelier()).valorTotal(p.getValorTotal())
                .formaPagamento(p.getFormaPagamento()).status(p.getStatus())
                .itens(itensResp).criadoEm(p.getCriadoEm()).build();
    }
}
