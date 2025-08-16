package com.e_commerce_backend.mapper;

import com.e_commerce_backend.dto.requestdto.product.ProductRequestDto;
import com.e_commerce_backend.dto.responseDto.product.ProductResponseDto;
import com.e_commerce_backend.dto.responseDto.product.SizeQuantityDto;
import com.e_commerce_backend.entity.ProductEntity;
import com.e_commerce_backend.entity.ProductImageEntity;
import com.e_commerce_backend.entity.ProductSizeQuantity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
//    @Mapping(target = "sizes", expression = "java(mapCommaSeparatedStringToList(dto.getSizes()))")
    @Mapping(target = "colors", expression = "java(mapCommaSeparatedStringToList(dto.getColors()))")
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "status", defaultValue = "ACTIVE")
    ProductEntity mapToProductEntity(ProductRequestDto dto);

    @Mapping(target = "imageUrls", expression = "java(mapImages(entity.getImages()))")
    @Mapping(target = "storeName", source = "entity.store.storeName")
    @Mapping(target = "sizeQuantities", source = "sizeQuantities")
    ProductResponseDto mapToProductResponseDto(ProductEntity entity);

    default List<SizeQuantityDto> mapSizeQuantities(List<ProductSizeQuantity> list) {
        if (list == null) return Collections.emptyList();
        return list.stream()
                .map(sq -> new SizeQuantityDto(sq.getSize(), sq.getQuantity()))
                .collect(Collectors.toList());
    }

    default List<String> mapCommaSeparatedStringToList(String value) {
        if (value == null || value.isBlank()) return Collections.emptyList();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    default List<String> mapImages(List<ProductImageEntity> images) {
        if (images == null) return new ArrayList<>();
        return images.stream()
                .map(ProductImageEntity::getImageUrl)
                .collect(Collectors.toList());
    }
}
