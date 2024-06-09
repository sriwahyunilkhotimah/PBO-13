package com.example.library.repository;

import com.example.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;



public interface BookRepository extends JpaRepository<Book, Long> {
    @Override
    <S extends Book> S save(S entity);

    @Override
    Optional<Book> findById(Long id);

    @Override
    List<Book> findAll();

    @Override
    void deleteById(Long id);
}