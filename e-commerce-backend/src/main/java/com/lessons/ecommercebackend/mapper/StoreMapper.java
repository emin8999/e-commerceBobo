package com.lessons.ecommercebackend.mapper;

import com.lessons.ecommercebackend.dto.request.StoreRegisterRequest;
import com.lessons.ecommercebackend.entity.StoreEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StoreMapper {

    @Mapping(target = "logo", ignore = true)
    @Mapping(target = "banner", ignore = true)
    StoreEntity mapToStoreEntity(StoreRegisterRequest storeRegisterRequest);
}
