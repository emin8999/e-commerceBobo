package com.lessons.ecommercebackend.service;

import com.lessons.ecommercebackend.dto.request.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.RegisterRequestDto;
import com.lessons.ecommercebackend.dto.response.LoginResponseDto;
import com.lessons.ecommercebackend.dto.response.RegisterResponseDto;

public interface UserService {
    RegisterResponseDto register(RegisterRequestDto registerRequestDto);
    LoginResponseDto login(LoginRequestDto loginRequestDto);
}
