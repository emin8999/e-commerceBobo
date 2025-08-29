package com.e_commerce_backend.service;

import com.e_commerce_backend.dto.requestdto.store.StoreRegisterRequest;
import com.e_commerce_backend.dto.requestdto.store.StoreUpdateRequestDto;
import com.e_commerce_backend.dto.requestdto.user.LoginRequestDto;
import com.e_commerce_backend.dto.responseDto.store.StoreResponseDto;
import com.e_commerce_backend.dto.responseDto.user.LoginResponseDto;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface StoreService {

    void registerStore(StoreRegisterRequest request);

    LoginResponseDto login(LoginRequestDto loginRequestDto);

    StoreResponseDto getCurrentStoreInfo() throws AccessDeniedException;

    List<StoreResponseDto> getAllStores();

    void deleteStore(Long id);

    void logout(String token);

    StoreResponseDto updateStore(String token, StoreUpdateRequestDto dto, MultipartFile banner, MultipartFile logo);
    
}
