package com.srishti.authservice.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        System.out.println(">>> [RequestLoggingFilter] Incoming Request: " + req.getMethod() + " " + req.getRequestURI());
        try {
            chain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println(">>> [RequestLoggingFilter] Exception processing request: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
