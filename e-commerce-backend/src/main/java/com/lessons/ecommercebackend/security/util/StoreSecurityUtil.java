package com.lessons.ecommercebackend.security.util;

import com.lessons.ecommercebackend.entity.StoreEntity;
import com.lessons.ecommercebackend.security.store.StorePrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;

@Component
public class StoreSecurityUtil {
    public StoreEntity getCurrentStore() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getPrincipal() instanceof StorePrincipal storePrincipal) {
            return storePrincipal.store();
        }

        throw new AccessDeniedException("Only stores can perform this action.");
    }
}
