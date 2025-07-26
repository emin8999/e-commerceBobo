package com.lessons.ecommercebackend.service;

import com.lessons.ecommercebackend.dto.request.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.StoreRegisterRequest;
import com.lessons.ecommercebackend.dto.response.LoginResponseDto;

public interface StoreService {
    void registerStore(StoreRegisterRequest request);
    LoginResponseDto login(LoginRequestDto loginRequestDto);
}
