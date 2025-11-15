package com.gs.Repositories;

import com.gs.Entities.HackathonInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HackathonInformationRepository extends JpaRepository<HackathonInformation, Long> {
    Optional<HackathonInformation> findFirstByOrderByIdAsc();
}

