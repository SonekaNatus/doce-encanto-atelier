package com.doceencanto.repository;

import com.doceencanto.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByDisponivel(boolean disponivel);
    List<Produto> findByCategoria(Produto.CategoriaProduto categoria);
    List<Produto> findByCategoriaAndDisponivel(Produto.CategoriaProduto categoria, boolean disponivel);
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
