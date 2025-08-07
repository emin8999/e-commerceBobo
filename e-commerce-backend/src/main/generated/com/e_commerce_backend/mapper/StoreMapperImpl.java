package com.e_commerce_backend.mapper;

import com.e_commerce_backend.dto.requestdto.store.StoreRegisterRequest;
import com.e_commerce_backend.dto.responseDto.store.StoreResponseDto;
import com.e_commerce_backend.entity.StoreEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-07T11:34:41+0400",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class StoreMapperImpl implements StoreMapper {

    @Override
    public StoreEntity mapToStoreEntity(StoreRegisterRequest storeRegisterRequest) {
        if ( storeRegisterRequest == null ) {
            return null;
        }

        StoreEntity.StoreEntityBuilder storeEntity = StoreEntity.builder();

        storeEntity.name( storeRegisterRequest.getName() );
        storeEntity.ownerName( storeRegisterRequest.getOwnerName() );
        storeEntity.email( storeRegisterRequest.getEmail() );
        storeEntity.password( storeRegisterRequest.getPassword() );
        storeEntity.phone( storeRegisterRequest.getPhone() );
        storeEntity.category( storeRegisterRequest.getCategory() );
        storeEntity.location( storeRegisterRequest.getLocation() );
        storeEntity.agreedToTerms( storeRegisterRequest.getAgreedToTerms() );

        return storeEntity.build();
    }

    @Override
    public StoreResponseDto mapToStoreResponse(StoreEntity storeEntity) {
        if ( storeEntity == null ) {
            return null;
        }

        StoreResponseDto.StoreResponseDtoBuilder storeResponseDto = StoreResponseDto.builder();

        storeResponseDto.id( storeEntity.getId() );
        storeResponseDto.name( storeEntity.getName() );
        storeResponseDto.ownerName( storeEntity.getOwnerName() );
        storeResponseDto.email( storeEntity.getEmail() );
        storeResponseDto.phone( storeEntity.getPhone() );
        storeResponseDto.logo( storeEntity.getLogo() );
        storeResponseDto.banner( storeEntity.getBanner() );
        storeResponseDto.category( storeEntity.getCategory() );
        storeResponseDto.location( storeEntity.getLocation() );

        return storeResponseDto.build();
    }
}
