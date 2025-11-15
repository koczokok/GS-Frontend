package com.gs.DTO;

public record OAuthUserRequest(
        String providerId,
        String email
) {}