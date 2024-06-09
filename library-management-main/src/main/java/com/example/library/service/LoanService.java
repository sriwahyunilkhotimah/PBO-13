package com.example.library.service;

import com.example.library.entity.Book;
import com.example.library.entity.Loan;
import com.example.library.entity.Member;
import com.example.library.repository.BookRepository;
import com.example.library.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private BookRepository bookRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id).orElse(null);
    }

    public Loan createLoan(Loan loan) {
        Book book = bookRepository.findById(loan.getBook().getId()).orElse(null);
        if (book == null) {
            throw new RuntimeException("Book not found");
        }

        Optional<Loan> existingLoan = loanRepository.findByBookAndReturnDateIsNull(book);
        if (existingLoan.isPresent()) {
            throw new RuntimeException("Book is already loaned out");
        }

        return loanRepository.save(loan);
    }

    public Loan returnLoan(Long id) {
        Loan loan = loanRepository.findById(id).orElse(null);
        if (loan != null) {
            loan.setReturnDate(LocalDate.now());
            loanRepository.save(loan);
        }
        return loan;
    }

    public List<Loan> getLoansByMember(Member member) {
        return loanRepository.findByMember(member);
    }

    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }
}
