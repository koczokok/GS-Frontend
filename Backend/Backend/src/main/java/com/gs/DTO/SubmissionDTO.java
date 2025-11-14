package com.gs.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private Integer score;
    private String feedback;
    private LocalDateTime submissionDate;
    private String fileName;
    private String fileExtension;
    private Long challengeId;
    private Long userId;
}
