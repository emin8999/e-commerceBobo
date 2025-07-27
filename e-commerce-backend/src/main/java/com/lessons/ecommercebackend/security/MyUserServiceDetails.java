package com.lessons.ecommercebackend.security;

import com.lessons.ecommercebackend.repository.StoreRepository;
import com.lessons.ecommercebackend.repository.UserRepository;
import com.lessons.ecommercebackend.security.store.StorePrincipal;
import com.lessons.ecommercebackend.security.user.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Slf4j
@Service
public class MyUserServiceDetails implements UserDetailsService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .<UserDetails>map(UserPrincipal::new)
                .orElseGet(() ->
                        storeRepository.findStoreEntitiesByEmail(username)
                                .<UserDetails>map(StorePrincipal::new)
                                .orElseThrow(() ->
                                        new UsernameNotFoundException("User or Store not found: " + username))
                );
    }
}
