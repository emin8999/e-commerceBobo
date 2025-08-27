package com.e_commerce_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.e_commerce_backend.entity.AddressEntity;
import com.e_commerce_backend.entity.UserEntity;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity,Long> {


List<AddressEntity> findAllByUserEntity(UserEntity userEntity);

}
