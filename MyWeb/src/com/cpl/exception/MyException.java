package com.cpl.exception;

public class MyException extends RuntimeException {
	private static final long serialVersionUID = 1505293069472623314L;
	
	private String message;
	
	public MyException(String message) {
		this.message = message;
	}
	
	public MyException(String message, Throwable cause) {
		super(cause.getMessage(), cause);
		this.message = message;
	}

	@Override
	public String getMessage() {
		return message;
	}
}
