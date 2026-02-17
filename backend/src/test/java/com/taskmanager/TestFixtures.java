package com.taskmanager;

import com.taskmanager.dto.TaskCreateRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.dto.TaskUpdateRequest;
import com.taskmanager.entity.Task;

import java.time.LocalDateTime;

public final class TestFixtures {

    private TestFixtures() {
    }

    public static Task createTask() {
        return Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .isCompleted(false)
                .dueDate(LocalDateTime.of(2026, 3, 15, 10, 0))
                .assignedTo("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static Task createTask(Long id, String title) {
        return Task.builder()
                .id(id)
                .title(title)
                .description("Description for " + title)
                .isCompleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static TaskCreateRequest createTaskRequest() {
        return TaskCreateRequest.builder()
                .title("New Task")
                .description("New Description")
                .dueDate(LocalDateTime.of(2026, 3, 15, 10, 0))
                .assignedTo("John")
                .build();
    }

    public static TaskUpdateRequest updateTaskRequest() {
        return TaskUpdateRequest.builder()
                .title("Updated Task")
                .description("Updated Description")
                .build();
    }

    public static TaskResponse createTaskResponse() {
        return TaskResponse.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .isCompleted(false)
                .dueDate(LocalDateTime.of(2026, 3, 15, 10, 0))
                .assignedTo("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
