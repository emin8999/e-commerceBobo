package com.e_commerce_backend.dto.responseDto.user;

import com.e_commerce_backend.dto.requestdto.user.AddressRequestDto;
import com.e_commerce_backend.enums.Gender;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponseDto {

    private Long id;
    private String name;
    private String surname;
    private String phone;
    private String email;
    private List<AddressRequestDto> addresses;
    private Gender gender;
    private LocalDateTime createdAt;
    private String message;

}
