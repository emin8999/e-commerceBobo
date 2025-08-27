package com.e_commerce_backend.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.e_commerce_backend.dto.requestdto.user.AddressRequestDto;
import com.e_commerce_backend.dto.responseDto.user.AddressResponseDto;
import com.e_commerce_backend.entity.AddressEntity;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    @Mapping(target = "userEntity", ignore = true)
    AddressEntity addressRequestDtoToAddressEntity(AddressRequestDto dto);
    
    @Mapping(source = "addresses", target = "addresses") 
    AddressResponseDto addressEntityToAddressResponseDto(AddressEntity entity);
    
    default List<AddressEntity> addressRequestDtoListToAddressEntityList(List<AddressRequestDto> dtos) {
        if (dtos == null) return null;
        return dtos.stream()
                .map(this::addressRequestDtoToAddressEntity)
                .collect(Collectors.toList());
    }
    
    default List<AddressResponseDto> addressEntityListToAddressResponseDtoList(List<AddressEntity> entities) {
        if (entities == null) return null;
        return entities.stream()
                .map(this::addressEntityToAddressResponseDto)
                .collect(Collectors.toList());
    }
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userEntity", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    void updateAddressFromDto(AddressRequestDto dto, @MappingTarget AddressEntity entity);
}
