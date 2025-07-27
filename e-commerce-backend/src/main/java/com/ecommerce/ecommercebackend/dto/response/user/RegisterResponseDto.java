package com.ecommerce.ecommercebackend.dto.response.user;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterResponseDto {
    private String email;
    private String password;
}
