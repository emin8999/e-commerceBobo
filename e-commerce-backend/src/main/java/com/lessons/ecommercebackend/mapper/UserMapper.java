package com.lessons.ecommercebackend.mapper;

import com.lessons.ecommercebackend.dto.request.user.RegisterRequestDto;
import com.lessons.ecommercebackend.dto.response.user.RegisterResponseDto;
import com.lessons.ecommercebackend.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserEntity mapToUser(RegisterRequestDto registerRequestDto);

    RegisterResponseDto mapToRegisterResponseDto(UserEntity user);
}
