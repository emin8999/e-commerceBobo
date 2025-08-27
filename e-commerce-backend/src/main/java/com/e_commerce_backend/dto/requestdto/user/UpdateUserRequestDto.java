package com.e_commerce_backend.dto.requestdto.user;

import java.util.List;

import com.e_commerce_backend.enums.Gender;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserRequestDto {

    private String name;
    private String surname;
    private List<AddressRequestDto> addresses;
    private Gender gender;
    private boolean consentMarketing;
    private boolean consentMessagesDelivered;
    private boolean consentMembershipAgreement;

}
