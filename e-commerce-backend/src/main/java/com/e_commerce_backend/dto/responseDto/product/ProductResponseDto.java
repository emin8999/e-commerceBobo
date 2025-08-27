package com.e_commerce_backend.dto.responseDto.product;

import com.e_commerce_backend.enums.ProductStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponseDto {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private List<String> colors;
    private ProductStatus status;
    private String storeName;
    private List<String> imageUrls;
    private List<SizeQuantityDto> sizeQuantities;

}
