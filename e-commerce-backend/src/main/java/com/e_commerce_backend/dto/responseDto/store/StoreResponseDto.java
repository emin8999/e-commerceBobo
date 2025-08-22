package com.e_commerce_backend.dto.responseDto.store;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreResponseDto {

    private Long id;
    private String storeName;
    private String ownerName;
    private String email;
    private String phone;
    private String logo;
    private String banner;
    private String description;
    private String category;
    private String location;

}
