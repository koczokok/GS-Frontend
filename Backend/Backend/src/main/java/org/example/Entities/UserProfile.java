package org.example.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String bio;
    private String skills;
    private String cvUrl;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
