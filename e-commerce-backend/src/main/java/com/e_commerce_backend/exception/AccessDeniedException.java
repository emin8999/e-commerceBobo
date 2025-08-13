package com.e_commerce_backend.exception;

public class AccessDeniedException extends UserException {
    public AccessDeniedException() {
        super("Access denied");
    }
}
