package com.lessons.ecommercebackend.dto.request.product;

import com.lessons.ecommercebackend.enums.ProductStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductRequestDto {

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must be less than 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be a positive number")
    private Double price;

    @NotBlank(message = "Category is required")
    @Size(max = 30, message = "Category must be less than 30 characters")
    private String category;

    @NotBlank(message = "Sizes field is required (comma-separated values)")
    private String sizes;

    @NotBlank(message = "Colors field is required (comma-separated values)")
    private String colors;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity cannot be negative or 0")
    private Integer quantity;

    @NotNull(message = "Product status is required")
    private ProductStatus status;

    @NotEmpty(message = "At least one product image must be uploaded")
    private List<@NotNull MultipartFile> imageUrls;

    @NotBlank(message = "Store name is required")
    private String storeName;
}
