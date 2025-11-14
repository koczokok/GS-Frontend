package com.gs.Controllers;

import com.gs.Entities.Submission;
import com.gs.Services.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public Submission createSubmission(@RequestBody Submission submission) {
        return submissionService.saveSubmission(submission);
    }

    @DeleteMapping("/{id}")
    public void deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
    }
}
