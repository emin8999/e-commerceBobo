package com.ecommerce.ecommercebackend.service;

import com.ecommerce.ecommercebackend.dto.request.order.CreateOrderRequestDto;
import com.ecommerce.ecommercebackend.dto.response.order.OrderResponseDto;

import java.util.List;

public interface OrderService {
    
    OrderResponseDto createOrderFromCart(CreateOrderRequestDto createOrderRequestDto);
    
    List<OrderResponseDto> getUserOrders();
    
    OrderResponseDto getOrderById(Long orderId);
    
    List<OrderResponseDto> getAllOrders();
    
    OrderResponseDto updateOrderStatus(Long orderId, String status);
    
    void cancelOrder(Long orderId);
}