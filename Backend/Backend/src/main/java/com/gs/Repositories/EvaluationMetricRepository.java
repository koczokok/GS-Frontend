package com.gs.Repositories;

import com.gs.Entities.EvaluationMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationMetricRepository extends JpaRepository<EvaluationMetric, Long> {
    List<EvaluationMetric> findByUserId(Long userId);
}
