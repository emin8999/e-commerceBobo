package com.lessons.ecommercebackend.service.impl;

import com.lessons.ecommercebackend.dto.request.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.StoreRegisterRequest;
import com.lessons.ecommercebackend.dto.response.LoginResponseDto;
import com.lessons.ecommercebackend.entity.StoreEntity;
import com.lessons.ecommercebackend.mapper.StoreMapper;
import com.lessons.ecommercebackend.repository.StoreRepository;
import com.lessons.ecommercebackend.security.StorePrincipal;
import com.lessons.ecommercebackend.security.jwt.JwtService;
import com.lessons.ecommercebackend.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FileStorageService fileStorageService;
    private final AuthenticationManager authenticationManager;

    @Override
    public void registerStore(StoreRegisterRequest request) {

        if(storeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("email exist");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match");
        }

        if (request.getAgreedToTerms() == null || !request.getAgreedToTerms()) {
            throw new IllegalArgumentException("You must agree to terms");
        }

        String logoPath = null;
        String bannerPath = null;
        if (request.getLogo() != null && !request.getLogo().isEmpty()) {
            logoPath = fileStorageService.storeFile(request.getLogo());
        }
        if (request.getBanner() != null && !request.getBanner().isEmpty()) {
            bannerPath = fileStorageService.storeFile(request.getBanner());
        }

        StoreEntity store = storeMapper.mapToStoreEntity(request);

        store.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));

        store.setLogo(logoPath);
        store.setBanner(bannerPath);

        storeRepository.save(store);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
        );

        if(authentication.isAuthenticated()){
            StoreEntity store = storeRepository.findStoreEntitiesByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("Store not found"));


            StorePrincipal storePrincipal = new StorePrincipal(store);
            String token = jwtService.generateToken(storePrincipal);

            return new LoginResponseDto(token,"Bearer");

        }

        throw new RuntimeException("Authentication failed");
    }


}
