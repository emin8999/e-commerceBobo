package com.e_commerce_backend.dto.responseDto.cart;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartSummaryDto {

    private Integer totalItems;
    private Integer totalQuantity;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shipping;
    private BigDecimal discount;
    private BigDecimal total;
    private boolean hasOutOfStockItems;
    private boolean hasUnavailableItems;
    private List<CartResponseDto> items;

}
