package com.e_commerce_backend.dto.responseDto.cart;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponseDto {

    private Long id;
    private Long productId;
    private String productName;
    private String productDescription;
    private BigDecimal productPrice;
    private String productImage;
    private List<String> productImages;
    private String productCategory;
    private Integer quantity;
    private String size;
    private List<String> availableSizes;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private boolean productAvailable;
    private Integer productStock;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

}
