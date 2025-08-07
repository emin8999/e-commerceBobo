package com.e_commerce_backend.mapper;

import com.e_commerce_backend.dto.requestdto.product.ProductRequestDto;
import com.e_commerce_backend.dto.responseDto.product.ProductResponseDto;
import com.e_commerce_backend.dto.responseDto.product.SizeQuantityDto;
import com.e_commerce_backend.entity.ProductEntity;
import com.e_commerce_backend.entity.ProductSizeQuantity;
import com.e_commerce_backend.entity.StoreEntity;
import com.e_commerce_backend.enums.ProductStatus;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-07T11:34:41+0400",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductEntity mapToProductEntity(ProductRequestDto dto) {
        if ( dto == null ) {
            return null;
        }

        ProductEntity.ProductEntityBuilder productEntity = ProductEntity.builder();

        if ( dto.getStatus() != null ) {
            productEntity.status( dto.getStatus() );
        }
        else {
            productEntity.status( ProductStatus.ACTIVE );
        }
        productEntity.name( dto.getName() );
        productEntity.description( dto.getDescription() );
        productEntity.price( dto.getPrice() );
        productEntity.category( dto.getCategory() );
        productEntity.sizeQuantities( sizeQuantityDtoListToProductSizeQuantityList( dto.getSizeQuantities() ) );

        productEntity.colors( mapCommaSeparatedStringToList(dto.getColors()) );

        return productEntity.build();
    }

    @Override
    public ProductResponseDto mapToProductResponseDto(ProductEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ProductResponseDto.ProductResponseDtoBuilder productResponseDto = ProductResponseDto.builder();

        productResponseDto.storeName( entityStoreName( entity ) );
        productResponseDto.sizeQuantities( mapSizeQuantities( entity.getSizeQuantities() ) );
        productResponseDto.name( entity.getName() );
        productResponseDto.description( entity.getDescription() );
        productResponseDto.price( entity.getPrice() );
        List<String> list1 = entity.getColors();
        if ( list1 != null ) {
            productResponseDto.colors( new ArrayList<String>( list1 ) );
        }
        productResponseDto.status( entity.getStatus() );

        productResponseDto.imageUrls( mapImages(entity.getImages()) );

        return productResponseDto.build();
    }

    protected ProductSizeQuantity sizeQuantityDtoToProductSizeQuantity(SizeQuantityDto sizeQuantityDto) {
        if ( sizeQuantityDto == null ) {
            return null;
        }

        ProductSizeQuantity productSizeQuantity = new ProductSizeQuantity();

        productSizeQuantity.setSize( sizeQuantityDto.getSize() );
        productSizeQuantity.setQuantity( sizeQuantityDto.getQuantity() );

        return productSizeQuantity;
    }

    protected List<ProductSizeQuantity> sizeQuantityDtoListToProductSizeQuantityList(List<SizeQuantityDto> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductSizeQuantity> list1 = new ArrayList<ProductSizeQuantity>( list.size() );
        for ( SizeQuantityDto sizeQuantityDto : list ) {
            list1.add( sizeQuantityDtoToProductSizeQuantity( sizeQuantityDto ) );
        }

        return list1;
    }

    private String entityStoreName(ProductEntity productEntity) {
        if ( productEntity == null ) {
            return null;
        }
        StoreEntity store = productEntity.getStore();
        if ( store == null ) {
            return null;
        }
        String name = store.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
