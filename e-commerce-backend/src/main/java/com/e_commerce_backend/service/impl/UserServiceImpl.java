package com.e_commerce_backend.service.impl;

import com.e_commerce_backend.dto.requestdto.user.LoginRequestDto;
import com.e_commerce_backend.dto.requestdto.user.RegisterRequestDto;
import com.e_commerce_backend.dto.requestdto.user.UpdateUserRequestDto;
import com.e_commerce_backend.dto.responseDto.user.LoginResponseDto;
import com.e_commerce_backend.dto.responseDto.user.RegisterResponseDto;
import com.e_commerce_backend.dto.responseDto.user.UserResponseDto;
import com.e_commerce_backend.entity.UserEntity;
import com.e_commerce_backend.enums.Roles;
import com.e_commerce_backend.exception.EmailAlreadyExistsException;
import com.e_commerce_backend.exception.PasswordMismatchException;
import com.e_commerce_backend.exception.UserNotFoundException;
import com.e_commerce_backend.mapper.UserMapper;
import com.e_commerce_backend.repository.UserRepository;
import com.e_commerce_backend.security.jwt.JwtService;
import com.e_commerce_backend.security.user.UserPrincipal;
import com.e_commerce_backend.service.TokenBlacklistService;
import com.e_commerce_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    public RegisterResponseDto register(RegisterRequestDto registerRequestDto) {
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new EmailAlreadyExistsException("email exist");
        }

        if (!registerRequestDto.getPassword().equals(registerRequestDto.getPasswordConfirm())) {
            throw new PasswordMismatchException();
        }

        UserEntity user = userMapper.mapToUser(registerRequestDto);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(Set.of(Roles.USER));
        }

        userRepository.save(user);

        RegisterResponseDto response = userMapper.mapToRegisterResponseDto(user);
        response.setMessage("User registered successfully");
        return response;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
        );

        if (authentication.isAuthenticated()) {
            UserEntity user = userRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new UserNotFoundException());

            UserPrincipal userPrincipal = new UserPrincipal(user);
            String token = jwtService.generateToken(userPrincipal);

            return new LoginResponseDto(token, "Bearer");
        } else {
            throw new RuntimeException("Authentication failed");
        }
    }

    @Override
    public LoginResponseDto adminLogin(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
        );

        if (authentication.isAuthenticated()) {
            UserEntity user = userRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.getRoles().contains(Roles.ADMIN)) {
                throw new RuntimeException("Access denied: Admin role required");
            }

            UserPrincipal userPrincipal = new UserPrincipal(user);
            String token = jwtService.generateToken(userPrincipal);

            return new LoginResponseDto(token, "Bearer");
        } else {
            throw new RuntimeException("Authentication failed");
        }
    }

    @Override
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserEntity getCurrentUserEntity() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
    }

    @Override
    public UserResponseDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.mapToUserResponseDto(user);
    }



    @Override
    public UserResponseDto updateCurrentUser(UpdateUserRequestDto userUpdateDto) {
        UserEntity currentUser = getCurrentUserEntity();
        userMapper.updateUserFromDto(userUpdateDto, currentUser);
        UserEntity updatedUser = userRepository.save(currentUser);
        return userMapper.mapToUserResponseDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Object getCurrentUserOrders() {
        Map<String, Object> orders = new HashMap<>();
        orders.put("message", "Orders functionality will be implemented later");
        orders.put("orders", List.of());
        return orders;
    }

    @Override
    public Object getCurrentUserAddresses() {
        Map<String, Object> addresses = new HashMap<>();
        addresses.put("message", "Addresses functionality will be implemented later");
        addresses.put("addresses", List.of());
        return addresses;
    }

    @Override
    public Object addUserAddress(Object address) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Address functionality will be implemented later");
        response.put("address", address);
        return response;
    }

    @Override
    public Object getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("message", "More stats will be implemented later");
        return stats;
    }

    @Override
    public void logout(String token) {
        tokenBlacklistService.blacklistToken(token);
        SecurityContextHolder.clearContext();
    }
}
