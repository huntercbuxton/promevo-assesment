package com.huntercbuxton.promevo.labels_service.model;

import com.google.api.services.gmail.model.LabelColor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateLabelRequest { 
   
	@NotBlank(message="label id is required")
	String id;
	
	@NotBlank(message = "Label name is required")
    @Pattern(regexp = "^[^/].*[^/]$", message = "Label name cannot start or end with a forward slash")
    String name;
	
    String labelListVisibility;
    
    String messageListVisibility;
    
    private LabelColor color; 
    
    // TODO: set default values inline for consistency
    // Set Google's default visibility behaviors if not provided in the request
    public UpdateLabelRequest(String id, String name, String labelListVisibility, String messageListVisibility, LabelColor color) {
    	this.id = id;
    	this.name = name;
    	// TODO: move default values to constants class
    	if (labelListVisibility == null) labelListVisibility = "labelShow";
        if (messageListVisibility == null) messageListVisibility = "show";
        this.labelListVisibility = labelListVisibility;
        this.messageListVisibility = messageListVisibility;
        if (color != null) {
        	this.color = color;
        }
    }
    
    public UpdateLabelRequest() {
    	super();
    }
    
}
