package com.e_commerce_backend.service;

import com.e_commerce_backend.dto.requestdto.user.LoginRequestDto;
import com.e_commerce_backend.dto.requestdto.user.RegisterRequestDto;
import com.e_commerce_backend.dto.requestdto.user.UpdateUserRequestDto;
import com.e_commerce_backend.dto.responseDto.user.LoginResponseDto;
import com.e_commerce_backend.dto.responseDto.user.RegisterResponseDto;
import com.e_commerce_backend.dto.responseDto.user.UserResponseDto;
import com.e_commerce_backend.entity.UserEntity;

import java.util.List;

public interface UserService {

    RegisterResponseDto register(RegisterRequestDto registerRequestDto);

    LoginResponseDto login(LoginRequestDto loginRequestDto);

    LoginResponseDto adminLogin(LoginRequestDto loginRequestDto);

    List<UserEntity> getAllUsers();

    UserEntity getCurrentUserEntity();

    UserResponseDto getCurrentUser();

    UserResponseDto updateCurrentUser(UpdateUserRequestDto userResponseDto);

    void deleteUser(Long id);

    Object getCurrentUserOrders();

    Object getCurrentUserAddresses();

    Object addUserAddress(Object address);

    Object getSystemStats();

    void logout(String token);
}
