package com.gs.Controllers;

import com.gs.DTO.OAuthUserRequest;
import com.gs.Entities.User;
import com.gs.Services.AuthService;
import com.gs.Services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{roleId}")
    public List<User> getUsersByRole(@PathVariable Long roleId) {
        return userService.getUsersByRoleId(roleId);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/oauth-user")
    public ResponseEntity<?> processOAuthUser(@RequestBody OAuthUserRequest request) {
        try {


            User user = authService.processOAuthUser(
                    request.providerId(),
                    request.email()
            );

            return ResponseEntity.ok("OK");

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(Map.of("error", "Internal server error"));
        }
    }



@DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
