package com.ecommerce.ecommercebackend.mapper;

import com.ecommerce.ecommercebackend.dto.request.user.RegisterRequestDto;
import com.ecommerce.ecommercebackend.dto.response.user.RegisterResponseDto;
import com.ecommerce.ecommercebackend.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserEntity mapToUser(RegisterRequestDto registerRequestDto);

    RegisterResponseDto mapToRegisterResponseDto(UserEntity user);
}