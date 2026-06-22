package com.huntercbuxton.promevo.labels_service;
 

import static org.assertj.core.api.Assertions.assertThat; 
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.services.gmail.Gmail;
import com.huntercbuxton.promevo.labels_service.controller.LabelsController;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.bean.override.mockito.MockitoBean;


 

@SpringBootTest
class SmokeTest {

	@Autowired
    private LabelsController labelsController;
	
	@MockitoBean
	private Gmail gmailService;
	
	@Test
	void contextLoads(ApplicationContext context) {
		// Explicitly assert that the core container itself is online
        assertThat(context).isNotNull(); 
        // Explicitly assert that a critical component was instantiated
        assertThat(labelsController).isNotNull(); 
        
	}

}
