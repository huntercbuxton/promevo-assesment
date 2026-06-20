package com.huntercbuxton.promevo.labels_service.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.huntercbuxton.promevo.labels_service.model.GmailLabel;

@RestController
public class LabelsController {

	@GetMapping("/{id}")
	public GmailLabel getLabel(@PathVariable("id") String id) {
		GmailLabel resp = new GmailLabel();
		return resp;
	}
   	
	
	@DeleteMapping("/{id}")
	public String deleteLabel(@PathVariable("id") String id) {
		return "endpoint not yet implemented";
	}
	
	
	@GetMapping("/list")
	public List<GmailLabel> listLabels() {
		List<GmailLabel> resp = new ArrayList<GmailLabel>();
		return resp;
	}
	
	
	@PostMapping("/create")
	public GmailLabel createLabel() {
		GmailLabel resp = new GmailLabel();
		return resp;
	}

	
	@PostMapping("/update")
	public GmailLabel updateLabel() {
		GmailLabel resp = new GmailLabel();
		return resp;
	}
	
}
