package com.huntercbuxton.promevo.labels_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.gmail.Gmail; 
import com.google.api.services.gmail.model.ListLabelsResponse;
import com.google.api.services.gmail.model.Label;  
import jakarta.validation.Valid; 
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.huntercbuxton.promevo.labels_service.GmailConfig;
import com.huntercbuxton.promevo.labels_service.model.CreateLabelRequest;
import com.huntercbuxton.promevo.labels_service.model.UpdateLabelRequest;

// TODO: add exception mapping for 400, 404, and 500 error cases
@RestController
@Slf4j
// TODO: add cors config to limit allowed origins
@CrossOrigin
public class LabelsController {

	private final GmailConfig gmailConfig;

	public LabelsController(GmailConfig gmailConfig) {
		this.gmailConfig = gmailConfig;
	} 
	
	@GetMapping("/{id}")
	public String getLabel(@PathVariable("id") String id) {
		log.info("called get /{id} endpoint handler");

		try {
			Gmail service = gmailConfig.getGmailService();
			Label response = service.users().labels().get("me", id).execute();

			if (response == null) {
				return "Label not found.";
			}
			return response.toString();
		} catch (Exception e) {
			return "Error retrieving label: " + e.getMessage();
		}

	}

	@DeleteMapping("/{id}")
	public String deleteLabel(@PathVariable("id") String id) {
		log.info("called delete /{id} endpoint handler");

		try {
			Gmail service = gmailConfig.getGmailService();
			service.users().labels().delete("me", id).execute();

		} catch (Exception e) {
			return "Error deleting label: " + e.getMessage();
		}

		return "label deleted";

	}

	@GetMapping("/list")
	public String listLabels() {
		log.info("called get /list endpoint handler");

		try {
			Gmail service = gmailConfig.getGmailService();
			ListLabelsResponse response = service.users().labels().list("me").execute();

			if (response.getLabels() == null || response.getLabels().isEmpty()) {
				return "No messages found.";
			}
			return response.getLabels().toString();
		} catch (Exception e) {
			return "Error retrieving labels: " + e.getMessage();
		}

	}

	@PostMapping("/create")
	public String createLabel(@RequestBody CreateLabelRequest createRequest) {
		log.info("called post /create endpoint handler with request body as " + createRequest.toString());
		
		// TODO: use chaining to be consistent with the 'update' endpoint handler
		Label content = new Label(); 
		content.setName(createRequest.getName());
		content.setMessageListVisibility(createRequest.getMessageListVisibility());
		content.setLabelListVisibility(createRequest.getLabelListVisibility());
		 
		if (createRequest.getColor() != null) {
			content.setColor(createRequest.getColor());
		}
		 
		log.info("created create method request body as  " + content.toString());

		// TODO: remove this extra logging before merging to develop
		ObjectMapper mapper = new ObjectMapper(); 
		String jsonString = null;
		try {
			jsonString = mapper.writeValueAsString(content);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        log.info("request json {} ", jsonString); 

		try {
			Gmail service = gmailConfig.getGmailService();
			Label response = service.users().labels().create("me", content).execute();

			if (response == null) {
				return "Error creating/retrieving label";
			}
			return response.toString();
		} catch (Exception e) {
			log.error("stacktrace + request from service error: {}", content.toString(), e); 
			return "Error creating label: " + e.getMessage();
		}

	}

	@PostMapping("/update")
	public String updateLabel(@Valid @RequestBody UpdateLabelRequest updates) {
		log.info("called post /update endpoint handler");
		
		Label content = new Label()
				.setId(updates.getId())
				.setName(updates.getName())
				.setLabelListVisibility(updates.getLabelListVisibility())
				.setMessageListVisibility(updates.getMessageListVisibility());
		
		if (updates.getColor() != null) {
			content.setColor(updates.getColor());
		}
		
		try {
			Gmail service = gmailConfig.getGmailService();
			Label response = service.users().labels().update("me", updates.getId(), content).execute();

			if (response == null) {
				return "Error updating/retrieving label";
			}

			return response.toString();
		} catch (Exception e) {
			return "Error updating label: " + e.getMessage();
		}

	}

}
