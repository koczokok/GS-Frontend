package org.example.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double score;
    private String feedback;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime submissionDate;

    private String fileName;
    private String fileExtension;

    @Lob
    private byte[] file;

    private Long challengeId;
}
