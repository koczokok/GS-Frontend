package com.gs.Controllers;

import com.gs.Entities.Submission;
import com.gs.Services.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionService.getAllSubmissions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Long id) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/challenge/{challengeId}")
    public List<Submission> getByChallenge(@PathVariable Long challengeId) {
        return submissionService.getSubmissionsByChallengeId(challengeId);
    }

    @GetMapping("/user/{userId}")
    public List<Submission> getByUser(@PathVariable Long userId) {
        return submissionService.getSubmissionsByUserId(userId);
    }

    @PostMapping
    public Submission createSubmission(@RequestParam("file") MultipartFile file, @RequestParam("id") Long challengeId) throws IOException {
        return submissionService.handleSubmission(file, challengeId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Submission> updateSubmission(@PathVariable Long id, @RequestBody Submission submission) {
        return submissionService.getSubmissionById(id)
                .map(existingSubmission -> {
                    if (submission.getScore() != null) {
                        existingSubmission.setScore(submission.getScore());
                    }
                    if (submission.getFeedback() != null) {
                        existingSubmission.setFeedback(submission.getFeedback());
                    }
                    return ResponseEntity.ok(submissionService.saveSubmission(existingSubmission));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
    }
}
