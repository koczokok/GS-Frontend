package com.gs.Entities;

import jakarta.persistence.*;
import lombok.*;
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

    private Integer score;
    private String feedback;

    @Temporal(TemporalType.TIMESTAMP)
    private Date submissionDate;

    private String fileName;
    private String fileExtension;

    @Lob
    private byte[] file;

    private Long challengeId;

    @ManyToOne
    @JoinColumn(name = "user_id") // assuming your DB column is user_id
    private User user;


}
