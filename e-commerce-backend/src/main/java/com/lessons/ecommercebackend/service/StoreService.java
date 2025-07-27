package com.lessons.ecommercebackend.service;

import com.lessons.ecommercebackend.dto.request.user.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.store.StoreRegisterRequest;
import com.lessons.ecommercebackend.dto.response.user.LoginResponseDto;
import com.lessons.ecommercebackend.dto.response.store.StoreResponseDto;

import java.nio.file.AccessDeniedException;

public interface StoreService {
    void registerStore(StoreRegisterRequest request);

    LoginResponseDto login(LoginRequestDto loginRequestDto);

    StoreResponseDto getCurrentStoreInfo() throws AccessDeniedException;
}
