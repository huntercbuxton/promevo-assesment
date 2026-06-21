package com.huntercbuxton.promevo.labels_service.exceptions;

import org.jspecify.annotations.Nullable;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class AppError extends ResponseStatusException { 
	
	private static final long serialVersionUID = 1L;
	
	private static final HttpStatus DEFAULT_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;

	public static final String GENERIC_ERR_MSG = "Application Error";  
	public static final String UNHANDLED_ERR_MSG = "Unhandled error case";
	public static final String GMAIL_API_ERR_MSG = "Error from Gmail API response";
	
	private String apiMessage = null; 
	
	@Override
	public String getMessage() { 
		return this.apiMessage != null ? this.apiMessage : super.getMessage(); 
	}
	
	public void mapApiMessage(String apiMessage) {
		this.apiMessage = apiMessage;
	}
	
	@Override 
	public HttpStatusCode getStatusCode() { 
		return super.getStatusCode(); 
	}
	 
//	@Override 
//	public String getReason() { return super.getReason(); } 
	
	public AppError() {
		super(DEFAULT_STATUS, GENERIC_ERR_MSG);
	}
	
	public AppError(String reason) {
		super(DEFAULT_STATUS, reason);
	}

	public AppError(Throwable cause) {
		super(DEFAULT_STATUS, GENERIC_ERR_MSG, cause);
	}

	public AppError(String reason, Throwable cause) { 
		super(DEFAULT_STATUS, reason, cause);
	}
	
	public static AppError unhandledErr(@Nullable Throwable cause) {
		return new AppError(UNHANDLED_ERR_MSG, cause);
	}
	
	public static AppError gmailAPIErr(@Nullable Throwable cause) {
		return new AppError(GMAIL_API_ERR_MSG, cause);
	}
	
}
