package com.e_commerce_backend.exception;

public class CartItemNotFoundException extends CartException {
    public CartItemNotFoundException(String message) {
        super(message);
    }
}
