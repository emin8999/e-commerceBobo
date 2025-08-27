package com.e_commerce_backend.repository;

import com.e_commerce_backend.entity.ProductEntity;
import com.e_commerce_backend.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {

  
    List<ProductEntity> findByStoreId(Long id);
    List<ProductEntity> findByStatus(ProductStatus status);
    List<ProductEntity> findByCategoryAndStatus(String category, ProductStatus status);
    List<ProductEntity> findByStoreIdAndStatus(Long storeId, ProductStatus status);

}
