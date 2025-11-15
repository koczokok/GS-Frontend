package com.gs.Controllers;

import com.gs.Entities.HackathonInformation;
import com.gs.Services.HackathonInformationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/hackathon-information")
public class HackathonInformationController {

    private final HackathonInformationService hackathonInformationService;

    public HackathonInformationController(HackathonInformationService hackathonInformationService) {
        this.hackathonInformationService = hackathonInformationService;
    }

    @GetMapping
    public ResponseEntity<HackathonInformation> getHackathonInformation() {
        return hackathonInformationService.getHackathonInformation()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public HackathonInformation createHackathonInformation(@RequestBody HackathonInformation hackathonInformation) {
        return hackathonInformationService.saveHackathonInformation(hackathonInformation);
    }

    @PutMapping
    public ResponseEntity<HackathonInformation> updateHackathonInformation(@RequestBody HackathonInformation hackathonInformation) {
        Optional<HackathonInformation> existing = hackathonInformationService.getHackathonInformation();
        
        if (existing.isPresent()) {
            hackathonInformation.setId(existing.get().getId());
            return ResponseEntity.ok(hackathonInformationService.saveHackathonInformation(hackathonInformation));
        } else {
            // If no existing record, create a new one
            return ResponseEntity.ok(hackathonInformationService.saveHackathonInformation(hackathonInformation));
        }
    }

    @DeleteMapping("/{id}")
    public void deleteHackathonInformation(@PathVariable Long id) {
        hackathonInformationService.deleteHackathonInformation(id);
    }
}

