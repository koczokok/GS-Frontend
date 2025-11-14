package com.gs.Repositories;

import com.gs.Entities.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // zamiast findByUserId(Long userId)
    List<Submission> findByUser_Id(Long userId);

    // jeśli chcesz też po challenge
    List<Submission> findByChallengeId(Long challengeId);

}
