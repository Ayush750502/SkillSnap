package com.example.SkillSnap.service;

import com.example.SkillSnap.model.Problem;
import com.example.SkillSnap.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {
    
    @Autowired
    private ProblemRepository problemRepository;
    
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }
    
    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
    }
    
    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }
    
    public Problem updateProblem(Long id, Problem problemDetails) {
        Problem problem = problemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));
            
        problem.setTitle(problemDetails.getTitle());
        problem.setDescription(problemDetails.getDescription());
        problem.setDifficulty(problemDetails.getDifficulty());
        problem.setInputFormat(problemDetails.getInputFormat());
        problem.setOutputFormat(problemDetails.getOutputFormat());
        problem.setTestCases(problemDetails.getTestCases());
        problem.setSampleInput(problemDetails.getSampleInput());
        problem.setSampleOutput(problemDetails.getSampleOutput());
        problem.setTimeLimit(problemDetails.getTimeLimit());
        problem.setMemoryLimit(problemDetails.getMemoryLimit());
        
        return problemRepository.save(problem);
    }
    
    public void deleteProblem(Long id) {
        Problem problem = problemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));
        problemRepository.delete(problem);
    }
} 