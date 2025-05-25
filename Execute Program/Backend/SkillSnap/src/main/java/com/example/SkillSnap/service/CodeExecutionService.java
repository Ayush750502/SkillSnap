package com.example.SkillSnap.service;

import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class CodeExecutionService {
    private static final String TEMP_DIR = System.getProperty("java.io.tmpdir");
    private static final int DEFAULT_TIMEOUT = 5; // seconds

    public ExecutionResult executeCode(String sourceCode, String language, String input) throws Exception {
        String fileName = UUID.randomUUID().toString();
        Path tempDir = createTempDirectory(fileName);
        
        try {
            switch (language.toLowerCase()) {
                case "java":
                    return executeJava(sourceCode, input, tempDir);
                case "python":
                    return executePython(sourceCode, input, tempDir);
                case "javascript":
                    return executeJavaScript(sourceCode, input, tempDir);
                default:
                    throw new IllegalArgumentException("Unsupported language: " + language);
            }
        } finally {
            // Cleanup
            deleteDirectory(tempDir);
        }
    }

    private ExecutionResult executeJava(String sourceCode, String input, Path tempDir) throws Exception {
        // Write source code to file
        Path sourcePath = tempDir.resolve("Solution.java");
        Files.write(sourcePath, sourceCode.getBytes());

        // Compile
        Process compile = new ProcessBuilder("javac", sourcePath.toString())
                .directory(tempDir.toFile())
                .start();
        
        if (compile.waitFor(30, TimeUnit.SECONDS) && compile.exitValue() != 0) {
            return new ExecutionResult("Compilation Error", 
                new String(compile.getErrorStream().readAllBytes()), 0.0, 0);
        }

        // Run
        return runProcess("java", input, tempDir, "Solution");
    }

    private ExecutionResult executePython(String sourceCode, String input, Path tempDir) throws Exception {
        Path scriptPath = tempDir.resolve("script.py");
        Files.write(scriptPath, sourceCode.getBytes());
        return runProcess("python", input, tempDir, scriptPath.toString());
    }

    private ExecutionResult executeJavaScript(String sourceCode, String input, Path tempDir) throws Exception {
        Path scriptPath = tempDir.resolve("script.js");
        Files.write(scriptPath, sourceCode.getBytes());
        return runProcess("node", input, tempDir, scriptPath.toString());
    }

    private ExecutionResult runProcess(String command, String input, Path workDir, String... args) throws Exception {
        String[] cmdArray = new String[args.length + 1];
        cmdArray[0] = command;
        System.arraycopy(args, 0, cmdArray, 1, args.length);

        Process process = new ProcessBuilder(cmdArray)
                .directory(workDir.toFile())
                .start();

        // Write input
        if (input != null && !input.isEmpty()) {
            process.getOutputStream().write(input.getBytes());
            process.getOutputStream().close();
        }

        // Execute with timeout
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<ExecutionResult> future = executor.submit(() -> {
            long startTime = System.nanoTime();
            String output = new String(process.getInputStream().readAllBytes());
            String error = new String(process.getErrorStream().readAllBytes());
            double executionTime = (System.nanoTime() - startTime) / 1e9; // Convert to seconds
            
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return new ExecutionResult("Runtime Error", error, executionTime, exitCode);
            }
            return new ExecutionResult("Success", output, executionTime, exitCode);
        });

        try {
            return future.get(DEFAULT_TIMEOUT, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            process.destroyForcibly();
            return new ExecutionResult("Time Limit Exceeded", "", DEFAULT_TIMEOUT * 1.0, -1);
        } finally {
            executor.shutdownNow();
        }
    }

    private Path createTempDirectory(String prefix) throws IOException {
        return Files.createTempDirectory(Paths.get(TEMP_DIR), prefix);
    }

    private void deleteDirectory(Path directory) {
        try {
            Files.walk(directory)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            // Log error but continue
                            e.printStackTrace();
                        }
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class ExecutionResult {
    private final String status;
    private final String output;
    private final double executionTime;
    private final int exitCode;

    public ExecutionResult(String status, String output, double executionTime, int exitCode) {
        this.status = status;
        this.output = output;
        this.executionTime = executionTime;
        this.exitCode = exitCode;
    }

    public String getStatus() { return status; }
    public String getOutput() { return output; }
    public double getExecutionTime() { return executionTime; }
    public int getExitCode() { return exitCode; }
} 