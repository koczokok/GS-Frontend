package com.gs.Controllers;

import com.gs.DTO.ProfileCompletionRequest;
import com.gs.Entities.User;
import com.gs.Entities.UserProfile;
import com.gs.Services.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService profileService;

    public UserProfileController(UserProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public List<UserProfile> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getProfileById(@PathVariable Long id) {
        return profileService.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserProfile> getProfileByUserId(@PathVariable Long userId) {
        return profileService.getProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<?> completeProfile(@RequestBody ProfileCompletionRequest request) {
        try {
            // For now, we'll need to extract userId from somewhere - this might need adjustment
            // based on how authentication works in your system
            User updatedUser = profileService.completeUserProfile(
                    1L, // TODO: Get userId from authenticated user
                    request.teamName()
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "profileCompleted", updatedUser.isProfileCompleted(),
                    "message", "Profile completed successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping
    public UserProfile createProfile(@RequestBody UserProfile profile) {
        return profileService.saveProfile(profile);
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<UserProfile> updateUserProfile(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String bio = request.get("bio");
            UserProfile updatedProfile = profileService.createOrUpdateUserProfile(userId, bio);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
    }
}
