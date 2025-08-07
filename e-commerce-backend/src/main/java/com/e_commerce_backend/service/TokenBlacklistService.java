package com.e_commerce_backend.service;

public interface TokenBlacklistService {

    void blacklistToken(String token);
    boolean isTokenBlacklisted(String token);
    void cleanupExpiredTokens();

}
