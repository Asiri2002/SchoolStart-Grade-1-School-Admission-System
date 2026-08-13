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

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // AUTHENTICATION PROVIDER
    // =========================================================

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        /*
         * Your React Native Web application is running on
         * localhost:8081.
         *
         * Using localhost:* also allows Expo to use another
         * development port.
         */
        configuration.setAllowedOriginPatterns(
                List.of("http://localhost:*")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // Disable CSRF because we use JWT
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // JWT = stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // -----------------------------------------
                        // CORS PREFLIGHT
                        // -----------------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        // -----------------------------------------
                        // AUTH
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()

                        // -----------------------------------------
                        // SWAGGER
                        // -----------------------------------------

                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**"
                        )
                        .permitAll()

                        // -----------------------------------------
                        // PARENT
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/parent/**"
                        )
                        .hasAuthority("PARENT")

                        // -----------------------------------------
                        // CHILD
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/children/**"
                        )
                        .hasAuthority("PARENT")

                        // -----------------------------------------
                        // SCHOOL
                        // -----------------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/schools/**"
                        )
                        .hasAnyAuthority(
                                "PARENT",
                                "SCHOOL_ADMIN",
                                "EDUCATION_ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/schools/**"
                        )
                        .hasAuthority("EDUCATION_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/schools/**"
                        )
                        .hasAnyAuthority(
                                "SCHOOL_ADMIN",
                                "EDUCATION_ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/schools/**"
                        )
                        .hasAuthority("EDUCATION_ADMIN")

                        // -----------------------------------------
                        // SCHOOL ADMIN
                        // -----------------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/school-admins/**"
                        )
                        .hasAuthority("EDUCATION_ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/school-admins/**"
                        )
                        .hasAuthority("EDUCATION_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/school-admins/**"
                        )
                        .hasAuthority("EDUCATION_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/school-admins/**"
                        )
                        .hasAuthority("EDUCATION_ADMIN")

                        // -----------------------------------------
                        // INTERVIEWS
                        // -----------------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/interviews/**"
                        )
                        .hasAnyAuthority(
                                "PARENT",
                                "SCHOOL_ADMIN",
                                "EDUCATION_ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/interviews/**"
                        )
                        .hasAuthority("SCHOOL_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/interviews/**"
                        )
                        .hasAuthority("SCHOOL_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/interviews/**"
                        )
                        .hasAuthority("SCHOOL_ADMIN")

                        // -----------------------------------------
                        // EVERYTHING ELSE
                        // -----------------------------------------

                        .anyRequest()
                        .authenticated()
                )

                // Authentication provider
                .authenticationProvider(
                        authenticationProvider()
                )

                // JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}