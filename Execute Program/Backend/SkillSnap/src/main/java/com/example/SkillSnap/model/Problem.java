package com.example.SkillSnap.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(length = 1000)
    private String inputFormat;
    
    @Column(length = 1000)
    private String outputFormat;
    
    private String difficulty;
    
    @Column(length = 5000)
    private String testCases;
    
    private String sampleInput;
    private String sampleOutput;
    
    private Integer timeLimit; // in seconds
    private Integer memoryLimit; // in MB
} 