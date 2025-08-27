package com.e_commerce_backend.controller;

import com.e_commerce_backend.dto.requestdto.user.AddressRequestDto;
import com.e_commerce_backend.dto.requestdto.user.UpdateUserRequestDto;
import com.e_commerce_backend.dto.responseDto.user.AddressResponseDto;
import com.e_commerce_backend.dto.responseDto.user.UserResponseDto;
import com.e_commerce_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

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
    public ResponseEntity<List<AddressResponseDto>> getUserAddresses(
            @RequestHeader("Authorization") String token) {
        List<AddressResponseDto> addresses = userService.getUserAddresses(token);
        return ResponseEntity.ok(addresses);
    }

    
       @PostMapping("/addresses")
        public ResponseEntity<AddressResponseDto> addAddress(
        @RequestHeader("Authorization") String token,
        @RequestBody AddressRequestDto addressRequest) {
        AddressResponseDto newAddress = userService.addUserAddress(token, addressRequest);
        return ResponseEntity.ok(newAddress);
}

    
}

     

   // @PutMapping("/addresses")
  //  public ResponseEntity<AddressResponseDto> updateAddress(
   //         @RequestHeader("Authorization") String token,
    //        @RequestBody AddressRequestDto addressRequest) {
   //     AddressResponseDto updatedAddress = userService.updateUserAddress(token, addressRequest);
   //     return ResponseEntity.ok(updatedAddress);
   // }




