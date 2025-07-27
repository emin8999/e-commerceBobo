package com.lessons.ecommercebackend.controller;

import com.lessons.ecommercebackend.dto.request.product.ProductRequestDto;
import com.lessons.ecommercebackend.dto.response.product.ProductResponseDto;
import com.lessons.ecommercebackend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDto> addProduct(
            @ModelAttribute @Valid ProductRequestDto productRequestDto) throws AccessDeniedException {

        ProductResponseDto savedProduct = productService.addProduct(productRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @GetMapping("/my-store")
    public ResponseEntity<List<ProductResponseDto>> getProductsOfCurrentStore() throws AccessDeniedException {
        List<ProductResponseDto> products = productService.getAllProductsOfCurrentStore();
        return ResponseEntity.ok(products);
    }
}