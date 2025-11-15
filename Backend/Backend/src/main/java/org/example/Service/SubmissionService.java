package org.example.Service;

import org.example.Entities.Challenge;
import org.example.Entities.Submission;
import org.example.Enums.Metrics;
import org.example.Repositories.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ChallengeService challengeService;

    public SubmissionService(SubmissionRepository submissionRepository, ChallengeService challengeService) {
        this.submissionRepository = submissionRepository;
        this.challengeService = challengeService;
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

//    public Submission saveSubmission(Submission submission) {
//        return submissionRepository.save(submission);
//    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }

    public Submission handleSubmission(MultipartFile file, Long challengeId) throws IOException {

        Optional<Challenge> challenge = challengeService.getChallengeById(challengeId);

        Submission submission = new Submission();
        submission.setSubmissionDate(LocalDateTime.now());
        submission.setFile(file.getBytes());
        submission.setFileName(file.getOriginalFilename());



        double score = Metrics.getEnumFromMetric(challenge.get().getMetric()).calculate(submission.getFile(), challenge.get().getGroundSourceFile());
        submission.setScore(score);

        submissionRepository.save(submission);
        return submission;
    }


}
