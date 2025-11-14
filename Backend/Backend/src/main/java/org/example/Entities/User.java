package org.example.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    private String password;
    private String role; // USER / ADMIN

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<HackathonApplication> applications;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Submission> submissions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TodoItem> todos;
}

