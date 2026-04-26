package com.doceencanto.repository;

import com.doceencanto.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Long> {
    List<Contato> findByLido(boolean lido);
    long countByLido(boolean lido);
}
