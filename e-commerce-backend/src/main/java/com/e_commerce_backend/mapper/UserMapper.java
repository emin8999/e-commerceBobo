package com.e_commerce_backend.mapper;

import com.e_commerce_backend.dto.requestdto.user.RegisterRequestDto;
import com.e_commerce_backend.dto.requestdto.user.UpdateUserRequestDto;
import com.e_commerce_backend.dto.responseDto.user.RegisterResponseDto;
import com.e_commerce_backend.dto.responseDto.user.UserResponseDto;
import com.e_commerce_backend.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "name", target = "name")
    @Mapping(source = "surname", target = "surname")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "password", target = "password")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "gender", target = "gender")
    UserEntity mapToUser(RegisterRequestDto registerRequestDto);

    @Mapping(target = "message", ignore = true)
    RegisterResponseDto mapToRegisterResponseDto(UserEntity user);

    UserResponseDto mapToUserResponseDto(UserEntity userEntity);

    void updateUserFromDto(UpdateUserRequestDto userRequestDto, @MappingTarget UserEntity userEntity);


}
