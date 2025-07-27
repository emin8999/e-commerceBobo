package com.ecommerce.ecommercebackend.dto.request.user;

import com.ecommerce.ecommercebackend.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterRequestDto {

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Size(min = 6, message = "Email must be at least 6 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 10, max = 64, message = "Password must be between 10 and 64 characters")
    private String password;

    private Gender gender;

    @NotNull(message = "Consent for marketing must be given")
    private Boolean consentMarketing;

    @NotNull(message = "Consent for messages delivered must be given")
    private Boolean consentMessagesDelivered;

    @NotNull(message = "Consent for membership agreement must be given")
    private Boolean consentMembershipAgreement;
}
