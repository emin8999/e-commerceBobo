package com.e_commerce_backend.dto.responseDto.user;

import lombok.*;


public record LoginResponseDto(String token, String tokenType) {

}
