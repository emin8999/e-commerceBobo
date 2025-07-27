package com.ecommerce.ecommercebackend.security;

import com.ecommerce.ecommercebackend.repository.StoreRepository;
import com.ecommerce.ecommercebackend.repository.UserRepository;
import com.ecommerce.ecommercebackend.security.store.StorePrincipal;
import com.ecommerce.ecommercebackend.security.user.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
@Slf4j
@RequiredArgsConstructor
public class MyUserServiceDetails implements UserDetailsService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .map(UserPrincipal::new)
                .orElseGet(() -> storeRepository.findStoreEntitiesByEmail(username)
                        .map(StorePrincipal::new)
                        .orElseThrow(() -> new UsernameNotFoundException("User or Store not found: " + username)));
    }
}
