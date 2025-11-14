package com.gs.Services;

import com.gs.Entities.UserProfile;
import com.gs.Repositories.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository profileRepository;

    public UserProfileService(UserProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
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
}
