package com.e_commerce_backend.service;

import com.e_commerce_backend.dto.requestdto.product.ProductRequestDto;
import com.e_commerce_backend.dto.responseDto.product.ProductResponseDto;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface ProductService {

    ProductResponseDto addProduct(ProductRequestDto productRequestDto) throws AccessDeniedException;

    List<ProductResponseDto> getAllProductsOfCurrentStore() throws AccessDeniedException;

    List<ProductResponseDto> getAllActiveProducts();

    ProductResponseDto getActiveProductById(Long id);

    List<ProductResponseDto> getActiveProductsByCategory(String category);

    List<ProductResponseDto> getActiveProductsByStore(Long storeId);

    List<ProductResponseDto> getAllProducts();

    void deleteProduct(Long id);

}
