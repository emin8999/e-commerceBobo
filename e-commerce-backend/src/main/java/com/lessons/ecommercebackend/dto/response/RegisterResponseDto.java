package com.lessons.ecommercebackend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class RegisterResponseDto {
    private String email;
    private String password;
}
