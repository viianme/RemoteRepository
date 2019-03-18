package com.cpl.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.logging.log4j.ThreadContext;

//@WebFilter("/LogFilter")
public class LogFilter implements Filter {

	private Log log = LogFactory.getLog(this.getClass()); //取得Log物件
	private String filterName;
    
	public void init(FilterConfig config) throws ServletException {
		filterName = config.getFilterName();  //取得Filter名稱
		log.info("啟動 Filter: "+ filterName);
	}
	
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		
		System.out.println("into logFilter");
		HttpServletRequest  request  = (HttpServletRequest)  req;
		HttpServletResponse response = (HttpServletResponse) res;
		
		long startTimes = System.currentTimeMillis(); //執行前的時間
		String requestURI = request.getRequestURI();  //存取的URI
		requestURI = request.getQueryString() == null ? 
				requestURI : requestURI + "?" + request.getQueryString(); //所有的地址欄參數
		
		System.out.println("startTimes:"+startTimes);
		System.out.println("requestURI:"+requestURI);
		
		chain.doFilter(request, response);
		long endTimes = System.currentTimeMillis(); //執行後的時間
		log.info(request.getRemoteAddr() + " 存取了 " + requestURI + 
				",總用時 " + (endTimes - startTimes) + " 毫秒。"); //消耗的總時間
		
	}

	public void destroy() {
		log.info("關閉 Filter: "+ filterName);
	}

}
