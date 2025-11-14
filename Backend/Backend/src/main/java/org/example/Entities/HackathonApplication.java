package org.example.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hackathon_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HackathonApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "hackathon_id")
    private Hackathon hackathon;

    private String status; // PENDING / APPROVED / REJECTED
    private LocalDateTime appliedAt;
}
