package backend.FinSight.controller;

import backend.FinSight.dto.AdminDashboardResponse;

import backend.FinSight.model.User;

import backend.FinSight.repository.UserRepository;

import backend.FinSight.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public AdminDashboardResponse
    getDashboard(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        User user =
                userRepository.findByUsername(
                        username
                ).orElseThrow();

        // ADMIN CHECK

        if (!user.getRole()
                .equals("ADMIN")) {

            throw new RuntimeException(
                    "Access denied"
            );
        }

        return adminService.getDashboard();
    }
    
    private void validateAdmin(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        User user =
                userRepository.findByUsername(
                        username
                ).orElseThrow();

        if (!user.getRole()
                .equals("ADMIN")) {

            throw new RuntimeException(
                    "Access denied"
            );
        }
    }


    @GetMapping("/users")
    public List<User> getUsers(
            Authentication authentication
    ) {

        validateAdmin(authentication);

        return adminService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable String id,
            Authentication authentication
    ) {

        validateAdmin(authentication);

        return adminService.deleteUser(id);
    }

}

