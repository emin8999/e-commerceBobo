package com.lessons.ecommercebackend.dto.response.store;

import lombok.Data;

@Data
public class StoreResponseDto {
    private Long id;
    private String name;
    private String ownerName;
    private String email;
    private String phone;
    private String logo;
    private String banner;
    private String category;
    private String location;
}
