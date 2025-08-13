package com.e_commerce_backend.exception;

public class PasswordMismatchException extends UserException {
    public PasswordMismatchException() {
        super("Passwords do not match");
    }
}
