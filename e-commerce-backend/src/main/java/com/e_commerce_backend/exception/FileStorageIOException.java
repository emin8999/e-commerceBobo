package com.e_commerce_backend.exception;

public class FileStorageIOException extends FileStorageException {
    public FileStorageIOException(String message,Throwable cause) {
        super(message + ". Cause: " + cause.getMessage());
    }
}
