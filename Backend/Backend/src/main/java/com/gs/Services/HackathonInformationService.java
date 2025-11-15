package com.gs.Services;

import com.gs.Entities.HackathonInformation;
import com.gs.Repositories.HackathonInformationRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HackathonInformationService {

    private final HackathonInformationRepository hackathonInformationRepository;

    public HackathonInformationService(HackathonInformationRepository hackathonInformationRepository) {
        this.hackathonInformationRepository = hackathonInformationRepository;
    }

    public Optional<HackathonInformation> getHackathonInformation() {
        return hackathonInformationRepository.findFirstByOrderByIdAsc();
    }

    public HackathonInformation saveHackathonInformation(HackathonInformation hackathonInformation) {
        return hackathonInformationRepository.save(hackathonInformation);
    }

    public void deleteHackathonInformation(Long id) {
        hackathonInformationRepository.deleteById(id);
    }
}

