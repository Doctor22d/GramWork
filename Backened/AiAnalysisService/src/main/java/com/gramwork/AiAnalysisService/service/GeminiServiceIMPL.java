package com.gramwork.AiAnalysisService.service;

import com.gramwork.AiAnalysisService.DTO.GeminiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class GeminiServiceIMPL implements GeminiService{
    private final ChatClient chatClient;
    private final PromptService promptService;
    private final ObjectMapper objectMapper;
    @Override
    public GeminiResponse analyze(String review) {
        String Prompt=promptService.buildReviewAnalysisPrompt(review);
        try {
            String response = chatClient.prompt(Prompt)
                    .call()
                    .content();
            return objectMapper.readValue(response, GeminiResponse.class);
        }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Failed to Analyze the Review.",e);
        }

    }
}
