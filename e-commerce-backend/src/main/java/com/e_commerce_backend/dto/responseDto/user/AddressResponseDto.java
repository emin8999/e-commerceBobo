package com.e_commerce_backend.dto.responseDto.user;

import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AddressResponseDto {

    private Long id;
    private String addresses;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
