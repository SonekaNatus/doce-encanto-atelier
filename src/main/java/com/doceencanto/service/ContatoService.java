package com.doceencanto.service;

import com.doceencanto.dto.ContatoDTO;
import com.doceencanto.exception.NotFoundException;
import com.doceencanto.model.Contato;
import com.doceencanto.repository.ContatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContatoService {
    private final ContatoRepository repo;

    public ContatoDTO.Response salvar(ContatoDTO.Request dto) {
        Contato c = Contato.builder().nome(dto.getNome()).email(dto.getEmail())
                .telefone(dto.getTelefone()).assunto(dto.getAssunto())
                .mensagem(dto.getMensagem()).lido(false).build();
        return toResponse(repo.save(c));
    }

    public List<ContatoDTO.Response> listarTodos() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public List<ContatoDTO.Response> listarNaoLidos() {
        return repo.findByLido(false).stream().map(this::toResponse).toList();
    }

    public ContatoDTO.Response marcarComoLido(Long id) {
        Contato c = repo.findById(id).orElseThrow(() -> new NotFoundException("Mensagem não encontrada"));
        c.setLido(true);
        return toResponse(repo.save(c));
    }

    public long contarNaoLidos() { return repo.countByLido(false); }

    private ContatoDTO.Response toResponse(Contato c) {
        return ContatoDTO.Response.builder().id(c.getId()).nome(c.getNome())
                .email(c.getEmail()).telefone(c.getTelefone()).assunto(c.getAssunto())
                .mensagem(c.getMensagem()).lido(c.isLido()).enviadoEm(c.getEnviadoEm()).build();
    }
}
