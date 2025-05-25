package com.example.SkillSnap.service;

import com.example.SkillSnap.model.Problem;
import com.example.SkillSnap.model.Submission;
import com.example.SkillSnap.repository.ProblemRepository;
import com.example.SkillSnap.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private ProblemRepository problemRepository;
    
    @Autowired
    private CodeExecutionService codeExecutionService;
    
    public Submission submitSolution(Long problemId, String sourceCode, String language) {
        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() -> new RuntimeException("Problem not found with id: " + problemId));
            
        Submission submission = new Submission();
        submission.setProblem(problem);
        submission.setLanguage(language);
        submission.setSourceCode(sourceCode);
        submission.setSubmissionTime(LocalDateTime.now());
        
        try {
            // Execute against test cases
            ExecutionResult result = codeExecutionService.executeCode(sourceCode, language, problem.getTestCases());
            
            submission.setStatus(result.getStatus());
            submission.setExecutionTime(result.getExecutionTime());
            submission.setErrorMessage(result.getOutput());
            
            if ("Success".equals(result.getStatus())) {
                // Verify output matches expected output
                // This is a simple implementation - you might want to add more sophisticated output comparison
                if (result.getOutput().trim().equals(problem.getSampleOutput().trim())) {
                    submission.setStatus("ACCEPTED");
                } else {
                    submission.setStatus("WRONG_ANSWER");
                }
            }
            
        } catch (Exception e) {
            submission.setStatus("ERROR");
            submission.setErrorMessage(e.getMessage());
        }
        
        return submissionRepository.save(submission);
    }
    
    public List<Submission> getSubmissionsByProblem(Long problemId) {
        return submissionRepository.findByProblemId(problemId);
    }
    
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }
} 