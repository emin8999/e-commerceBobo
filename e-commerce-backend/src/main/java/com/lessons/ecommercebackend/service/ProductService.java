package com.lessons.ecommercebackend.service;

import com.lessons.ecommercebackend.dto.request.product.ProductRequestDto;
import com.lessons.ecommercebackend.dto.response.product.ProductResponseDto;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface ProductService {
    ProductResponseDto addProduct(ProductRequestDto productRequestDto) throws AccessDeniedException;

    List<ProductResponseDto> getAllProductsOfCurrentStore() throws AccessDeniedException;
}
