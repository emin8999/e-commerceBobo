package com.e_commerce_backend.exception;

public class OrderAccessDeniedException extends OrderException {
    public OrderAccessDeniedException(String message) {
        super(message);
    }
}
