package com.e_commerce_backend.exception;

public class ProductNotInCarException extends CartException {
    public ProductNotInCarException(String message) {
        super(message);
    }
}
