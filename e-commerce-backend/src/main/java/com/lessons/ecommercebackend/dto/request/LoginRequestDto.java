package com.lessons.ecommercebackend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class LoginRequestDto {

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Size(min = 3, message = "Email must be at least 6 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 10, max = 64, message = "Password must be at least 6 characters")
    private String password;
}