package com.example.taskflow.service;

import com.example.taskflow.model.Task;
import com.example.taskflow.repository.TaskRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @PostConstruct
    public void seedIfEmpty() {
        // seed with a few demo tasks so the UI isn't empty on first run
        if (taskRepository.count() == 0) {
            create(new Task(null, "Install Docker Desktop", "Get Docker running locally before building images", "HIGH", true));
            create(new Task(null, "Write a Dockerfile", "Create a Dockerfile for this Spring Boot app", "HIGH", false));
            create(new Task(null, "Build and tag the image", "docker build -t taskflow:1.0 .", "MEDIUM", false));
            create(new Task(null, "Run the container", "docker run -p 8080:8080 taskflow:1.0", "MEDIUM", false));
            create(new Task(null, "Push to Docker Hub", "Tag and push the image to a registry", "LOW", false));
        }
    }

    public Collection<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task findById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task create(Task task) {
        task.setId(null);
        if (task.getPriority() == null) {
            task.setPriority("MEDIUM");
        }
        return taskRepository.save(task);
    }

    public Task update(Long id, Task updated) {
        return taskRepository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setPriority(updated.getPriority());
            existing.setCompleted(updated.isCompleted());
            return taskRepository.save(existing);
        }).orElse(null);
    }

    public Task toggleComplete(Long id) {
        return taskRepository.findById(id).map(existing -> {
            existing.setCompleted(!existing.isCompleted());
            return taskRepository.save(existing);
        }).orElse(null);
    }

    public boolean delete(Long id) {
        if (!taskRepository.existsById(id)) {
            return false;
        }
        taskRepository.deleteById(id);
        return true;
    }
}
