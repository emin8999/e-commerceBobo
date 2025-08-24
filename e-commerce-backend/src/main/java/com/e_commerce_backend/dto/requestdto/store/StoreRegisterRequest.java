package com.e_commerce_backend.dto.requestdto.store;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreRegisterRequest {

    @NotBlank(message = "Store name is required")
    @Size(min = 3, max = 100, message = "Name must be at least 3 characters")
    private String storeName;

    @NotBlank(message = "Owner name is required")
    @Size(min = 1, max = 100, message = "Name must be at least 6 characters")
    private String ownerName;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Size(min = 3, max = 150, message = "Email must be at least 3 characters")
    private String email;

    @Size(min = 5, max = 64, message = "Password must be at least 5 characters")
    private String password;

    @Size(min = 5, max = 64, message = "Confirm password must be at least 5 characters")
    private String confirmPassword;

    @Pattern(regexp = "\\+?[0-9]{7,15}", message = "Phone number is invalid")
    private String phone;

    private MultipartFile logo;

    private MultipartFile banner;

    @NotBlank(message = "Description is required")
    @Size(min = 5 , max = 255, message = "Description must be at least 5 characters")
    private String description;

    @NotBlank(message = "Category is required")
    @Size(min = 1, max = 50, message = "Name must be at least 3 characters")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;

    @AssertTrue(message = "You must agree to the terms")
    private Boolean agreedToTerms;

}
