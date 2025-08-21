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
import org.springframework.core.Ordered;
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
            "/home/store/register",
            "/home/store/login",
            "/store/register",
            "/store/login",
            "/auth/",
            "/swagger-ui/",
            "/v3/api-docs/",
            "/actuator/health",
            "/logout"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        log.debug("Processing request: {} {}", method, path);


        boolean isPublicPath = isPublicPath(path, method);

        if (isPublicPath) {
            log.debug("Skipping JWT filter for public {} request: {}", method, path);
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String tokenPrefix = "Bearer ";

        if (authHeader == null || !authHeader.startsWith(tokenPrefix)) {
            log.warn("Missing or invalid Authorization header for path: {}", path);
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "Missing or invalid Authorization header");
            return;
        }

        try {
            String jwtToken = authHeader.substring(tokenPrefix.length());
            log.debug("JWT token extracted for path: {}", path);


            if (tokenBlacklistService.isTokenBlacklisted(jwtToken)) {
                log.warn("Blacklisted token attempted for path: {}", path);
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Token has been invalidated");
                return;
            }

            String username = jwtService.extractUserName(jwtToken);
            log.debug("Extracted username from token: {}", username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailService.loadUserByUsername(username);

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
            }


            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("JWT processing failed for path {}: {}", path, e.getMessage(), e);
            sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Authentication processing failed");
        }
    }

    private boolean isPublicPath(String path, String method) {
        if (path == null) {
            return true;
        }


        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        for (String publicPath : PUBLIC_PATHS) {
            if (path.equals(publicPath) || path.startsWith(publicPath + "/")) {
                return true;
            }
        }

        return false;
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message)
            throws IOException {
        if (!response.isCommitted()) {
            response.setStatus(status);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String errorJson = String.format("{\"error\": \"%s\", \"message\": \"%s\"}",
                    "Authentication Failed", message);
            response.getWriter().write(errorJson);
        } else {
            log.warn("Response already committed, cannot send error response");
        }
    }
}