package com.e_commerce_backend.mapper;

import com.e_commerce_backend.dto.requestdto.user.RegisterRequestDto;
import com.e_commerce_backend.dto.requestdto.user.UpdateUserRequestDto;
import com.e_commerce_backend.dto.responseDto.user.RegisterResponseDto;
import com.e_commerce_backend.dto.responseDto.user.UserResponseDto;
import com.e_commerce_backend.entity.UserEntity;
import com.e_commerce_backend.enums.Roles;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-07T11:34:41+0400",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserEntity mapToUser(RegisterRequestDto registerRequestDto) {
        if ( registerRequestDto == null ) {
            return null;
        }

        UserEntity.UserEntityBuilder userEntity = UserEntity.builder();

        userEntity.name( registerRequestDto.getName() );
        userEntity.surname( registerRequestDto.getSurname() );
        userEntity.email( registerRequestDto.getEmail() );
        userEntity.password( registerRequestDto.getPassword() );
        userEntity.address( registerRequestDto.getAddress() );
        userEntity.gender( registerRequestDto.getGender() );
        if ( registerRequestDto.getConsentMarketing() != null ) {
            userEntity.consentMarketing( registerRequestDto.getConsentMarketing() );
        }
        if ( registerRequestDto.getConsentMessagesDelivered() != null ) {
            userEntity.consentMessagesDelivered( registerRequestDto.getConsentMessagesDelivered() );
        }
        if ( registerRequestDto.getConsentMembershipAgreement() != null ) {
            userEntity.consentMembershipAgreement( registerRequestDto.getConsentMembershipAgreement() );
        }

        return userEntity.build();
    }

    @Override
    public RegisterResponseDto mapToRegisterResponseDto(UserEntity user) {
        if ( user == null ) {
            return null;
        }

        RegisterResponseDto.RegisterResponseDtoBuilder registerResponseDto = RegisterResponseDto.builder();

        registerResponseDto.id( user.getId() );
        registerResponseDto.name( user.getName() );
        registerResponseDto.surname( user.getSurname() );
        registerResponseDto.email( user.getEmail() );
        registerResponseDto.address( user.getAddress() );
        registerResponseDto.gender( user.getGender() );
        registerResponseDto.createdAt( user.getCreatedAt() );

        return registerResponseDto.build();
    }

    @Override
    public UserResponseDto mapToUserResponseDto(UserEntity userEntity) {
        if ( userEntity == null ) {
            return null;
        }

        UserResponseDto.UserResponseDtoBuilder userResponseDto = UserResponseDto.builder();

        userResponseDto.id( userEntity.getId() );
        userResponseDto.email( userEntity.getEmail() );
        userResponseDto.name( userEntity.getName() );
        userResponseDto.surname( userEntity.getSurname() );
        userResponseDto.address( userEntity.getAddress() );
        userResponseDto.gender( userEntity.getGender() );
        userResponseDto.consentMarketing( userEntity.isConsentMarketing() );
        userResponseDto.consentMessagesDelivered( userEntity.isConsentMessagesDelivered() );
        userResponseDto.consentMembershipAgreement( userEntity.isConsentMembershipAgreement() );
        Set<Roles> set = userEntity.getRoles();
        if ( set != null ) {
            userResponseDto.roles( new LinkedHashSet<Roles>( set ) );
        }
        userResponseDto.createdAt( userEntity.getCreatedAt() );
        userResponseDto.updatedAt( userEntity.getUpdatedAt() );

        return userResponseDto.build();
    }

    @Override
    public void updateUserFromDto(UpdateUserRequestDto userRequestDto, UserEntity userEntity) {
        if ( userRequestDto == null ) {
            return;
        }

        userEntity.setName( userRequestDto.getName() );
        userEntity.setSurname( userRequestDto.getSurname() );
        userEntity.setAddress( userRequestDto.getAddress() );
        userEntity.setGender( userRequestDto.getGender() );
        userEntity.setConsentMarketing( userRequestDto.isConsentMarketing() );
        userEntity.setConsentMessagesDelivered( userRequestDto.isConsentMessagesDelivered() );
        userEntity.setConsentMembershipAgreement( userRequestDto.isConsentMembershipAgreement() );
    }
}
