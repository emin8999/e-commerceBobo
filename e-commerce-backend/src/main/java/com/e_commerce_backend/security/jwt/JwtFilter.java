package com.e_commerce_backend.security.jwt;

import com.e_commerce_backend.security.MyUserServiceDetails;
import com.e_commerce_backend.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.core5.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final MyUserServiceDetails userDetailService;
    private final TokenBlacklistService tokenBlacklistService;

    private static final List<String> PUBLIC_PATHS = List.of(
            "/store/register",
            "/store/login",
            "/auth/",
            "/swagger-ui/",
            "/v3/api-docs/",
            "/actuator/health"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        log.debug("Processing request for path: {}", path);


        boolean isPublicPath = PUBLIC_PATHS.stream().anyMatch(path::startsWith);
        if (isPublicPath) {
            log.debug("Skipping JWT filter for public path: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            log.debug("Skipping JWT filter for OPTIONS request");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String tokenPrefix = "Bearer ";
        String jwtToken = null;
        String username = null;


        if (authHeader != null && authHeader.startsWith(tokenPrefix)) {
            jwtToken = authHeader.substring(tokenPrefix.length());
            log.debug("JWT token found: {}", jwtToken);


            if (tokenBlacklistService.isTokenBlacklisted(jwtToken)) {
                log.warn("Blacklisted token attempted: {}", jwtToken);
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Token has been invalidated");
                return;
            }

            try {
                username = jwtService.extractUserName(jwtToken);
                log.debug("Extracted username from token: {}", username);
            } catch (Exception e) {
                log.warn("Token extraction failed: {}", e.getMessage());
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid or expired token");
                return;
            }
        } else {
            log.warn("Missing or invalid Authorization header");
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "Missing or invalid Authorization header");
            return;
        }


        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailService.loadUserByUsername(username);
                log.debug("User details loaded for: {}", username);

                if (jwtService.validateToken(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authentication set for user: {}", username);
                } else {
                    log.warn("Token validation failed for user: {}", username);
                    sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            } catch (UsernameNotFoundException e) {
                log.warn("User not found: {}", username);
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String errorJson = String.format("{\"error\": \"%s\", \"message\": \"%s\"}",
                "Authentication Failed", message);
        response.getWriter().write(errorJson);
    }
}