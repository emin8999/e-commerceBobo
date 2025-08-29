package com.e_commerce_backend.service.impl;

import com.e_commerce_backend.dto.requestdto.product.ProductRequestDto;
import com.e_commerce_backend.dto.responseDto.product.ProductResponseDto;
import com.e_commerce_backend.entity.ProductEntity;
import com.e_commerce_backend.entity.ProductImageEntity;
import com.e_commerce_backend.entity.ProductSizeQuantity;
import com.e_commerce_backend.entity.StoreEntity;
import com.e_commerce_backend.enums.ProductStatus;
import com.e_commerce_backend.exception.ProductNotFoundException;
import com.e_commerce_backend.exception.ProductUnavailableException;
import com.e_commerce_backend.mapper.ProductMapper;
import com.e_commerce_backend.repository.ProductRepository;
import com.e_commerce_backend.security.util.StoreSecurityUtil;
import com.e_commerce_backend.service.ProductService;
import com.e_commerce_backend.util.ProductUtility;
import org.springframework.transaction.annotation.Transactional;
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
    private final ProductUtility productUtility;

    @Override
    @Transactional
    public ProductResponseDto addProduct(ProductRequestDto productRequestDto)
            throws AccessDeniedException, java.nio.file.AccessDeniedException {
        StoreEntity store = storeSecurityUtil.getCurrentStore();
        ProductEntity product = productMapper.mapToProductEntity(productRequestDto);
        product.setStore(store);

        List<ProductSizeQuantity> sizeQuantityEntities = productRequestDto.getSizeQuantities()
                .stream()
                .map(dto -> {
                    ProductSizeQuantity entity = new ProductSizeQuantity();
                    entity.setSize(dto.getSize());
                    entity.setQuantity(dto.getQuantity());
                    entity.setProduct(product);
                    return entity;
                })
                .collect(Collectors.toList());

        product.setSizeQuantities(sizeQuantityEntities);

        ProductEntity productToSave = productRepository.save(product);

        List<String> imagePaths = productUtility.saveProductImages(
                productRequestDto.getImageUrls(),
                store.getId(),
                productToSave.getId());

        List<ProductImageEntity> productImages = imagePaths.stream()
                .map(path -> {
                    ProductImageEntity image = new ProductImageEntity();
                    image.setImageUrl(path);
                    image.setProduct(productToSave);
                    return image;
                })
                .collect(Collectors.toList());

        productToSave.setImages(productImages);

        ProductEntity finalProduct = productRepository.save(productToSave);

        return productMapper.mapToProductResponseDto(finalProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProductsOfCurrentStore()
            throws AccessDeniedException, java.nio.file.AccessDeniedException {
        StoreEntity store = storeSecurityUtil.getCurrentStore();
        List<ProductEntity> products = productRepository.findByStoreId(store.getId());

        return products.stream()
                .map(this::mapProductWithImages)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllActiveProducts() {
        List<ProductEntity> products = productRepository.findByStatus(ProductStatus.ACTIVE);
        return products.stream()
                .map(this::mapProductWithImages)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getActiveProductById(Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new ProductUnavailableException("Product is not available");
        }

        return mapProductWithImages(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getActiveProductsByCategory(String category) {
        List<ProductEntity> products = productRepository.findByCategoryAndStatus(category, ProductStatus.ACTIVE);
        return products.stream()
                .map(this::mapProductWithImages)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getActiveProductsByStore(Long storeId) {
        List<ProductEntity> products = productRepository.findByStoreIdAndStatus(storeId, ProductStatus.ACTIVE);
        return products.stream()
                .map(this::mapProductWithImages)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts() {
        List<ProductEntity> products = productRepository.findAll();
        return products.stream()
                .map(this::mapProductWithImages)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductResponseDto mapProductWithImages(ProductEntity product) {
        ProductResponseDto dto = productMapper.mapToProductResponseDto(product);

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setImageUrls(
                    product.getImages().stream()
                            .map(ProductImageEntity::getImageUrl)
                            .toList());
        } else {
            dto.setImageUrls(Collections.emptyList());
        }

        return dto;
    }
}
