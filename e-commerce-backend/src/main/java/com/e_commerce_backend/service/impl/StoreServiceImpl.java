package com.e_commerce_backend.service.impl;

import com.e_commerce_backend.cloudinary.CloudinaryService;
import com.e_commerce_backend.dto.requestdto.store.StoreRegisterRequest;
import com.e_commerce_backend.dto.requestdto.user.LoginRequestDto;
import com.e_commerce_backend.dto.responseDto.store.StoreResponseDto;
import com.e_commerce_backend.dto.responseDto.user.LoginResponseDto;
import com.e_commerce_backend.entity.StoreEntity;
import com.e_commerce_backend.exception.EmailAlreadyExistsException;
import com.e_commerce_backend.exception.PasswordMismatchException;
import com.e_commerce_backend.mapper.StoreMapper;
import com.e_commerce_backend.repository.StoreRepository;
import com.e_commerce_backend.security.jwt.JwtService;
import com.e_commerce_backend.security.store.StorePrincipal;
import com.e_commerce_backend.security.util.StoreSecurityUtil;
import com.e_commerce_backend.service.StoreService;
import com.e_commerce_backend.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final StoreSecurityUtil storeSecurityUtil;
    private final CloudinaryService cloudinaryService;
    private final TokenBlacklistService tokenBlacklistService;

    public void registerStore(StoreRegisterRequest request) {
        System.out.println("➡ registerStore called with data:");
        System.out.println("   storeName: " + request.getStoreName());
        System.out.println("   ownerName: " + request.getOwnerName());
        System.out.println("   email: " + request.getEmail());
        System.out.println("   agreedToTerms: " + request.getAgreedToTerms());

        if (storeRepository.existsByEmail(request.getEmail())) {
            System.out.println("❌ Email already exists: " + request.getEmail());
            throw new RuntimeException("Email already exists");
        } else if (!request.getPassword().equals(request.getConfirmPassword())) {
            System.out.println("❌ Password mismatch");
            throw new IllegalArgumentException("Password and Confirm Password do not match");
        } else if (Boolean.TRUE.equals(request.getAgreedToTerms())) {
            StoreEntity store = storeMapper.mapToStoreEntity(request);
            store.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
            store = storeRepository.save(store);

            System.out.println("✅ Store saved with id: " + store.getId());

            String storeFolder = "image/store_" + store.getId();

            if (request.getLogo() != null && !request.getLogo().isEmpty()) {
                String logoUrl = cloudinaryService.uploadFile(request.getLogo(), storeFolder + "/logo", "logo");
                store.setLogo(logoUrl);
                System.out.println("✅ Logo uploaded: " + logoUrl);
            }

            if (request.getBanner() != null && !request.getBanner().isEmpty()) {
                String bannerUrl = cloudinaryService.uploadFile(request.getBanner(), storeFolder + "/banner", "banner");
                store.setBanner(bannerUrl);
                System.out.println("✅ Banner uploaded: " + bannerUrl);
            }

            storeRepository.save(store);
        } else {
            System.out.println("❌ Terms not agreed");
            throw new IllegalArgumentException("You must agree to terms");
        }
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

    public StoreResponseDto getCurrentStoreInfo() throws AccessDeniedException {
        StoreEntity store = storeSecurityUtil.getCurrentStore();
        return storeMapper.mapToStoreResponse(store);
    }

    @Override
    public List<StoreResponseDto> getAllStores() {
        List<StoreEntity> stores = storeRepository.findAll();
        return stores.stream()
                .map(storeMapper::mapToStoreResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteStore(Long id) {
        storeRepository.deleteById(id);
    }

    @Override
    public void logout(String token) {
        tokenBlacklistService.blacklistToken(token);
        SecurityContextHolder.clearContext();
    }
}
