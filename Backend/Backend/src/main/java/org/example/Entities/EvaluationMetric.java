package org.example.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluation_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metric;
    private Long userId;
}
