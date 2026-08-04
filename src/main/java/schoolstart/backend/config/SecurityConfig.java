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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC APIs
                        // =========================

                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // Swagger
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        // =========================
                        // SCHOOL APIs
                        // =========================

                        // View Schools
                        .requestMatchers(HttpMethod.GET, "/api/schools/**")
                        .hasAnyRole(
                                "PARENT",
                                "SCHOOL_ADMIN",
                                "EDUCATION_ADMIN"
                        )

                        // Add School
                        .requestMatchers(HttpMethod.POST, "/api/schools/**")
                        .hasRole("EDUCATION_ADMIN")

                        // Update School
                        .requestMatchers(HttpMethod.PUT, "/api/schools/**")
                        .hasAnyRole(
                                "SCHOOL_ADMIN",
                                "EDUCATION_ADMIN"
                        )

                        // Delete School
                        .requestMatchers(HttpMethod.DELETE, "/api/schools/**")
                        .hasRole("EDUCATION_ADMIN")

                        // =========================
                        // SCHOOL ADMIN APIs
                        // =========================

                        // Get School Admin(s)
                        .requestMatchers(HttpMethod.GET, "/api/school-admins/**")
                        .hasRole("EDUCATION_ADMIN")

                        // Create School Admin
                        .requestMatchers(HttpMethod.POST, "/api/school-admins/**")
                        .hasRole("EDUCATION_ADMIN")

                        // Update School Admin
                        .requestMatchers(HttpMethod.PUT, "/api/school-admins/**")
                        .hasRole("EDUCATION_ADMIN")

                        // Delete School Admin
                        .requestMatchers(HttpMethod.DELETE, "/api/school-admins/**")
                        .hasRole("EDUCATION_ADMIN")

                        // =========================
                        // OTHER APIs
                        // =========================

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