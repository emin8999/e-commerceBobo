package com.e_commerce_backend.service;

import com.e_commerce_backend.dto.requestdto.order.CreateOrderRequestDto;
import com.e_commerce_backend.dto.responseDto.order.OrderResponseDto;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.List;

public interface OrderService {

    OrderResponseDto createOrderFromCart(CreateOrderRequestDto createOrderRequestDto);

    List<OrderResponseDto> getUserOrders();

    OrderResponseDto getOrderById(Long orderId);

    List<OrderResponseDto> getAllOrders();

    OrderResponseDto updateOrderStatus(Long orderId, String status);

    void cancelOrder(Long orderId);

    List<OrderResponseDto> getStoreOrders() throws AccessDeniedException, java.nio.file.AccessDeniedException;

    Long getStoreOrderCount() throws AccessDeniedException, java.nio.file.AccessDeniedException;

    BigDecimal getStoreEarnings() throws AccessDeniedException, java.nio.file.AccessDeniedException;
}
