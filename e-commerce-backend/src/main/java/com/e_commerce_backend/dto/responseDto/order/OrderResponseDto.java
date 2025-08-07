package com.e_commerce_backend.dto.responseDto.order;


import com.e_commerce_backend.enums.OrderStatus;
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
public class OrderResponseDto {

    private Long id;
    private String orderNumber;
    private OrderStatus status;
    private String statusDisplayName;
    private String statusDescription;
    private boolean canBeModified;

    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shipping;
    private BigDecimal discount;
    private BigDecimal totalAmount;

    private String deliveryAddress;
    private String phoneNumber;
    private String notes;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime preferredDeliveryDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime estimatedDeliveryDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualDeliveryDate;

    private String deliveryTimePreference;
    private boolean expressDelivery;
    private boolean giftWrapping;
    private String giftMessage;

    private Integer totalItems;
    private Integer totalQuantity;

    private List<OrderItemResponseDto> orderItems;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    private OrderTrackingDto tracking;
}
