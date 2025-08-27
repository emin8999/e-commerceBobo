package com.e_commerce_backend.mapper;

import com.e_commerce_backend.dto.requestdto.user.AddressRequestDto;
import com.e_commerce_backend.dto.requestdto.user.RegisterRequestDto;
import com.e_commerce_backend.dto.requestdto.user.UpdateUserRequestDto;
import com.e_commerce_backend.dto.responseDto.user.RegisterResponseDto;
import com.e_commerce_backend.dto.responseDto.user.UserResponseDto;
import com.e_commerce_backend.entity.AddressEntity;
import com.e_commerce_backend.entity.UserEntity;

import java.util.List;
import java.util.stream.Collectors;

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
    @Mapping(source = "phone",target = "phone")
    @Mapping(source = "addresses", target = "addresses")
    @Mapping(source = "gender", target = "gender")
    UserEntity mapToUser(RegisterRequestDto registerRequestDto);

    @Mapping(target = "message", ignore = true)
    @Mapping(source  = "addresses",target= "addresses")
    RegisterResponseDto mapToRegisterResponseDto(UserEntity user);

    @Mapping(source  = "addresses",target= "addresses")
    UserResponseDto mapToUserResponseDto(UserEntity userEntity);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "addresses", target = "addresses")
    void updateUserFromDto(UpdateUserRequestDto userRequestDto, @MappingTarget UserEntity userEntity);


     default List<AddressEntity> mapAddressRequestDtosToAddressEntities(List<AddressRequestDto> dtos) {
        if (dtos == null) return null;
        return dtos.stream()
                .map(dto -> {
                    AddressEntity entity = new AddressEntity();
                    entity.setAddresses(dto.getAddresses()); 
                    return entity;
                })
                .collect(Collectors.toList());
    }

    default List<AddressRequestDto> mapAddressEntitiesToAddressRequestDtos(List<AddressEntity> addresses) {
        if (addresses == null) return null;
        return addresses.stream()
                .map(address -> {
                    AddressRequestDto dto = new AddressRequestDto();
                    dto.setAddresses(address.getAddresses());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}



