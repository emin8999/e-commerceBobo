package com.e_commerce_backend.dto.requestdto.user;

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
    private String address;
    private Gender gender;
    private boolean consentMarketing;
    private boolean consentMessagesDelivered;
    private boolean consentMembershipAgreement;

}
