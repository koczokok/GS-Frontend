package com.gs.Services;

import com.gs.Entities.EvaluationMetric;
import com.gs.Repositories.EvaluationMetricRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluationMetricService {

    private final EvaluationMetricRepository metricRepository;

    public EvaluationMetricService(EvaluationMetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    public List<EvaluationMetric> getAllMetrics() {
        return metricRepository.findAll();
    }

    public Optional<EvaluationMetric> getMetricById(Long id) {
        return metricRepository.findById(id);
    }

    public List<EvaluationMetric> getMetricsByUserId(Long userId) {
        return metricRepository.findByUserId(userId);
    }

    public EvaluationMetric saveMetric(EvaluationMetric metric) {
        return metricRepository.save(metric);
    }

    public void deleteMetric(Long id) {
        metricRepository.deleteById(id);
    }
}
