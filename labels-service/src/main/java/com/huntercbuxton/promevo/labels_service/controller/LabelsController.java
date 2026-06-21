package com.huntercbuxton.promevo.labels_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.gmail.Gmail; 
import com.google.api.services.gmail.model.ListLabelsResponse;
import com.google.api.services.gmail.model.Label;  
import jakarta.validation.Valid; 
import lombok.extern.slf4j.Slf4j;

import java.util.List;

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
import com.huntercbuxton.promevo.labels_service.exceptions.AppError;
import com.huntercbuxton.promevo.labels_service.model.CreateLabelRequest;
import com.huntercbuxton.promevo.labels_service.model.UpdateLabelRequest;
 
import org.springframework.web.server.ResponseStatusException;


@RestController
@Slf4j
@CrossOrigin(originPatterns = "http://localhost:*")
public class LabelsController { 
	 
	private final Gmail gmailService;

	public LabelsController(Gmail gmailAPIService) {
		this.gmailService = gmailAPIService;
	}
	 
	
	@GetMapping("/{id}")
	public ResponseEntity<Label> getLabel(@PathVariable("id") String id) {
		log.info("called get /{id} endpoint handler");

		try { 
			Label serviceResponse = gmailService.users().labels().get("me", id).execute(); 
			return new ResponseEntity<>(serviceResponse , HttpStatus.OK); 
			
		} catch (GoogleJsonResponseException ex) {
			if (ex.getDetails().getCode() == 404) 
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Label not found" );
			throw AppError.gmailAPIErr(ex);  
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex);  
			throw AppError.unhandledErr(ex); 
		}

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteLabel(@PathVariable("id") String id) {
		log.info("called delete /{id} endpoint handler");

		try { 
			gmailService.users().labels().delete("me", id).execute(); 
		} catch (GoogleJsonResponseException ex) {
			if (ex.getDetails().getCode() == 404) 
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Label not found" );
			throw AppError.gmailAPIErr(ex);  
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex); 
		    throw AppError.unhandledErr(ex); 
		} 
		
		return ResponseEntity.status(HttpStatus.OK)
			.contentType(MediaType.TEXT_PLAIN)
			.body("label deleted");
	}

	@GetMapping("/list")
	public ResponseEntity<List<Label>> listLabels() {
		log.info("called get /list endpoint handler");

		try { 
			ListLabelsResponse response = gmailService.users().labels().list("me").execute(); 
			if (response.getLabels() == null )  throw new AppError(); 
			return new ResponseEntity<>(response.getLabels(), HttpStatus.OK);   
		}  catch (GoogleJsonResponseException ex) { 
			throw new ResponseStatusException(500, ex.getDetails().getMessage(), ex);
		} catch (Exception ex) { 
			log.error("caught unhandled error case", ex); 
		    throw AppError.unhandledErr(ex); 
		}

	}

	@PostMapping("/create")
	public ResponseEntity<Label> createLabel(@RequestBody CreateLabelRequest createRequest) {
		log.info("called post /create endpoint handler with request body as " + createRequest.toString());
		 
		Label content = new Label()
				.setName(createRequest.getName())
				.setMessageListVisibility(createRequest.getMessageListVisibility())
				.setLabelListVisibility(createRequest.getLabelListVisibility())
				.setColor(createRequest.getColor());
		  
		// TODO: remove this extra logging before merging to develop
//		ObjectMapper mapper = new ObjectMapper(); 
//		String jsonString = null;
//		try {
//			jsonString = mapper.writeValueAsString(content);
//		} catch (JsonProcessingException e) { 
//			e.printStackTrace();
//		}
//        log.debug("gmail api create label request {} ", jsonString); 

		try { 
			Label response = gmailService.users().labels().create("me", content).execute(); 
			return new ResponseEntity<Label>(response, HttpStatus.OK);
		} catch (GoogleJsonResponseException ex) { 
			throw AppError.gmailAPIErr(ex);  
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex); 
		    throw AppError.unhandledErr(ex); 
		}

	}

	@PostMapping("/update")
	public ResponseEntity<Label> updateLabel(@Valid @RequestBody UpdateLabelRequest updates) {
		log.info("called post /update endpoint handler");
		
		Label content = new Label()
				.setId(updates.getId())
				.setName(updates.getName())
				.setLabelListVisibility(updates.getLabelListVisibility())
				.setMessageListVisibility(updates.getMessageListVisibility())
				.setColor(updates.getColor()); 
		
		try { 
			Label response = gmailService.users().labels().update("me", updates.getId(), content).execute();
			 
			return new ResponseEntity<Label>(response, HttpStatus.OK); 
		} catch (GoogleJsonResponseException ex) { 
			throw AppError.gmailAPIErr(ex);  
		} catch (Exception ex) {
			log.error("caught unhandled error case", ex); 
			throw AppError.unhandledErr(ex); 
		}

	}

}
