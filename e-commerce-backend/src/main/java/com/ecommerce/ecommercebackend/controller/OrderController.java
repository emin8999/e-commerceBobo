package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.dto.request.order.CreateOrderRequestDto;
import com.ecommerce.ecommercebackend.dto.response.order.OrderResponseDto;
import com.ecommerce.ecommercebackend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/orders")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "Order operations for authenticated users")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Create order from cart", description = "Create a new order from current cart items")
    @ApiResponse(responseCode = "201", description = "Order created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request data or empty cart")
    @PostMapping("/create")
    public ResponseEntity<OrderResponseDto> createOrder(@RequestBody @Valid CreateOrderRequestDto createOrderRequestDto) {
        log.info("Creating new order from cart");
        OrderResponseDto response = orderService.createOrderFromCart(createOrderRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get user orders", description = "Retrieve all orders for current user")
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDto>> getUserOrders() {
        List<OrderResponseDto> orders = orderService.getUserOrders();
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get order by ID", description = "Get specific order details")
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderById(
        @Parameter(description = "Order ID") @PathVariable Long orderId) {
        OrderResponseDto order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @Operation(summary = "Cancel order", description = "Cancel a pending order")
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, String>> cancelOrder(
        @Parameter(description = "Order ID") @PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(Map.of("status", "cancelled", "message", "Order cancelled successfully"));
    }

    @Operation(summary = "Get all orders (Admin)", description = "Get all orders in system - Admin only")
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        List<OrderResponseDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Update order status (Admin)", description = "Update order status - Admin only")
    @PutMapping("/admin/{orderId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
        @Parameter(description = "Order ID") @PathVariable Long orderId,
        @Parameter(description = "New status") @PathVariable String status) {
        OrderResponseDto response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(response);
    }
}