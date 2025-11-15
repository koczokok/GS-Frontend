package com.gs.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeDTO {
    private Long id; //
    private String title;
    private String description;
    private String rules;
    private LocalDateTime deadline;
    private Long hackathonId; // tylko ID, nie cały obiekt
}
