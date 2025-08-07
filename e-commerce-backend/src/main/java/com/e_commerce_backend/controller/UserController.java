package com.e_commerce_backend.controller;

import com.e_commerce_backend.dto.requestdto.user.UpdateUserRequestDto;
import com.e_commerce_backend.dto.responseDto.user.UserResponseDto;
import com.e_commerce_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDto> getCurrentUserProfile() {
        UserResponseDto userResponseDto = userService.getCurrentUser();
        return ResponseEntity.ok(userResponseDto);

    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto> updateProfile(@RequestBody @Valid UpdateUserRequestDto userRequestDto) {
        UserResponseDto updatedUser = userService.updateCurrentUser(userRequestDto);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/orders")
    public ResponseEntity<Object> getUserOrders() {
        Object orders = userService.getCurrentUserOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/addresses")
    public ResponseEntity<Object> getUserAddresses() {
        Object addresses = userService.getCurrentUserAddresses();
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/addresses")
    public ResponseEntity<Object> addUserAddress(@RequestBody Object address) {
        Object newAddress = userService.addUserAddress(address);
        return ResponseEntity.ok(newAddress);
    }
}
