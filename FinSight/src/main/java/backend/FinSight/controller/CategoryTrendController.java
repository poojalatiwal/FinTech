package backend.FinSight.controller;

import backend.FinSight.dto.CategoryTrendResponse;

import backend.FinSight.model.User;
import backend.FinSight.repository.UserRepository;
import backend.FinSight.service.CategoryTrendService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category-trends")
public class CategoryTrendController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryTrendService
            categoryTrendService;

    @GetMapping
    public List<CategoryTrendResponse> getCategoryTrends(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return categoryTrendService
                .getCategoryTrends(
                        user.getId()
                );
    }


}

