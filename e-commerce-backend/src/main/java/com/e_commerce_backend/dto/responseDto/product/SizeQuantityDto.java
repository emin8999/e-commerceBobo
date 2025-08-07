package com.e_commerce_backend.dto.responseDto.product;

import com.e_commerce_backend.enums.ProductSize;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SizeQuantityDto {

    private ProductSize size;
    private Integer quantity;

}
