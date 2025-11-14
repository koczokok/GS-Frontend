package com.gs.service;


import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;

@Service
public class MicrosoftAuthService {

    @Value("${spring.security.oauth2.client.registration.microsoft.client-id}")
    private String azureAdClientId;

    @Value("${spring.security.oauth2.client.provider.microsoft.issuer-uri}")
    private String azureAdIssuerUri;

    private final ConfigurableJWTProcessor<SecurityContext> jwtProcessor;

    public MicrosoftAuthService(@Value("${spring.security.oauth2.client.registration.microsoft.client-id}") String azureAdClientId,
                                @Value("${spring.security.oauth2.client.provider.microsoft.issuer-uri}") String azureAdIssuerUri) throws MalformedURLException {
        this.azureAdClientId = azureAdClientId;
        this.azureAdIssuerUri = azureAdIssuerUri;

        // The JWK Set URI can often be found at {issuer-uri}/.well-known/openid-configuration
        // For Azure AD common endpoint: https://login.microsoftonline.com/common/discovery/v2.0/keys
        // Or for a specific tenant: https://login.microsoftonline.com/{tenant-id}/discovery/v2.0/keys
        URL jwkSetURL = new URL(azureAdIssuerUri.replace("/v2.0", "") + "/discovery/v2.0/keys");
        JWKSource<SecurityContext> jwkSource = new RemoteJWKSet<>(jwkSetURL);

        JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(
                JWSAlgorithm.RS256, // Microsoft Entra ID typically uses RS256 for ID tokens
                jwkSource);

        jwtProcessor = new DefaultJWTProcessor<>();
        jwtProcessor.setJWSKeySelector(keySelector);

        // Set the required claims for validation
        jwtProcessor.setJWTClaimsSetVerifier((claims, context) -> {
            if (!claims.getAudience().contains(azureAdClientId)) {
                try {
                    throw new BadJOSEException("Invalid audience claim");
                } catch (BadJOSEException e) {
                    throw new RuntimeException(e);
                }
            }
            if (!claims.getIssuer().equals(azureAdIssuerUri)) {
                try {
                    throw new BadJOSEException("Invalid issuer claim");
                } catch (BadJOSEException e) {
                    throw new RuntimeException(e);
                }
            }
            // Add other checks like expiration time, notBefore time, etc.
            if (claims.getExpirationTime().before(new java.util.Date())) {
                try {
                    throw new BadJOSEException("Expired JWT");
                } catch (BadJOSEException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    public JWTClaimsSet verifyIdToken(String idTokenString) throws ParseException, BadJOSEException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(idTokenString);
        return jwtProcessor.process(signedJWT, null);
    }
}