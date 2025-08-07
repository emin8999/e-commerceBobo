package com.e_commerce_backend.dto.responseDto.store;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreStatisticsDto {

    private Long totalOrders;
    private BigDecimal totalEarnings;
    private Long totalProducts;

}
