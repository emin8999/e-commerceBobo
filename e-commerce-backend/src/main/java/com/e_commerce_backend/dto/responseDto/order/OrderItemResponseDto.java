package com.e_commerce_backend.dto.responseDto.order;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemResponseDto {

    private Long id;
    private Long productId;
    private String productName;
    private String productDescription;
    private String productImage;
    private List<String> productImages;
    private String productCategory;
    private String productBrand;
    private String productSku;

    private Integer quantity;
    private String size;
    private String color;

    private BigDecimal unitPrice;
    private BigDecimal originalPrice;
    private BigDecimal discountAmount;
    private BigDecimal totalPrice;

    private boolean productAvailable;
    private boolean canReview;
    private boolean isReviewed;

    private Long storeId;
    private String storeName;

}
