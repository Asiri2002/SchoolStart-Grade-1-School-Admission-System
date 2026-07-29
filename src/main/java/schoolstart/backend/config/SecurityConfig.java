package schoolstart.backend.config;

import schoolstart.backend.security.CustomUserDetailsService;
import schoolstart.backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth

                        // Authentication APIs
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // Swagger APIs
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**"
                        )
                        .permitAll()

                        // =========================
                        // SCHOOL APIs
                        // =========================

                        // View schools
                        // Parent + School Admin + Education Admin
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/schools/**"
                        )
                        .hasAnyRole(
                                "PARENT",
                                "SCHOOL_ADMIN",
                                "EDUCATION_ADMIN"
                        )

                        // Add school
                        // Only Education Admin
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/schools/**"
                        )
                        .hasRole("EDUCATION_ADMIN")

                        // Update schools
                        // School Admin + Education Admin
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/schools/**"
                        )
                        .hasAnyRole(
                                "SCHOOL_ADMIN",
                                "EDUCATION_ADMIN"
                        )

                        // Delete school
                        // Only Education Admin
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/schools/**"
                        )
                        .hasRole("EDUCATION_ADMIN")

                        // Other protected APIs
                        .anyRequest()
                        .authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}