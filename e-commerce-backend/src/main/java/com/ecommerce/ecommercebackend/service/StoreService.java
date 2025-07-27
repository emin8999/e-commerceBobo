package com.ecommerce.ecommercebackend.service;

import com.ecommerce.ecommercebackend.dto.request.store.StoreRegisterRequest;
import com.ecommerce.ecommercebackend.dto.request.user.LoginRequestDto;
import com.ecommerce.ecommercebackend.dto.response.store.StoreResponseDto;
import com.ecommerce.ecommercebackend.dto.response.user.LoginResponseDto;

import java.nio.file.AccessDeniedException;

public interface StoreService {
    void registerStore(StoreRegisterRequest request);

    LoginResponseDto login(LoginRequestDto loginRequestDto);

    StoreResponseDto getCurrentStoreInfo() throws AccessDeniedException;
}