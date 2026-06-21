package com.huntercbuxton.promevo.labels_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.gmail.Gmail; 
import com.google.api.services.gmail.model.ListLabelsResponse;
import com.google.api.services.gmail.model.Label;  
import jakarta.validation.Valid; 
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; 
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.huntercbuxton.promevo.labels_service.GmailConfig;
import com.huntercbuxton.promevo.labels_service.exceptions.AppError;
import com.huntercbuxton.promevo.labels_service.model.CreateLabelRequest;
import com.huntercbuxton.promevo.labels_service.model.UpdateLabelRequest;
 

@RestController
@Slf4j
@CrossOrigin(originPatterns = "http://localhost:*")
public class LabelsController {

	private final GmailConfig gmailConfig;

	public LabelsController(GmailConfig gmailConfig) {
		this.gmailConfig = gmailConfig;
	} 
	
	@GetMapping("/{id}")
	public ResponseEntity<String> getLabel(@PathVariable("id") String id) {
		log.info("called get /{id} endpoint handler");

		try {
			Gmail service = gmailConfig.getGmailService();
			Label serviceResponse = service.users().labels().get("me", id).execute();
 
			if (serviceResponse == null) throw new AppError(); 
			return new ResponseEntity<>(serviceResponse.toString(), HttpStatus.OK);
			
		} catch (GoogleJsonResponseException ex) {
			if (ex.getDetails().getCode() == 404) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.contentType(MediaType.TEXT_PLAIN)
						.body("Label not found"); 
			}
			throw AppError.gmailAPIErr(ex); 
		} catch (ResponseStatusException ex) {
			throw ex;
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex);  
			throw AppError.unhandledErr(ex); 
		}

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteLabel(@PathVariable("id") String id) {
		log.info("called delete /{id} endpoint handler");

		try {
			Gmail service = gmailConfig.getGmailService();
			service.users().labels().delete("me", id).execute();
			
		} catch (GoogleJsonResponseException e) {
			if (e.getDetails().getCode() == 404) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.contentType(MediaType.TEXT_PLAIN)
						.body("Label not found"); 
			} 
			throw AppError.gmailAPIErr(e);
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex); 
		    throw AppError.unhandledErr(ex); 
		} 
		
		return ResponseEntity.status(HttpStatus.OK)
			.contentType(MediaType.TEXT_PLAIN)
			.body("label deleted");
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
		}  catch (GoogleJsonResponseException ex) { 
			throw new ResponseStatusException(500, ex.getDetails().getMessage(), ex);
		} catch (Exception ex) { 
			log.error("caught unhandled error case", ex); 
		    throw AppError.unhandledErr(ex); 
		}

	}

	@PostMapping("/create")
	public String createLabel(@RequestBody CreateLabelRequest createRequest) {
		log.info("called post /create endpoint handler with request body as " + createRequest.toString());
		 
		Label content = new Label()
				.setName(createRequest.getName())
				.setMessageListVisibility(createRequest.getMessageListVisibility())
				.setLabelListVisibility(createRequest.getLabelListVisibility())
				.setColor(createRequest.getColor());
		  
		// TODO: remove this extra logging before merging to develop
		ObjectMapper mapper = new ObjectMapper(); 
		String jsonString = null;
		try {
			jsonString = mapper.writeValueAsString(content);
		} catch (JsonProcessingException e) { 
			e.printStackTrace();
		}
        log.debug("gmail api create label request {} ", jsonString); 

		try {
			Gmail service = gmailConfig.getGmailService();
			Label response = service.users().labels().create("me", content).execute();
			if (response == null) throw new AppError(); 
			return response.toString();
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex); 
		    throw AppError.unhandledErr(ex); 
		}

	}

	@PostMapping("/update")
	public String updateLabel(@Valid @RequestBody UpdateLabelRequest updates) {
		log.info("called post /update endpoint handler");
		
		Label content = new Label()
				.setId(updates.getId())
				.setName(updates.getName())
				.setLabelListVisibility(updates.getLabelListVisibility())
				.setMessageListVisibility(updates.getMessageListVisibility())
				.setColor(updates.getColor()); 
		
		try {
			Gmail service = gmailConfig.getGmailService();
			Label response = service.users().labels().update("me", updates.getId(), content).execute();

			if (response == null) throw new AppError();  
			return response.toString();
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex); 
			throw AppError.unhandledErr(ex); 
		}

	}

}
