package com.e_commerce_backend.dto.requestdto.store;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class StoreUpdateRequestDto {

    @NotBlank(message = "Store name is required")
    @Size(min = 3, max = 100, message = "Name must be at least 3 characters")
    private String storeName;

    @Pattern(regexp = "\\+?[0-9]{7,15}", message = "Phone number is invalid")
    private String phone;

    @NotBlank(message = "Description is required")
    @Size(min = 5, max = 255, message = "Description must be at least 5 characters")
    private String description;

}
