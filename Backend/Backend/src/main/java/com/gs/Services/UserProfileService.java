package com.gs.Services;

import com.gs.Entities.User;
import com.gs.Entities.UserProfile;
import com.gs.Repositories.UserProfileRepository;
import com.gs.Services.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository profileRepository;
    private final UserService userService;

    public UserProfileService(UserProfileRepository profileRepository, UserService userService) {
        this.profileRepository = profileRepository;
        this.userService = userService;
    }

    public List<UserProfile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Optional<UserProfile> getProfileById(Long id) {
        return profileRepository.findById(id);
    }

    public Optional<UserProfile> getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    public UserProfile saveProfile(UserProfile profile) {
        return profileRepository.save(profile);
    }

    public void deleteProfile(Long id) {
        profileRepository.deleteById(id);
    }

    public User completeUserProfile(Long userId, String teamName) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTeam(teamName);
        user.setProfileCompleted(true);

        return userService.saveUser(user);
    }

    public UserProfile createOrUpdateUserProfile(Long userId, String bio) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if profile already exists
        Optional<UserProfile> existingProfile = profileRepository.findByUserId(userId);

        UserProfile profile;
        if (existingProfile.isPresent()) {
            profile = existingProfile.get();
            profile.setBio(bio);
        } else {
            profile = new UserProfile();
            profile.setUser(user);
            profile.setBio(bio);
        }

        return profileRepository.save(profile);
    }
}
