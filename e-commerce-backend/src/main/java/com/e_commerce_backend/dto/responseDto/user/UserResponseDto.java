package com.e_commerce_backend.dto.responseDto.user;

import com.e_commerce_backend.enums.Gender;
import com.e_commerce_backend.enums.Roles;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

    private Long id;
    private String email;
    private String name;
    private String surname;
    private String address;
    private Gender gender;
    private boolean consentMarketing;
    private boolean consentMessagesDelivered;
    private boolean consentMembershipAgreement;
    private Set<Roles> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
