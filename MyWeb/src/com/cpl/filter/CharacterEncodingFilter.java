package com.cpl.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;

//@WebFilter("/CharacterEncodingFilter")
public class CharacterEncodingFilter implements Filter {

	private String characterEncoding; //編碼方式，設定在web.xml中
	private boolean enabled;          //是否啟用該Filter，設定在web.xml中
	
    public void init(FilterConfig config) throws ServletException {
    	characterEncoding = config.getInitParameter("characterEncoding");             //編碼方式
    	enabled = "true".equalsIgnoreCase(config.getInitParameter("enabled").trim()); //是否啟用
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		if(enabled || characterEncoding !=null){
			request.setCharacterEncoding(characterEncoding);   //設定request編碼
			response.setCharacterEncoding(characterEncoding);  //設定response編碼
		}
		chain.doFilter(request, response);
	}
	
	public void destroy() {
		characterEncoding = null;
	}
}
