package com.huntercbuxton.promevo.labels_service.controller;
 

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers; 
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import  org.springframework.boot.webmvc.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean; // Use @MockitoBean for Spring Boot 3.4+
import org.springframework.http.MediaType; 
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.Gmail.Users;
import com.google.api.services.gmail.Gmail.Users.Labels;
import com.google.api.services.gmail.Gmail.Users.Labels.Create;
import com.google.api.services.gmail.Gmail.Users.Labels.Delete;
import com.google.api.services.gmail.Gmail.Users.Labels.Get;
import com.google.api.services.gmail.Gmail.Users.Labels.Update;
import com.google.api.services.gmail.model.Label;
import com.google.api.services.gmail.model.ListLabelsResponse;
import com.huntercbuxton.promevo.labels_service.model.CreateLabelRequest;
import com.huntercbuxton.promevo.labels_service.model.UpdateLabelRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import com.huntercbuxton.promevo.labels_service.controller.LabelsController; 
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;
import java.util.List;

import org.springframework.test.web.servlet.MvcResult;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


 
@WebMvcTest(LabelsController.class)  
class LabelsControllerTest { 
	
    @Autowired
    private MockMvc mockMvc;
 
    @MockitoBean
    private Gmail gmailService;
     
    @Test
    void  testGetLabel() throws Exception { 
    	
    	final String mockLabelId = "mock_label_id";
    	final String mockLabelName = "mock_label_name";
    	final String mockMessageListVisibility = "hide";
    	final String mockLabelListVisibility = "labelHide";
    	final String mockLabelType = "user";
    	
    	Label mockLabel = new Label()
    			.setId(mockLabelId)
    			.setName(mockLabelName)
    			.setMessageListVisibility(mockMessageListVisibility)
				.setLabelListVisibility(mockLabelListVisibility)
				.setType(mockLabelType); 
    	
        Users mockUsers =   Mockito.mock(Users.class);
        Labels mockLabels = Mockito.mock(Labels.class);
        Get mockGet = Mockito.mock(Get.class); 
        
        when(gmailService.users()).thenReturn(mockUsers);
        when(mockUsers.labels()).thenReturn(mockLabels);
        when(mockLabels.get(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(mockGet);
        when(mockGet.execute()).thenReturn(mockLabel);
          
        MvcResult mvcResult = mockMvc.perform(get("/"+mockLabelId)
            .accept(MediaType.APPLICATION_JSON))
        	.andExpect(status().isOk())
        	.andReturn(); 
        
        String responseBody = mvcResult.getResponse().getContentAsString();
        ObjectMapper objectMapper = new ObjectMapper(); 
        // Deserialize into a Java object using Jackson's ObjectMapper
        Label label = objectMapper.readValue(responseBody, Label.class);
        assertThat(label.getId()).isEqualTo(mockLabelId);
        assertThat(label.getName()).isEqualTo(mockLabelName);
        assertThat(label.getMessageListVisibility()).isEqualTo(mockMessageListVisibility);
        assertThat(label.getLabelListVisibility()).isEqualTo(mockLabelListVisibility);
        assertThat(label.getType()).isEqualTo(mockLabelType); 
    }
    
    
    @Test
    void  testGetList() throws Exception { 
    	
    	final String mockLabelId = "mock_label_id";
    	final String mockLabelName = "mock_label_name";
    	final String mockMessageListVisibility = "hide";
    	final String mockLabelListVisibility = "labelHide";
    	final String mockLabelType = "user";
    	
    	Label mockLabel = new Label()
    			.setId(mockLabelId)
    			.setName(mockLabelName)
    			.setMessageListVisibility(mockMessageListVisibility)
				.setLabelListVisibility(mockLabelListVisibility)
				.setType(mockLabelType); 
    	List<Label> mockListData = Collections.singletonList(mockLabel);
    	ListLabelsResponse mockListLabelsResponseData = new ListLabelsResponse();
    	mockListLabelsResponseData.setLabels(mockListData);
    	
        Users mockUsers =   Mockito.mock(Users.class);
        Labels mockLabels = Mockito.mock(Labels.class);
        com.google.api.services.gmail.Gmail.Users.Labels.List mockGetList = Mockito.mock(com.google.api.services.gmail.Gmail.Users.Labels.List.class); 
        
        
        when(gmailService.users()).thenReturn(mockUsers);
        when(mockUsers.labels()).thenReturn(mockLabels);
        when(mockLabels.list(ArgumentMatchers.any())).thenReturn(mockGetList);
        when(mockGetList.execute()).thenReturn(mockListLabelsResponseData);
          
        MvcResult mvcResult = mockMvc.perform(get("/list")
            .accept(MediaType.APPLICATION_JSON))
        	.andExpect(status().isOk())
        	.andReturn(); 
        
        String responseBody = mvcResult.getResponse().getContentAsString();
        ObjectMapper objectMapper = new ObjectMapper(); 
        // Deserialize into a Java object using Jackson's ObjectMapper
        List<Label> labelList = objectMapper.readValue(responseBody, new TypeReference<List<Label>>() {});
        assertThat(labelList.size()).isEqualTo(1);
        assertThat(labelList.get(0).getName()).isEqualTo(mockLabelName);
        assertThat(labelList.get(0).getMessageListVisibility()).isEqualTo(mockMessageListVisibility);
        assertThat(labelList.get(0).getLabelListVisibility()).isEqualTo(mockLabelListVisibility);
        assertThat(labelList.get(0).getType()).isEqualTo(mockLabelType);
           
    }
    
    @Test
    void  testDeleteLabel() throws Exception {
        // 4. Define the mock's behavior using Mockito'
    	final String mockLabelId = "mock_label_id"; 
    	
        Users mockUsers =   Mockito.mock(Users.class);
        Labels mockLabels = Mockito.mock(Labels.class);
        Delete mockDelete = Mockito.mock(Delete.class); 
        
        when(gmailService.users()).thenReturn(mockUsers);
        when(mockUsers.labels()).thenReturn(mockLabels);
        when(mockLabels.delete(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(mockDelete);
         
        mockMvc.perform(delete("/"+mockLabelId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
        		.andExpect(content().string("label deleted")); 
    }
  
    @Test
    void  testCreate() throws Exception {
        // 4. Define the mock's behavior using Mockito'

    	final String mockLabelId = "mock_label_id";
    	final String mockLabelName = "mock_label_name";
    	final String mockMessageListVisibility = "hide";
    	final String mockLabelListVisibility = "labelHide";
    	final String mockLabelType = "user";
    	

    	CreateLabelRequest payloadData = new CreateLabelRequest();
    	payloadData.setName(mockLabelName);
    	payloadData.setMessageListVisibility(mockMessageListVisibility);
    	payloadData.setLabelListVisibility(mockLabelListVisibility);
    	ObjectMapper objectMapper = new ObjectMapper(); 
    	final String payload = objectMapper.writeValueAsString(payloadData);
         
 
    	Label mockLabelData = new Label()
    			.setId(mockLabelId)
    			.setName(mockLabelName)
    			.setMessageListVisibility(mockMessageListVisibility)
				.setLabelListVisibility(mockLabelListVisibility)
				.setType(mockLabelType);  
        
        Users mockUsers =   Mockito.mock(Users.class);
        Labels mockLabels = Mockito.mock(Labels.class);
        Create mockCreate = Mockito.mock(Create.class); 
        
        when(gmailService.users()).thenReturn(mockUsers);
        when(mockUsers.labels()).thenReturn(mockLabels);
        when(mockLabels.create(ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(mockCreate);
        when(mockCreate.execute()).thenReturn(mockLabelData);
        
        
        MvcResult mvcResult = mockMvc.perform(post("/create")
            .contentType(MediaType.APPLICATION_JSON)
    		.content(payload)
        	.accept(MediaType.APPLICATION_JSON))
	    	.andExpect(status().isOk())
	    	.andReturn(); 
        
        String responseBody = mvcResult.getResponse().getContentAsString(); 
        Label label = objectMapper.readValue(responseBody, Label.class);
        assertThat(label.getId()).isEqualTo(mockLabelId);
        assertThat(label.getName()).isEqualTo(mockLabelName);
        assertThat(label.getMessageListVisibility()).isEqualTo(mockMessageListVisibility);
        assertThat(label.getLabelListVisibility()).isEqualTo(mockLabelListVisibility);
        assertThat(label.getType()).isEqualTo(mockLabelType);
    }
    
    @Test
    void  testUpdate() throws Exception {
        // 4. Define the mock's behavior using Mockito'

    	final String mockLabelId = "mock_label_id";
    	final String mockLabelName = "mock_label_name";
    	final String mockMessageListVisibility = "hide";
    	final String mockLabelListVisibility = "labelHide";
    	final String mockLabelType = "user";
    	

    	UpdateLabelRequest payloadData = new UpdateLabelRequest();
    	payloadData.setId(mockLabelId);
    	payloadData.setName(mockLabelName);
    	payloadData.setMessageListVisibility(mockMessageListVisibility);
    	payloadData.setLabelListVisibility(mockLabelListVisibility);
    	ObjectMapper objectMapper = new ObjectMapper(); 
    	final String payload = objectMapper.writeValueAsString(payloadData);
         
 
    	Label mockResponseData = new Label()
    			.setId(mockLabelId)
    			.setName(mockLabelName)
    			.setMessageListVisibility(mockMessageListVisibility)
				.setLabelListVisibility(mockLabelListVisibility)
				.setType(mockLabelType);
        
        Users mockUsers =   Mockito.mock(Users.class);
        Labels mockLabels = Mockito.mock(Labels.class);
        Update mockUpdate = Mockito.mock(Update.class); 
        
        when(gmailService.users()).thenReturn(mockUsers);
        when(mockUsers.labels()).thenReturn(mockLabels);
        when(mockLabels.update(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any())).thenReturn(mockUpdate);
        when(mockUpdate.execute()).thenReturn(mockResponseData);
        
        MvcResult mvcResult = mockMvc.perform(post("/update")
            .contentType(MediaType.APPLICATION_JSON)
    		.content(payload)
        	.accept(MediaType.APPLICATION_JSON))
	    	.andExpect(status().isOk())
	    	.andReturn(); 
        
        String responseBody = mvcResult.getResponse().getContentAsString(); 
        Label updatedLabel = objectMapper.readValue(responseBody, Label.class);
        assertThat(updatedLabel.getId()).isEqualTo(mockLabelId);
        assertThat(updatedLabel.getName()).isEqualTo(mockLabelName);
        assertThat(updatedLabel.getMessageListVisibility()).isEqualTo(mockMessageListVisibility);
        assertThat(updatedLabel.getLabelListVisibility()).isEqualTo(mockLabelListVisibility);
        assertThat(updatedLabel.getType()).isEqualTo(mockLabelType);
    }
}
