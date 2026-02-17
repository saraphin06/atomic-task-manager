package com.taskmanager.mapper;

import com.taskmanager.dto.TaskCreateRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(TaskCreateRequest request) {
        return Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .assignedTo(request.getAssignedTo())
                .isCompleted(false)
                .build();
    }

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .isCompleted(task.getIsCompleted())
                .dueDate(task.getDueDate())
                .assignedTo(task.getAssignedTo())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
