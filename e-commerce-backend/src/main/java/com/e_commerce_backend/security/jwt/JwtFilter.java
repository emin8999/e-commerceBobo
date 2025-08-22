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
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final MyUserServiceDetails userDetailService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String tokenPrefix = "Bearer ";
        final String requestPath = request.getServletPath();

        if (isPermitAllEndpoint(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith(tokenPrefix)) {
            jwtToken = authHeader.substring(tokenPrefix.length());

            if (tokenBlacklistService.isTokenBlacklisted(jwtToken)) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token has been invalidated");
                return;
            }

            try {
                username = jwtService.extractUserName(jwtToken);
            } catch (Exception e) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        } else {

            if (!isPermitAllEndpoint(requestPath)) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is required");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailService.loadUserByUsername(username);

                if (jwtService.validateToken(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            } catch (UsernameNotFoundException e) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                return;
            } catch (Exception e) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
                return;
            }
        }


        filterChain.doFilter(request, response);
    }

    private boolean isPermitAllEndpoint(String path) {
        return path.startsWith("/auth/") ||
                path.equals("/admin/login") ||
                path.equals("/store/register") ||
                path.equals("/store/login") ||
                path.startsWith("/product/public/");
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return isPermitAllEndpoint(path);
    }
}