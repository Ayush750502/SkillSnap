package com.example.SkillSnap.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Problem problem;
    
    private String language;
    
    @Column(length = 10000)
    private String sourceCode;
    
    private String status; // ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, etc.
    
    private LocalDateTime submissionTime;
    
    private Double executionTime; // in seconds
    
    private Integer memoryUsed; // in MB
    
    private String compilationError;
    
    @Column(length = 1000)
    private String errorMessage;
} 