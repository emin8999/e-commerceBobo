package com.lessons.ecommercebackend.controller;

import com.lessons.ecommercebackend.dto.request.user.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.store.StoreRegisterRequest;
import com.lessons.ecommercebackend.dto.response.user.LoginResponseDto;
import com.lessons.ecommercebackend.dto.response.store.StoreResponseDto;
import com.lessons.ecommercebackend.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RequestMapping("/store")
@RestController
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(@ModelAttribute @Valid StoreRegisterRequest request) {
        storeService.registerStore(request);
        return ResponseEntity.ok("register");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        LoginResponseDto loginResponseDto = storeService.login(loginRequestDto);
        return ResponseEntity.ok(loginResponseDto);
    }

    @GetMapping("/info")
    public ResponseEntity<StoreResponseDto> getStoreInfo() throws AccessDeniedException {
        StoreResponseDto dto = storeService.getCurrentStoreInfo();
        return ResponseEntity.ok(dto);
    }
}
