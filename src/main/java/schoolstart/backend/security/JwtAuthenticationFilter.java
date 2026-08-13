package schoolstart.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // =========================================================
        // ALLOW CORS PREFLIGHT REQUEST
        // =========================================================

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            // =====================================================
            // GET JWT TOKEN
            // =====================================================

            String jwt = getJwtFromRequest(request);

            // =====================================================
            // VALIDATE JWT
            // =====================================================

            if (StringUtils.hasText(jwt)
                    && tokenProvider.validateToken(jwt)) {

                // Get user ID from JWT
                String userId =
                        tokenProvider.getUserIdFromJWT(jwt);

                // Load user
                UserDetails userDetails =
                        customUserDetailsService.loadUserById(userId);

                // Create authentication
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // Set authentication
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                log.debug(
                        "Authenticated user: {} with authorities: {}",
                        userDetails.getUsername(),
                        userDetails.getAuthorities()
                );
            }

        } catch (Exception ex) {

            log.error(
                    "Could not set user authentication in security context",
                    ex
            );

            // Clear authentication if JWT processing fails
            SecurityContextHolder.clearContext();
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }

    // =============================================================
    // GET JWT FROM AUTHORIZATION HEADER
    // =============================================================

    private String getJwtFromRequest(
            HttpServletRequest request
    ) {

        String bearerToken =
                request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken)
                && bearerToken.startsWith("Bearer ")) {

            return bearerToken.substring(7);
        }

        return null;
    }
}