package com.huntercbuxton.promevo.labels_service.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.huntercbuxton.promevo.labels_service.GmailConfig;
import com.huntercbuxton.promevo.labels_service.model.GmailLabel;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j 
public class LabelsController {

	private final GmailConfig gmailConfig;

	public LabelsController(GmailConfig gmailConfig) {
		this.gmailConfig = gmailConfig;
	}
	
	@GetMapping("/api/messages")
    public String listMessages() {
		log.info("called /api/messages endpoint handler");
		
        try {
            Gmail service = gmailConfig.getGmailService();
            // Fetch messages from the authenticated user's profile
            ListMessagesResponse response = service.users().messages().list("me").setMaxResults(5L).execute();
            
            if (response.getMessages() == null || response.getMessages().isEmpty()) {
                return "No messages found.";
            }
            return response.getMessages().toString();
        } catch (Exception e) {
            return "Error retrieving messages: " + e.getMessage();
        }
    }
	
	    
	@GetMapping("/{id}")
	public GmailLabel getLabel(@PathVariable("id") String id) {
		log.info("called get /{id} endpoint handler");
		
		GmailLabel resp = new GmailLabel();
		return resp;
	}
   	
	
	@DeleteMapping("/{id}")
	public String deleteLabel(@PathVariable("id") String id) {
		log.info("called delete /{id} endpoint handler");
		return "endpoint not yet implemented";
	}
	
	
	@GetMapping("/list")
	public List<GmailLabel> listLabels() {
		log.info("called get /list endpoint handler");
		List<GmailLabel> resp = new ArrayList<GmailLabel>();
		return resp;
	}
	
	
	
	@PostMapping("/create")
	public GmailLabel createLabel() {
		log.info("called post /create endpoint handler");
		GmailLabel resp = new GmailLabel();
		return resp;
	}

	
	@PostMapping("/update")
	public GmailLabel updateLabel() {
		log.info("called post /update endpoint handler");
		GmailLabel resp = new GmailLabel();
		return resp;
	}
	
}
