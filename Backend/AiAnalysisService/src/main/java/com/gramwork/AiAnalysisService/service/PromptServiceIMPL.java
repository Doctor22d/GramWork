package com.gramwork.AiAnalysisService.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PromptServiceIMPL implements PromptService{
    @Override
    public String buildReviewAnalysisPrompt(String review) {
        return """
                You are an AI assistant for GramWork.

                Analyze the following worker review.

                Return ONLY valid JSON.

                {
                  "sentiment":"POSITIVE | NEGATIVE | NEUTRAL",
                  "confidence":95.5,
                  "summary":"Short summary",
                  "keywords":["keyword1","keyword2","keyword3"],
                  "spam":false,
                  "toxic":false
                }

                Rules:
                1. Return ONLY JSON.
                2. Do not use markdown.
                3. Confidence must be between 0 and 100.
                4. Summary should be less than 25 words.
                5. Keywords should contain at most 5 items.
                6. spam must be true or false.
                7. toxic must be true or false.

                Review:
                %s
                """.formatted(review);
    }
}
