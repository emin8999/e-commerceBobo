package com.lessons.ecommercebackend.mapper;

import com.lessons.ecommercebackend.dto.request.store.StoreRegisterRequest;
import com.lessons.ecommercebackend.dto.response.store.StoreResponseDto;
import com.lessons.ecommercebackend.entity.StoreEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StoreMapper {

    @Mapping(target = "logo", ignore = true)
    @Mapping(target = "banner", ignore = true)
    StoreEntity mapToStoreEntity(StoreRegisterRequest storeRegisterRequest);

    @Mapping(target = "logo", expression = "java(mapImage(storeEntity.getId(), \"logo\", storeEntity.getLogo()))")
    @Mapping(target = "banner", expression = "java(mapImage(storeEntity.getId(), \"banner\", storeEntity.getBanner()))")
    StoreResponseDto mapToStoreResponse(StoreEntity storeEntity);

    default String mapImage(Long storeId, String type, String filename) {
        if (filename == null || filename.isEmpty()) {
            return null;
        }
        return "images/store_" + storeId + "/" + type + "/" + filename;
    }


}
