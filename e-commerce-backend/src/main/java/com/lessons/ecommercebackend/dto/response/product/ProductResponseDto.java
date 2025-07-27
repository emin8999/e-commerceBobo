package com.lessons.ecommercebackend.dto.response.product;

import com.lessons.ecommercebackend.enums.ProductStatus;
import lombok.Data;
import java.util.List;

@Data
public class ProductResponseDto {

    private String name;

    private String description;

    private Double price;

    private List<String> sizes;

    private List<String> colors;

    private Integer quantity;

    private ProductStatus status;

    private List<String> imageUrls;

}
