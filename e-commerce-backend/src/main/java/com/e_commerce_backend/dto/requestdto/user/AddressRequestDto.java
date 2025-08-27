package com.e_commerce_backend.dto.requestdto.user;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressRequestDto {

    
    @Size(max = 500,message = "Address cannot exceed 500 characters")
    private String addresses;
}
