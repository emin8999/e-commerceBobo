package com.e_commerce_backend.exception;

public class UserNotFoundException extends UserException {
    public UserNotFoundException() {
        super("User not found ");
    }
}
