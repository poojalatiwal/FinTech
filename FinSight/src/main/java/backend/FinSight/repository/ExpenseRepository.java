package backend.FinSight.repository;

import backend.FinSight.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository
        extends MongoRepository<Expense, String> {

    List<Expense> findByUserId(String userId);
    List<Expense> findByUserIdAndCategory(
            String userId,
            String category
    );

    List<Expense> findByUserIdAndDateBetween(
            String userId,
            LocalDate start,
            LocalDate end
    );

    List<Expense> findTop5ByUserIdOrderByDateDesc(
            String userId
    );

    List<Expense> findByUserIdOrderByDateAsc(
            String userId);

}