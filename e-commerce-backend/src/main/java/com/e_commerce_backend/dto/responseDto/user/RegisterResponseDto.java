package com.e_commerce_backend.dto.responseDto.user;

import com.e_commerce_backend.enums.Gender;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponseDto {

    private Long id;
    private String name;
    private String surname;
    private String email;
    private String address;
    private Gender gender;
    private LocalDateTime createdAt;
    private String message;

}
