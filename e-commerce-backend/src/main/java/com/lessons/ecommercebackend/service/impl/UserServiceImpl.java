package com.lessons.ecommercebackend.service.impl;

import com.lessons.ecommercebackend.dto.request.LoginRequestDto;
import com.lessons.ecommercebackend.dto.request.RegisterRequestDto;
import com.lessons.ecommercebackend.dto.response.LoginResponseDto;
import com.lessons.ecommercebackend.dto.response.RegisterResponseDto;
import com.lessons.ecommercebackend.entity.UserEntity;
import com.lessons.ecommercebackend.enums.Roles;
import com.lessons.ecommercebackend.mapper.UserMapper;
import com.lessons.ecommercebackend.repository.UserRepository;
import com.lessons.ecommercebackend.security.UserPrincipal;
import com.lessons.ecommercebackend.security.jwt.JwtService;
import com.lessons.ecommercebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public RegisterResponseDto register(RegisterRequestDto registerRequestDto) {
        if(userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new RuntimeException("email exist");
        }

        UserEntity user = userMapper.mapToUser(registerRequestDto);

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        if (user.getRoles()==null || user.getRoles().isEmpty()) {
            user.setRoles(Set.of(Roles.USER));
        }
        userRepository.save(user);

        return userMapper.mapToRegisterResponseDto(user);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
        );

        if(authentication.isAuthenticated()){
            UserEntity user = userRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserPrincipal userPrincipal = new UserPrincipal(user);
            String token = jwtService.generateToken(userPrincipal);

            return new LoginResponseDto(token,"Bearer");

        }

        throw new RuntimeException("Authentication failed");
    }
}
