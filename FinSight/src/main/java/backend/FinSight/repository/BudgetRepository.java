package backend.FinSight.repository;

import backend.FinSight.model.Budget;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository
        extends MongoRepository<Budget, String> {

    List<Budget> findByUserId(String userId);

    Optional<Budget> findByUserIdAndCategoryAndMonth(
            String userId,
            String category,
            String month
    );


}