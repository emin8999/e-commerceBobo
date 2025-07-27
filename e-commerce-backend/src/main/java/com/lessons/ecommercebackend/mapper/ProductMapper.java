package com.lessons.ecommercebackend.mapper;

import com.lessons.ecommercebackend.dto.request.product.ProductRequestDto;
import com.lessons.ecommercebackend.dto.response.product.ProductResponseDto;
import com.lessons.ecommercebackend.entity.ProductEntity;
import com.lessons.ecommercebackend.entity.ProductImageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "sizes", expression = "java(mapCommaSeparatedStringToList(dto.getSizes()))")
    @Mapping(target = "colors", expression = "java(mapCommaSeparatedStringToList(dto.getColors()))")
    @Mapping(target = "images", ignore = true)
    ProductEntity mapToProductEntity(ProductRequestDto dto);

    @Mapping(target = "imageUrls", expression = "java(mapImages(entity.getImages()))")
    ProductResponseDto mapToProductResponseDto(ProductEntity entity);

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
