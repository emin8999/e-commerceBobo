package com.ecommerce.ecommercebackend.dto.response.product;

import com.ecommerce.ecommercebackend.enums.ProductStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
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
