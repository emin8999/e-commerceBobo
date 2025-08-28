package com.e_commerce_backend.mapper;

import com.e_commerce_backend.dto.requestdto.store.StoreRegisterRequest;
import com.e_commerce_backend.dto.responseDto.store.StoreResponseDto;
import com.e_commerce_backend.entity.StoreEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StoreMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "productEntities", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "logo", expression = "java(storeRegisterRequest.getLogo().getOriginalFilename())")
    @Mapping(target = "banner",expression = "java(storeRegisterRequest.getLogo().getOriginalFilename())")
    @Mapping(target = "storeName",source = "storeName")
    @Mapping(target = "description",source = "description")
    StoreEntity mapToStoreEntity(StoreRegisterRequest storeRegisterRequest);


    //    @Mapping(target = "logo", expression = "java(mapImage(storeEntity.getId(), \"logo\", storeEntity.getLogo()))")
//    @Mapping(target = "banner", expression = "java(mapImage(storeEntity.getId(), \"banner\", storeEntity.getBanner()))")
    StoreResponseDto mapToStoreResponse(StoreEntity storeEntity);

//    default String mapImage(Long storeId, String type, String filename) {
//        return filename != null && !filename.isEmpty()
//                ? "images/store_" + storeId + "/" + type + "/" + filename
//                : null;
//    }
}
