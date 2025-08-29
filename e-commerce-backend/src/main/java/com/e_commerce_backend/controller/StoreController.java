package com.e_commerce_backend.controller;

import com.e_commerce_backend.dto.requestdto.store.StoreRegisterRequest;
import com.e_commerce_backend.dto.requestdto.store.StoreUpdateRequestDto;
import com.e_commerce_backend.dto.requestdto.user.LoginRequestDto;
import com.e_commerce_backend.dto.responseDto.order.OrderResponseDto;
import com.e_commerce_backend.dto.responseDto.product.ProductResponseDto;
import com.e_commerce_backend.dto.responseDto.store.StoreResponseDto;
import com.e_commerce_backend.dto.responseDto.store.StoreStatisticsDto;
import com.e_commerce_backend.dto.responseDto.user.LoginResponseDto;
import com.e_commerce_backend.service.OrderService;
import com.e_commerce_backend.service.ProductService;
import com.e_commerce_backend.service.StoreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.hc.core5.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreController {

    private final StoreService storeService;
    private final OrderService orderService;
    private final ProductService productService;

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<String> register(@ModelAttribute @Valid StoreRegisterRequest request) {
        storeService.registerStore(request);
        return ResponseEntity.ok("register");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        LoginResponseDto response = storeService.login(loginRequestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    @PreAuthorize("authentication.name == authentication.name")
    public ResponseEntity<StoreResponseDto> getStoreInfo()
            throws AccessDeniedException, java.nio.file.AccessDeniedException {
        StoreResponseDto dto = storeService.getCurrentStoreInfo();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/logout")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            storeService.logout(token);
            return ResponseEntity.ok("Store logged out successfully");
        }
        return ResponseEntity.badRequest().body("No valid token provided");
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<OrderResponseDto>> getStoreOrders()
            throws AccessDeniedException, java.nio.file.AccessDeniedException {
        List<OrderResponseDto> orders = orderService.getStoreOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/products")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<List<ProductResponseDto>> getStoreProducts()
            throws AccessDeniedException, java.nio.file.AccessDeniedException {
        List<ProductResponseDto> products = productService.getAllProductsOfCurrentStore();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('STORE')")
    public ResponseEntity<StoreStatisticsDto> getStoreStatistics()
            throws AccessDeniedException, java.nio.file.AccessDeniedException {
        Long orderCount = orderService.getStoreOrderCount();
        BigDecimal earnings = orderService.getStoreEarnings();
        List<ProductResponseDto> products = productService.getAllProductsOfCurrentStore();

        StoreStatisticsDto statistics = StoreStatisticsDto.builder()
                .totalOrders(orderCount)
                .totalEarnings(earnings)
                .totalProducts((long) products.size())
                .build();

        return ResponseEntity.ok(statistics);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<StoreResponseDto> updateStore(
            @RequestHeader("Authorization") String token,
            @RequestParam String storeName,
            @RequestParam String description,
            @RequestParam String phone,
            @RequestPart(required = false) MultipartFile banner,
            @RequestPart(required = false) MultipartFile logo) {

        StoreUpdateRequestDto dto = StoreUpdateRequestDto.builder()
                .storeName(storeName)
                .description(description)
                .phone(phone)
                .build();

        StoreResponseDto updatedStore = storeService.updateStore(token, dto, banner, logo);
        return ResponseEntity.ok(updatedStore);
    }

    @GetMapping("/all")
    public ResponseEntity<List<StoreResponseDto>> getAllStores() {
        List<StoreResponseDto> stores = storeService.getAllStores();
        return ResponseEntity.ok(stores);
    }
}
