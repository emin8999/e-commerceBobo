package com.lessons.ecommercebackend.controller;

import com.lessons.ecommercebackend.dto.request.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.RegisterRequestDto;
import com.lessons.ecommercebackend.dto.response.LoginResponseDto;
import com.lessons.ecommercebackend.dto.response.RegisterResponseDto;
import com.lessons.ecommercebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@RequestBody RegisterRequestDto registerRequestDto) {
        RegisterResponseDto registerResponseDto = userService.register(registerRequestDto);
        return ResponseEntity.ok(registerResponseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        LoginResponseDto loginResponseDto = userService.login(loginRequestDto);
        return ResponseEntity.ok(loginResponseDto);
    }
}
