package com.gs.Services;


import com.gs.Entities.User;
import com.gs.Repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public User processOAuthUser(String providerId, String email) {

        // Validate required parameters
        if (!StringUtils.hasText(providerId)) {
            throw new IllegalArgumentException("Provider ID cannot be null or empty");
        }
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        // Check if user already exists by provider ID
        Optional<User> existingUser = userRepository.findByProviderId(providerId);

        if (existingUser.isPresent()) {
            // Update existing user
            return updateExistingOAuthUser(existingUser.get(), email);
        } else {
            // Check if email is already registered (prevent account conflicts)
            Optional<User> userByEmail = userRepository.findByEmail(email);
            if (userByEmail.isPresent()) {
                throw new IllegalStateException("Email already registered with different provider: " + email);
            }

            // Create new user
            return createNewOAuthUser(providerId, email);
        }
    }

    private User updateExistingOAuthUser(User user, String email) {

        boolean hasChanges = false;



        User savedUser = userRepository.save(user);

        if (hasChanges) {
            System.out.println("Updated OAuth user profile: " + savedUser.getEmail());
        } else {
            System.out.println("Updated last login for OAuth user: " + savedUser.getEmail());
        }

        return savedUser;
    }

    /**
     * Creates a new OAuth user in the database.
     */
    private User createNewOAuthUser(String providerId, String email) {

        User newUser = new User();
        newUser.setProviderId(providerId);
        newUser.setEmail(email);

        User savedUser = userRepository.save(newUser);
        System.out.println("Created new OAuth user: " + savedUser.getEmail());

        return savedUser;
    }



    /**
     * Finds a user by their OAuth provider ID.
     */
    @Transactional(readOnly = true)
    public Optional<User> findByProviderId(String providerId) {
        if (!StringUtils.hasText(providerId)) {
            return Optional.empty();
        }
        return userRepository.findByProviderId(providerId);
    }

    /**
     * Finds a user by their email address.
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return Optional.empty();
        }
        return userRepository.findByEmail(email);
    }
}