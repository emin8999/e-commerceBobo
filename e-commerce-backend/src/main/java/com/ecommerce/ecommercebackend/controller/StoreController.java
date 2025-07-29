package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.dto.request.store.StoreRegisterRequest;
import com.ecommerce.ecommercebackend.dto.request.user.LoginRequestDto;
import com.ecommerce.ecommercebackend.dto.response.store.StoreResponseDto;
import com.ecommerce.ecommercebackend.dto.response.user.LoginResponseDto;
import com.ecommerce.ecommercebackend.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreController {

    private final StoreService storeService;

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
    public ResponseEntity<StoreResponseDto> getStoreInfo() throws AccessDeniedException, java.nio.file.AccessDeniedException {
        StoreResponseDto dto = storeService.getCurrentStoreInfo();
        return ResponseEntity.ok(dto);
    }
}