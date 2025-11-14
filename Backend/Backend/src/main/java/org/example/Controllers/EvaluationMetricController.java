package org.example.Controllers;

import org.example.Entities.EvaluationMetric;
import org.example.Services.EvaluationMetricService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class EvaluationMetricController {

    private final EvaluationMetricService metricService;

    public EvaluationMetricController(EvaluationMetricService metricService) {
        this.metricService = metricService;
    }

    @GetMapping
    public List<EvaluationMetric> getAllMetrics() {
        return metricService.getAllMetrics();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationMetric> getMetricById(@PathVariable Long id) {
        return metricService.getMetricById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<EvaluationMetric> getByUser(@PathVariable Long userId) {
        return metricService.getMetricsByUserId(userId);
    }

    @PostMapping
    public EvaluationMetric createMetric(@RequestBody EvaluationMetric metric) {
        return metricService.saveMetric(metric);
    }

    @DeleteMapping("/{id}")
    public void deleteMetric(@PathVariable Long id) {
        metricService.deleteMetric(id);
    }
}
