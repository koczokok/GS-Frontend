package org.example.Services;

import org.example.Entities.Submission;
import org.example.Repositories.SubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> getSubmissionsByChallengeId(Long challengeId) {
        return submissionRepository.findByChallengeId(challengeId);
    }

    public List<Submission> getSubmissionsByUserId(Long userId) {
        return submissionRepository.findByUserId(userId);
    }

    public Submission saveSubmission(Submission submission) {
        return submissionRepository.save(submission);
    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }
}
