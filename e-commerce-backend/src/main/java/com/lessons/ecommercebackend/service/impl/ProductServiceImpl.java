package com.lessons.ecommercebackend.service.impl;

import com.lessons.ecommercebackend.dto.request.product.ProductRequestDto;
import com.lessons.ecommercebackend.dto.response.product.ProductResponseDto;
import com.lessons.ecommercebackend.entity.ProductEntity;
import com.lessons.ecommercebackend.entity.ProductImageEntity;
import com.lessons.ecommercebackend.entity.StoreEntity;
import com.lessons.ecommercebackend.mapper.ProductMapper;
import com.lessons.ecommercebackend.repository.ProductRepository;
import com.lessons.ecommercebackend.security.util.StoreSecurityUtil;
import com.lessons.ecommercebackend.service.ProductService;
import com.lessons.ecommercebackend.util.ProductUtility;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final StoreSecurityUtil storeSecurityUtil;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductResponseDto addProduct(ProductRequestDto productRequestDto) throws AccessDeniedException {
        StoreEntity store = storeSecurityUtil.getCurrentStore();

        ProductEntity product = productMapper.mapToProductEntity(productRequestDto);
        product.setStore(store);

        ProductEntity productToSave = productRepository.save(product);

        List<String> imagePaths = ProductUtility.saveProductImages(
                productRequestDto.getImageUrls(),
                store.getId(),
                productToSave.getId()
        );

        List<ProductImageEntity> productImages = imagePaths.stream()
                .map(path -> {
                    ProductImageEntity image = new ProductImageEntity();
                    image.setImageUrl(path);
                    image.setProduct(productToSave);
                    return image;
                }).collect(Collectors.toList());

        productToSave.setImages(productImages);

        ProductEntity finalProduct = productRepository.save(productToSave);

        return productMapper.mapToProductResponseDto(finalProduct);
    }

    @Override
    @Transactional
    public List<ProductResponseDto> getAllProductsOfCurrentStore() throws AccessDeniedException {
        StoreEntity store = storeSecurityUtil.getCurrentStore();
        List<ProductEntity> products = productRepository.findByStoreId(store.getId());

        return products.stream()
                .peek(product -> {
                    if (product.getImages() != null && !product.getImages().isEmpty()) {
                        product.setImages(List.of(product.getImages().get(0)));
                    } else {
                        product.setImages(Collections.emptyList());
                    }
                })
                .map(productMapper::mapToProductResponseDto)
                .collect(Collectors.toList());
    }
}
