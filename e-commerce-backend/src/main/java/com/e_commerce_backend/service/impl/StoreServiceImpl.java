package com.e_commerce_backend.service.impl;

import com.e_commerce_backend.cloudinary.CloudinaryService;
import com.e_commerce_backend.dto.requestdto.store.StoreRegisterRequest;
import com.e_commerce_backend.dto.requestdto.store.StoreUpdateRequestDto;
import com.e_commerce_backend.dto.requestdto.user.LoginRequestDto;
import com.e_commerce_backend.dto.responseDto.store.StoreResponseDto;
import com.e_commerce_backend.dto.responseDto.user.LoginResponseDto;
import com.e_commerce_backend.entity.StoreEntity;
import com.e_commerce_backend.enums.Roles;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Set;
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

    @Override
    public void registerStore(StoreRegisterRequest request) {

        if (storeRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new PasswordMismatchException();
        }

        if (!Boolean.TRUE.equals(request.getAgreedToTerms())) {
            throw new IllegalArgumentException("You must agree to terms");
        }

        StoreEntity store = storeMapper.mapToStoreEntity(request);
        store.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        store.setRoles(Set.of(Roles.STORE));

        store = storeRepository.save(store);

        String storeFolder = "image/store_" + store.getId();

        if (request.getLogo() != null && !request.getLogo().isEmpty()) {
            String logoUrl = cloudinaryService.uploadFile(request.getLogo(), storeFolder + "/logo", "logo");
            store.setLogo(logoUrl);
        }

        if (request.getBanner() != null && !request.getBanner().isEmpty()) {
            String bannerUrl = cloudinaryService.uploadFile(request.getBanner(), storeFolder + "/banner", "banner");
            store.setBanner(bannerUrl);
        }

        storeRepository.save(store);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));

            StoreEntity store = storeRepository.findStoreEntitiesByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("Store not found"));

            StorePrincipal storePrincipal = new StorePrincipal(store);
            String token = jwtService.generateToken(storePrincipal);

            return new LoginResponseDto(token, "Bearer");

        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public StoreResponseDto updateStore(String token,
            StoreUpdateRequestDto dto,
            MultipartFile banner,
            MultipartFile logo) {
        String emailFromToken = jwtService.extractUserName(token.replace("Bearer ", ""));
        StoreEntity store = storeRepository.findStoreEntitiesByEmail(emailFromToken)
                .orElseThrow(() -> new RuntimeException("Store tapılmadı"));

        if (dto.getStoreName() != null && !dto.getStoreName().isBlank()) {
            store.setStoreName(dto.getStoreName());
        }
        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            store.setDescription(dto.getDescription());
        }
        if (dto.getPhone() != null && !dto.getPhone().isBlank()) {
            store.setPhone(dto.getPhone());
        }

        if (banner != null && !banner.isEmpty()) {
            String bannerUrl = cloudinaryService.uploadFile(banner, "banners", "store_" + store.getId() + "_banner");
            store.setBanner(bannerUrl);
        }

        if (logo != null && !logo.isEmpty()) {
            String logoUrl = cloudinaryService.uploadFile(logo, "logos", "store_" + store.getId() + "_logo");
            store.setLogo(logoUrl);
        }

        StoreEntity savedStore = storeRepository.save(store);
        return convertToResponse(savedStore);
    }

    private StoreResponseDto convertToResponse(StoreEntity store) {
        StoreResponseDto response = new StoreResponseDto();
        response.setStoreName(store.getStoreName());
        response.setDescription(store.getDescription());
        response.setPhone(store.getPhone());
        response.setBanner(store.getBanner());
        response.setLogo(store.getLogo());
        return response;
    }

    @Override
    public StoreResponseDto getCurrentStoreInfo() throws AccessDeniedException {
        StoreEntity store = storeSecurityUtil.getCurrentStore();
        return storeMapper.mapToStoreResponse(store);
    }

    @Override
    public List<StoreResponseDto> getAllStores() {
        return storeRepository.findAll()
                .stream()
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