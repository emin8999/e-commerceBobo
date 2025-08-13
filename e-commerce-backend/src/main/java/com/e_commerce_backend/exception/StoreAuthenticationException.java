package com.e_commerce_backend.exception;

public class StoreAuthenticationException extends StoreException {
    public StoreAuthenticationException() {
        super("Authentication failed");
    }
}
