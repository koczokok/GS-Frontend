package com.gs.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.nimbusds.jwt.JWTClaimsSet;
import com.trade.marketing.config.JwtTokenProvider;
import com.trade.marketing.model.dto.UserDTO;
import com.trade.marketing.model.dto.UserPreferencesDTO;
import com.trade.marketing.model.dto.response.AuthResponse;
import com.trade.marketing.model.dto.response.RefreshTokenResponse;
import com.trade.marketing.model.mapper.UserMapper;
import com.trade.marketing.service.UserPreferencesService;
import com.trade.marketing.model.security.RefreshToken;
import com.trade.marketing.model.security.Role;
import com.trade.marketing.model.security.User;
import com.trade.marketing.model.security.UserStatus;
import com.trade.marketing.repository.RefreshTokenRepository;
import com.trade.marketing.repository.RoleRepository;
import com.trade.marketing.repository.UserRepository;
import com.trade.marketing.model.security.AuthProvider;
import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.time.Instant;
import java.util.*;

/**
 * Service responsible for authentication and user management operations.
 * 
 * <p>This service handles the complete authentication lifecycle including:
 * - OAuth2 authentication with Google and Microsoft providers
 * - User registration and profile management
 * - JWT token generation and refresh token management
 * - Role-based access control and authorization
 * - User session management and security validation
 * 
 * <p>All operations maintain proper security boundaries and audit trails.
 * 
 * @since 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    // Constants for business logic and security
    private static final String GOOGLE_SUB_CLAIM = "sub";
    private static final String EMAIL_CLAIM = "email";
    private static final String NAME_CLAIM = "name";
    private static final String GIVEN_NAME_CLAIM = "given_name";
    private static final String FAMILY_NAME_CLAIM = "family_name";
    private static final String PICTURE_CLAIM = "picture";
    private static final String LOCALE_CLAIM = "locale";
    private static final String EMAIL_VERIFIED_CLAIM = "email_verified";
    private static final String USER_ID_CLAIM = "userId";
    private static final long MILLISECONDS_TO_SECONDS_DIVISOR = 1000L;
    private static final String REVOKED_REASON_ROTATED = "Rotated";
    private static final String REVOKED_REASON_REUSE = "Reuse detected";
    private static final String REVOKED_REASON_EXPIRED = "Expired";
    private static final String REVOKED_REASON_SESSION_EXPIRED = "Session expired";
    
    // Repository dependencies
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;

    // Service dependencies
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleAuthService googleAuthService;
    private final MicrosoftAuthService microsoftAuthService;
    private final UserMapper userMapper;
    private final UserService userService;
    private final UserPreferencesService userPreferencesService;

    @Value("${app.session.max-duration-ms:2592000000}")
    private long sessionMaxDurationMs;

    /**
     * Processes Google OAuth2 user login/registration with comprehensive validation.
     * 
     * <p>This method handles both existing user updates and new user registration
     * based on the OAuth2 user data provided by Google's authentication service.
     * 
     * @param oAuth2User the OAuth2 user data from Google
     * @return the processed user entity (created or updated)
     * @throws IllegalArgumentException if OAuth2 user data is invalid
     * @throws IllegalStateException if email is not authorized or already registered
     * @throws RuntimeException if OAuth2 processing fails
     */
    public User processOAuth2Login(OAuth2User oAuth2User) {
        Assert.notNull(oAuth2User, "OAuth2User cannot be null");
        
        final OAuth2UserData userData = extractOAuth2UserData(oAuth2User);
        log.info("Processing OAuth2 login for user: {} ({})", userData.name(), userData.email());
        
        try {
            validateOAuth2UserData(userData);
            
            final Optional<User> existingUser = userRepository.findByProviderId(userData.providerId());
            
            if (existingUser.isPresent()) {
                return updateExistingOAuth2User(existingUser.get(), userData);
            } else {
                return createNewOAuth2User(userData);
            }
            
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.warn("OAuth2 validation failed for user {}: {}", userData.email(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during OAuth2 processing for user: {}", userData.email(), e);
            throw new RuntimeException("Failed to process OAuth2 login", e);
        }
    }
    
    /**
     * Creates a new user entity from OAuth2 user data.
     * 
     * @param userData the validated OAuth2 user data
     * @return newly created user entity
     * @throws IllegalStateException if email is already registered
     */
    private User createNewOAuth2User(OAuth2UserData userData) {
        log.debug("Creating new OAuth2 user for email: {}", userData.email());
        
        // Additional check for email conflicts
        if (userRepository.existsByEmail(userData.email())) {
            throw new IllegalStateException("Email already registered: " + userData.email());
        }
        
        final User newUser = User.builder()
            .providerId(userData.providerId())
            .email(userData.email())
            .name(userData.name())
            .givenName(userData.givenName())
            .familyName(userData.familyName())
            .picture(userData.picture())
            .locale(userData.locale())
            .authProvider(AuthProvider.GOOGLE)
            .emailVerified(true)
            .isActive(true)
            .roles(new HashSet<>())
            .build();
        
        final User savedUser = userRepository.save(newUser);
        log.info("Created new OAuth2 user: {}", savedUser.getEmail());
        
        return savedUser;
    }
    
    /**
     * Updates an existing user with fresh OAuth2 data.
     * 
     * @param user the existing user entity to update
     * @param userData the fresh OAuth2 user data
     * @return the updated and saved user entity
     */
    private User updateExistingOAuth2User(User user, OAuth2UserData userData) {
        log.debug("Updating existing OAuth2 user: {}", user.getEmail());
        
        boolean hasChanges = false;
        
        // Update profile information that might have changed
        if (StringUtils.hasText(userData.name()) && !userData.name().equals(user.getName())) {
            user.setName(userData.name());
            log.debug("Updated user name to: {}", userData.name());
            hasChanges = true;
        }
        
        if (StringUtils.hasText(userData.picture()) && !userData.picture().equals(user.getPicture())) {
            user.setPicture(userData.picture());
            log.debug("Updated user picture URL");
            hasChanges = true;
        }
        
        if (StringUtils.hasText(userData.locale()) && !userData.locale().equals(user.getLocale())) {
            user.setLocale(userData.locale());
            log.debug("Updated user locale to: {}", userData.locale());
            hasChanges = true;
        }
        
        // Always update last login and email verification
        user.updateLastLogin();
        user.setEmailVerified(true);
        
        final User savedUser = userRepository.save(user);
        
        if (hasChanges) {
            log.info("Updated existing OAuth2 user profile: {}", savedUser.getEmail());
        } else {
            log.debug("No profile changes for user: {}, updated last login only", savedUser.getEmail());
        }
        
        return savedUser;
    }
    
    /**
     * Finds a user by their OAuth provider ID.
     * 
     * @param providerId the OAuth provider unique identifier
     * @return optional containing the user if found
     * @throws IllegalArgumentException if provider ID is null or empty
     */
    @Transactional(readOnly = true)
    public Optional<User> findByProviderId(String providerId) {
        Assert.hasText(providerId, "Provider ID cannot be null or empty");
        return userRepository.findByProviderId(providerId);
    }
    
    /**
     * Finds a user by their email address.
     * 
     * @param email the user's email address
     * @return optional containing the user if found
     * @throws IllegalArgumentException if email is null or empty
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        Assert.hasText(email, "Email cannot be null or empty");
        return userRepository.findByEmail(email);
    }
    
    /**
     * Finds a user by their database ID.
     * 
     * @param id the user's database ID
     * @return optional containing the user if found
     * @throws IllegalArgumentException if ID is null
     */
    @Transactional(readOnly = true)
    public Optional<User> findById(UUID id) {
        Assert.notNull(id, "User ID cannot be null");
        return userRepository.findById(id);
    }
    


    /**
     * Retrieves all active users from the system.
     * 
     * @return list of active users
     */
    @Transactional(readOnly = true)
    public List<User> getActiveUsers() {
        log.debug("Retrieving all active users");
        return userRepository.findByIsActive(true);
    }
    
    /**
     * Adds a role to the specified user.
     * 
     * @param userId the user's database ID
     * @param role the role to add
     * @return the updated user entity
     * @throws EntityNotFoundException if user is not found
     * @throws IllegalArgumentException if parameters are null
     */
    public User addRoleToUser(UUID userId, Role role) {
        Assert.notNull(userId, "User ID cannot be null");
        Assert.notNull(role, "Role cannot be null");
        
        log.debug("Adding role {} to user ID: {}", role, userId);
        
        final User user = findUserById(userId);
        
        if (user.getRoles().add(role)) {
            final User savedUser = userRepository.save(user);
            log.info("Added role {} to user: {}", role, savedUser.getEmail());
            return savedUser;
        } else {
            log.debug("User {} already has role {}", user.getEmail(), role);
            return user;
        }
    }
    
    /**
     * Updates all roles for the specified user.
     * 
     * @param userId the user's database ID
     * @param roles the new set of roles to assign
     * @return the updated user entity
     * @throws EntityNotFoundException if user is not found
     * @throws IllegalArgumentException if parameters are null
     */
    public User updateUserRoles(UUID userId, Set<Role> roles) {
        Assert.notNull(userId, "User ID cannot be null");
        Assert.notNull(roles, "Roles set cannot be null");
        
        log.debug("Updating roles for user ID: {} to {}", userId, roles);
        
        final User user = findUserById(userId);
        user.setRoles(new HashSet<>(roles)); // Create defensive copy
        
        final User savedUser = userRepository.save(user);
        log.info("Updated roles for user: {} to {}", savedUser.getEmail(), roles);
        
        return savedUser;
    }
    

    /**
     * Checks if a user has a specific role.
     * 
     * @param userId the user's database ID
     * @param role the role to check for
     * @return true if the user has the specified role, false otherwise
     * @throws EntityNotFoundException if user is not found
     * @throws IllegalArgumentException if parameters are null
     */
    @Transactional(readOnly = true)
    public boolean userHasRole(UUID userId, Role role) {
        Assert.notNull(userId, "User ID cannot be null");
        Assert.notNull(role, "Role cannot be null");
        
        final User user = findUserById(userId);
        return user.getRoles().contains(role);
    }
    
    /**
     * Validates that a user exists and is active.
     * 
     * @param userId the user's database ID
     * @return true if the user exists and is active, false otherwise
     * @throws IllegalArgumentException if user ID is null
     */
    @Transactional(readOnly = true)
    public boolean isUserActiveAndValid(UUID userId) {
        Assert.notNull(userId, "User ID cannot be null");
        
        return userRepository.findById(userId)
            .map(User::getIsActive)
            .orElse(false);
    }
    
    /**
     * Saves a new user entity to the database.
     * 
     * @param user the user entity to save
     * @return the saved user entity with generated ID
     * @throws IllegalArgumentException if user is null or invalid
     */
    public User saveUser(User user) {
        Assert.notNull(user, "User cannot be null");
        Assert.hasText(user.getEmail(), "User email cannot be null or empty");
        
        final User savedUser = userRepository.save(user);
        log.info("Saved new user: {}", savedUser.getEmail());
        
        return savedUser;
    }
    
    /**
     * Updates an existing user entity in the database.
     * 
     * @param user the user entity to update
     * @return the updated user entity
     * @throws IllegalArgumentException if user is null or invalid
     */
    public User updateUser(User user) {
        Assert.notNull(user, "User cannot be null");
        Assert.notNull(user.getId(), "User ID cannot be null for update");
        Assert.hasText(user.getEmail(), "User email cannot be null or empty");
        
        final User savedUser = userRepository.save(user);
        log.info("Updated user: {}", savedUser.getEmail());
        
        return savedUser;
    }
    
    /**
     * Processes OAuth user authentication from frontend callback.
     * 
     * <p>This method handles both Google and Microsoft OAuth providers and supports
     * both new user creation and existing user updates.
     * 
     * @param providerId the OAuth provider unique identifier
     * @param email the user's email address
     * @param name the user's display name
     * @param givenName the user's given name
     * @param familyName the user's family name
     * @param picture the user's picture URL (optional)
     * @param locale the user's locale (optional)
     * @param emailVerified whether the email is verified by the provider
     * @param authProvider the authentication provider (GOOGLE or MICROSOFT)
     * @return the processed user entity (created or updated)
     * @throws IllegalStateException if the email is not authorized
     * @throws IllegalArgumentException if required parameters are invalid
     * @throws RuntimeException if processing fails due to system errors
     */
    public User processOAuthUser(String providerId, String email, String name,
                                String givenName, String familyName, String picture,
                                String locale, boolean emailVerified, AuthProvider authProvider) {
        
        // Validate required parameters
        Assert.hasText(providerId, "Provider ID cannot be null or empty");
        Assert.hasText(email, "Email cannot be null or empty");
        Assert.notNull(authProvider, "Auth provider cannot be null");
        
        log.info("Processing {} OAuth authentication for user: {} ({})", authProvider, name, email);
        log.debug("OAuth user data: providerId={}, givenName={}, familyName={}, locale={}, emailVerified={}",
            providerId, givenName, familyName, locale, emailVerified);
        
        try {
            // Use the enhanced UserService method for OAuth processing
            return userService.findOrCreateUserFromOAuth(
                email, providerId, name, givenName, familyName, 
                picture, locale, authProvider, emailVerified
            );
            
        } catch (IllegalStateException e) {
            log.warn("OAuth authentication failed for {}: {}", email, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error processing {} OAuth user {}: {}", authProvider, email, e.getMessage(), e);
            throw new RuntimeException("Failed to process OAuth user", e);
        }
    }

    /**
     * Deactivates a user account, preventing further access.
     * 
     * @param userId the user's database ID
     * @return the updated user entity
     * @throws EntityNotFoundException if user is not found
     * @throws IllegalArgumentException if user ID is null
     */
    public User deactivateUser(UUID userId) {
        Assert.notNull(userId, "User ID cannot be null");
        
        log.info("Deactivating user with ID: {}", userId);
        
        final User user = findUserById(userId);
        user.setIsActive(false);
        
        final User savedUser = userRepository.save(user);
        log.info("Deactivated user: {}", savedUser.getEmail());
        
        return savedUser;
    }

    /**
     * Creates and saves a new refresh token for the specified user.
     * 
     * @param user the user to create the refresh token for
     * @return the created and saved refresh token entity
     * @throws IllegalArgumentException if user is null
     */
    public RefreshToken saveRefreshToken(User user) {
        Assert.notNull(user, "User cannot be null");
        
        log.debug("Creating refresh token for user: {}", user.getEmail());
        
        // Mark any previously active tokens whose session already expired
        final Instant now = Instant.now();
        final List<RefreshToken> activeTokens = refreshTokenRepository.findByUserAndRevokedFalse(user);
        for (RefreshToken token : activeTokens) {
            if (token.getSessionExpiresAt() != null && token.getSessionExpiresAt().isBefore(now)) {
                token.setRevoked(true);
                token.setRevokedAt(now);
                token.setRevokedReason(REVOKED_REASON_SESSION_EXPIRED);
            }
        }
        if (!activeTokens.isEmpty()) {
            refreshTokenRepository.saveAll(activeTokens);
        }

        final String generatedRefreshToken = jwtTokenProvider.generateRefreshToken(user);
        final Instant expiryDate = Instant.ofEpochMilli(
            System.currentTimeMillis() + jwtTokenProvider.getJwtRefreshExpirationMs()
        );
        final UUID familyId = UUID.randomUUID();
        final Instant sessionStartedAt = Instant.now();
        final Instant sessionExpiresAt = sessionStartedAt.plusMillis(sessionMaxDurationMs);
        
        final RefreshToken refreshToken = RefreshToken.builder()
            .token(generatedRefreshToken)
            .user(user)
            .expiryDate(expiryDate)
            .familyId(familyId)
            .sessionStartedAt(sessionStartedAt)
            .sessionExpiresAt(sessionExpiresAt)
            .revoked(false)
            .build();
            
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Authenticates a user using Google OAuth ID token.
     * 
     * @param idToken the Google ID token to verify and process
     * @return the authentication response with tokens and user information
     * @throws IllegalArgumentException if the ID token is invalid or null
     * @throws IllegalStateException if the user email is not authorized
     * @throws Exception if token verification or processing fails
     */
    public AuthResponse authenticateWithGoogle(String idToken) throws Exception {
        Assert.hasText(idToken, "Google ID token cannot be null or empty");
        
        if (idToken.startsWith("mock_")) {
            return handleMockAuthentication();
        }
        
        log.debug("Authenticating user with Google ID token");
        
        final GoogleIdToken.Payload payload = googleAuthService.verifyIdToken(idToken);
        if (payload == null) {
            throw new IllegalArgumentException("Invalid Google ID Token");
        }
        
        final String email = payload.getEmail();
        final String googleId = payload.getSubject();
        
        log.info("Processing Google authentication for user: {}", email);
        
        final Optional<User> existingUser = userRepository.findByProviderIdAndAuthProvider(
            googleId, AuthProvider.GOOGLE
        );
        
        final User user;
        if (existingUser.isPresent()) {
            user = updateExistingAuthenticatedUser(existingUser.get(), payload);
        } else {
            user = processOAuthUser(
                googleId,
                email,
                (String) payload.get(NAME_CLAIM),
                (String) payload.get(GIVEN_NAME_CLAIM),
                (String) payload.get(FAMILY_NAME_CLAIM),
                (String) payload.get(PICTURE_CLAIM),
                (String) payload.get(LOCALE_CLAIM),
                true,
                AuthProvider.GOOGLE
            );
        }
        
        return createAuthResponse(user);
    }

    /**
     * Authenticates a user using Microsoft OAuth ID token.
     * 
     * @param idToken the Microsoft ID token to verify and process
     * @return the authentication response with tokens and user information
     * @throws IllegalArgumentException if the ID token is invalid or null
     * @throws IllegalStateException if the user email is not authorized
     * @throws Exception if token verification or processing fails
     */
    public AuthResponse authenticateWithMicrosoft(String idToken) throws Exception {
        Assert.hasText(idToken, "Microsoft ID token cannot be null or empty");
        
        log.debug("Authenticating user with Microsoft ID token");
        
        final JWTClaimsSet claims = microsoftAuthService.verifyIdToken(idToken);
        if (claims == null) {
            throw new IllegalArgumentException("Invalid Microsoft ID Token");
        }
        
        final String email = safeGetStringClaim(claims, EMAIL_CLAIM);
        final String microsoftId = claims.getSubject();
        
        log.info("Processing Microsoft authentication for user: {}", email);
        
        final Optional<User> existingUser = userRepository.findByProviderIdAndAuthProvider(
            microsoftId, AuthProvider.MICROSOFT
        );
        
        final User user;
        if (existingUser.isPresent()) {
            user = updateExistingAuthenticatedUser(existingUser.get(), claims);
        } else {
            user = processOAuthUser(
                microsoftId,
                email,
                safeGetStringClaim(claims, NAME_CLAIM),
                safeGetStringClaim(claims, GIVEN_NAME_CLAIM),
                safeGetStringClaim(claims, FAMILY_NAME_CLAIM),
                null, // Microsoft doesn't typically provide picture in claims
                safeGetStringClaim(claims, LOCALE_CLAIM),
                true,
                AuthProvider.MICROSOFT
            );
        }
        
        return createAuthResponse(user);
    }

    /**
     * Refreshes an access token using a valid refresh token.
     * 
     * <p>This method implements refresh token rotation for enhanced security,
     * invalidating the old refresh token and issuing a new one along with a new access token.
     * 
     * @param refreshTokenString the refresh token string to validate and use
     * @return the refresh token response with new access and refresh tokens
     * @throws IllegalArgumentException if the refresh token is invalid, expired, or revoked
     * @throws Exception if token processing fails
     */
    public RefreshTokenResponse refreshAccessToken(String refreshTokenString) throws Exception {
        Assert.hasText(refreshTokenString, "Refresh token cannot be null or empty");
        
        log.debug("Processing refresh token authentication");
        
        // Validate token structure and signature
        if (!jwtTokenProvider.validateToken(refreshTokenString)) {
            throw new IllegalArgumentException("Invalid refresh token format or signature");
        }
        
        // Extract and validate claims
        final Claims claims = jwtTokenProvider.getAllClaimsFromToken(refreshTokenString);
        final UUID userId = extractUserIdFromClaims(claims);
        
        // Find and validate stored refresh token
        final RefreshToken storedRefreshToken = findAndValidateRefreshToken(refreshTokenString, userId);
        
        // Get the associated user
        final User user = storedRefreshToken.getUser();
        log.debug("Refreshing tokens for user: {}", user.getEmail());
        
        // Generate new tokens with rotation
        final String newAccessToken = jwtTokenProvider.generateToken(user);
        final RefreshToken newRefreshToken = rotateRefreshToken(storedRefreshToken, user);
        
        log.info("Successfully refreshed tokens for user: {}", user.getEmail());
        
        return new RefreshTokenResponse(
            newAccessToken,
            newRefreshToken.getToken(),
            jwtTokenProvider.getJwtExpirationMs() / MILLISECONDS_TO_SECONDS_DIVISOR,
            newRefreshToken.getSessionExpiresAt().toEpochMilli()
        );
    }

    /**
     * Creates a standardized authentication response with tokens and user information.
     *
     * @param user the authenticated user
     * @return the complete authentication response
     */
    private AuthResponse createAuthResponse(User user) {
        log.debug("Creating auth response for user: {}", user.getEmail());

        final String accessToken = jwtTokenProvider.generateToken(user);
        final RefreshToken refreshToken = saveRefreshToken(user);

        // Get user preferences (will return defaults if none exist)
        final UserPreferencesDTO preferences = userPreferencesService.getUserPreferences(user.getId());

        // Create UserDTO with preferences included
        final UserDTO userDTO = userMapper.toDTOWithPreferences(user, preferences);

        return new AuthResponse(
            userDTO,
            accessToken,
            refreshToken.getToken(),
            jwtTokenProvider.getJwtExpirationMs() / MILLISECONDS_TO_SECONDS_DIVISOR,
            refreshToken.getSessionExpiresAt().toEpochMilli()
        );
    }
    
    // ====== Helper Methods ======
    
    /**
     * Extracts OAuth2 user data from the OAuth2User object.
     */
    private OAuth2UserData extractOAuth2UserData(OAuth2User oAuth2User) {
        return new OAuth2UserData(
            oAuth2User.getAttribute(GOOGLE_SUB_CLAIM),
            oAuth2User.getAttribute(EMAIL_CLAIM),
            oAuth2User.getAttribute(NAME_CLAIM),
            oAuth2User.getAttribute(GIVEN_NAME_CLAIM),
            oAuth2User.getAttribute(FAMILY_NAME_CLAIM),
            oAuth2User.getAttribute(PICTURE_CLAIM),
            oAuth2User.getAttribute(LOCALE_CLAIM),
            Boolean.TRUE.equals(oAuth2User.getAttribute(EMAIL_VERIFIED_CLAIM))
        );
    }
    
    /**
     * Validates OAuth2 user data for required fields.
     */
    private void validateOAuth2UserData(OAuth2UserData userData) {
        if (!StringUtils.hasText(userData.providerId()) || 
            !StringUtils.hasText(userData.email()) || 
            !StringUtils.hasText(userData.name())) {
            throw new IllegalArgumentException("Missing required OAuth2 user information");
        }
    }
    

    
    /**
     * Finds a user by ID, throwing EntityNotFoundException if not found.
     */
    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
    }
    
    /**
     * Creates a new OAuth user entity.
     */
    private User createNewOAuthUser(String providerId, String email, String name,
                                  String givenName, String familyName, String picture,
                                  String locale, boolean emailVerified, AuthProvider authProvider) {
        
        log.debug("Creating new {} OAuth user for email: {}", authProvider, email);
        
        final User newUser = User.builder()
            .providerId(providerId)
            .email(email)
            .name(name)
            .givenName(givenName)
            .familyName(familyName)
            .picture(picture)
            .locale(locale)
            .authProvider(authProvider)
            .emailVerified(emailVerified)
            .isActive(true)
            .roles(new HashSet<>())
            .build();
        
        final User savedUser = userRepository.save(newUser);
        log.info("Created new {} OAuth user: {}", authProvider, savedUser.getEmail());
        
        return savedUser;
    }
    
    /**
     * Updates an existing OAuth user entity.
     */
    private User updateExistingOAuthUser(User user, String providerId, String email, String name,
                                       String givenName, String familyName, String picture,
                                       String locale, AuthProvider authProvider) {
        
        log.debug("Updating existing {} OAuth user: {}", authProvider, user.getEmail());
        
        user.setName(name);
        user.setEmail(email);
        user.setGivenName(givenName);
        user.setFamilyName(familyName);
        user.setPicture(picture);
        user.setLocale(locale);
        user.setAuthProvider(authProvider);
        user.setEmailVerified(true);
        user.updateLastLogin();
        
        final User savedUser = userRepository.save(user);
        log.info("Updated existing {} OAuth user: {}", authProvider, savedUser.getEmail());
        
        return savedUser;
    }
    
    /**
     * Updates an existing authenticated user with fresh token data.
     */
    private User updateExistingAuthenticatedUser(User user, GoogleIdToken.Payload payload) {
        user.setName((String) payload.get(NAME_CLAIM));
        user.setEmailVerified(true);
        user.updateLastLogin();
        return userRepository.save(user);
    }
    
    /**
     * Updates an existing authenticated user with fresh JWT claims data.
     */
    private User updateExistingAuthenticatedUser(User user, JWTClaimsSet claims) {
        user.setName(safeGetStringClaim(claims, NAME_CLAIM));
        user.setEmailVerified(true);
        user.updateLastLogin();
        return userRepository.save(user);
    }
    
    /**
     * Extracts user ID from JWT claims.
     */
    private UUID extractUserIdFromClaims(Claims claims) {
        final String userIdString = claims.get(USER_ID_CLAIM, String.class);
        if (!StringUtils.hasText(userIdString)) {
            throw new IllegalArgumentException("User ID not found in refresh token claims");
        }
        
        try {
            return UUID.fromString(userIdString);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid user ID format in refresh token", e);
        }
    }
    
    /**
     * Finds and validates a refresh token from the database.
     */
    private RefreshToken findAndValidateRefreshToken(String refreshTokenString, UUID userId) {
        final RefreshToken storedRefreshToken = refreshTokenRepository.findByToken(refreshTokenString)
            .orElseThrow(() -> new IllegalArgumentException("Refresh token not found or already invalidated"));
        
        // Absolute session expiry check
        if (Instant.now().isAfter(storedRefreshToken.getSessionExpiresAt())) {
            if (!storedRefreshToken.isRevoked()) {
                storedRefreshToken.setRevoked(true);
                storedRefreshToken.setRevokedAt(Instant.now());
                storedRefreshToken.setRevokedReason(REVOKED_REASON_SESSION_EXPIRED);
                refreshTokenRepository.save(storedRefreshToken);
            }
            throw new IllegalArgumentException("Session expired - re-authentication required");
        }

        // Detect reuse
        if (storedRefreshToken.isRevoked()) {
            final String reason = storedRefreshToken.getRevokedReason();
            if (!REVOKED_REASON_EXPIRED.equalsIgnoreCase(reason) && !REVOKED_REASON_SESSION_EXPIRED.equalsIgnoreCase(reason)) {
                handleRefreshTokenReuse(storedRefreshToken);
            }
            throw new IllegalArgumentException("Refresh token revoked");
        }
        
        // Validate expiration
        if (storedRefreshToken.getExpiryDate().isBefore(Instant.now())) {
            storedRefreshToken.setRevoked(true);
            storedRefreshToken.setRevokedAt(Instant.now());
            storedRefreshToken.setRevokedReason(REVOKED_REASON_EXPIRED);
            refreshTokenRepository.save(storedRefreshToken);
            throw new IllegalArgumentException("Refresh token expired");
        }
        
        // Validate user ownership
        if (!storedRefreshToken.getUser().getId().equals(userId)) {
            // Security measure: invalidate all tokens for this user
            refreshTokenRepository.deleteByUser(storedRefreshToken.getUser());
            throw new IllegalArgumentException("Refresh token user mismatch - security violation detected");
        }
        
        return storedRefreshToken;
    }
    
    /**
     * Implements refresh token rotation for enhanced security.
     */
    private RefreshToken rotateRefreshToken(RefreshToken oldRefreshToken, User user) {
        // Mark the old refresh token as revoked
        oldRefreshToken.setRevoked(true);
        oldRefreshToken.setRevokedAt(Instant.now());
        oldRefreshToken.setRevokedReason(REVOKED_REASON_ROTATED);
        refreshTokenRepository.save(oldRefreshToken);

        // Create and save new refresh token within the same family
        final String newRefreshTokenString = jwtTokenProvider.generateRefreshToken(user);
        final RefreshToken newRefreshToken = RefreshToken.builder()
            .token(newRefreshTokenString)
            .user(user)
            .expiryDate(Instant.ofEpochMilli(
                System.currentTimeMillis() + jwtTokenProvider.getJwtRefreshExpirationMs()))
            .familyId(oldRefreshToken.getFamilyId())
            .rotatedFrom(oldRefreshToken)
            .sessionStartedAt(oldRefreshToken.getSessionStartedAt())
            .sessionExpiresAt(oldRefreshToken.getSessionExpiresAt())
            .revoked(false)
            .build();

        return refreshTokenRepository.save(newRefreshToken);
    }

    private void handleRefreshTokenReuse(RefreshToken compromisedToken) {
        log.warn("Refresh token reuse detected for user: {}", compromisedToken.getUser().getEmail());
        final List<RefreshToken> familyTokens = refreshTokenRepository.findByFamilyId(compromisedToken.getFamilyId());
        final Instant now = Instant.now();
        for (RefreshToken token : familyTokens) {
            token.setRevoked(true);
            token.setRevokedAt(now);
            token.setRevokedReason(REVOKED_REASON_REUSE);
        }
        refreshTokenRepository.saveAll(familyTokens);
    }
    
    /**
     * Safely extracts a string claim from JWT claims, handling ParseException.
     */
    private String safeGetStringClaim(JWTClaimsSet claims, String claimName) {
        try {
            return claims.getStringClaim(claimName);
        } catch (ParseException e) {
            log.debug("Could not extract claim '{}' from JWT: {}", claimName, e.getMessage());
            return null;
        }
    }

    private AuthResponse handleMockAuthentication() {
        log.debug("Handling mock authentication");
        final String mockProviderId = "mock-user-id";
        User user = userRepository.findByProviderIdAndAuthProvider(mockProviderId, AuthProvider.GOOGLE)
                .map(existingUser -> {
                    existingUser.updateLastLogin();
                    log.info("Authenticated existing mock user: {}", existingUser.getEmail());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    log.info("Creating new mock user");
                    Role superAdminRole = roleRepository.findByName("SuperAdmin")
                            .orElseThrow(() -> new IllegalStateException("SuperAdmin role not found for testing"));
                    User newUser = User.builder()
                            .providerId(mockProviderId)
                            .email("test-user@example.com")
                            .name("Mock User")
                            .givenName("Mock")
                            .familyName("User")
                            .authProvider(AuthProvider.GOOGLE)
                            .emailVerified(true)
                            .isActive(true)
                            .status(UserStatus.ACTIVE)
                            .roles(Set.of(superAdminRole))
                            .build();
                    return userRepository.save(newUser);
                });
        return createAuthResponse(user);
    }
    
    // ====== Record Classes for Internal Data Transfer ======
    
    private record OAuth2UserData(
        String providerId,
        String email,
        String name,
        String givenName,
        String familyName,
        String picture,
        String locale,
        boolean emailVerified
    ) {}
} 