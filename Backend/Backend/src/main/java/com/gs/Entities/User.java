package com.gs.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String providerId;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    private String team;
}

