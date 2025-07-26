package com.lessons.ecommercebackend.controller;

import com.lessons.ecommercebackend.dto.request.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.RegisterRequestDto;
import com.lessons.ecommercebackend.dto.request.StoreRegisterRequest;
import com.lessons.ecommercebackend.dto.response.LoginResponseDto;
import com.lessons.ecommercebackend.dto.response.RegisterResponseDto;
import com.lessons.ecommercebackend.service.StoreService;
import com.lessons.ecommercebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/store")
@RestController
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(@ModelAttribute StoreRegisterRequest request) {
        storeService.registerStore(request);
        return ResponseEntity.ok("register");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        LoginResponseDto loginResponseDto = storeService.login(loginRequestDto);
        return ResponseEntity.ok(loginResponseDto);
    }
}
