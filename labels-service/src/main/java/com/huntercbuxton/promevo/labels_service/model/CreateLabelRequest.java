package com.huntercbuxton.promevo.labels_service.model;
 
import com.google.api.services.gmail.model.LabelColor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateLabelRequest {
 
	@NotBlank(message = "Label name is required")
    @Pattern(regexp = "^[^/].*[^/]$", message = "Label name cannot start or end with a forward slash")
	private String name;
	
    private String labelListVisibility;
    
    private String messageListVisibility; 
    
	private LabelColor color;
	
}
