package com.taskmanager.service;

import com.taskmanager.dto.*;
import com.taskmanager.entity.Task;
import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.mapper.TaskMapper;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.TaskSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaskService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("title", "dueDate", "createdAt");
    private static final int MAX_PAGE_SIZE = 100;

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getAllTasks(
            Boolean isCompleted,
            LocalDateTime dueDateFrom,
            LocalDateTime dueDateTo,
            String sortBy,
            String sortDirection,
            int page,
            int size) {

        size = Math.min(size, MAX_PAGE_SIZE);

        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, safeSortBy));

        Specification<Task> spec = Specification.where(TaskSpecifications.isCompleted(isCompleted))
                .and(TaskSpecifications.dueDateFrom(dueDateFrom))
                .and(TaskSpecifications.dueDateTo(dueDateTo));

        Page<Task> taskPage = taskRepository.findAll(spec, pageable);

        List<TaskResponse> content = taskPage.getContent()
                .stream()
                .map(taskMapper::toResponse)
                .toList();

        return new PagedResponse<>(
                content,
                taskPage.getTotalElements(),
                taskPage.getTotalPages(),
                taskPage.getNumber(),
                taskPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return taskMapper.toResponse(task);
    }

    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        Task task = taskMapper.toEntity(request);
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskUpdateRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getIsCompleted() != null) {
            task.setIsCompleted(request.getIsCompleted());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getAssignedTo() != null) {
            task.setAssignedTo(request.getAssignedTo());
        }

        Task updated = taskRepository.save(task);
        return taskMapper.toResponse(updated);
    }

    @Transactional
    public TaskResponse toggleTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setIsCompleted(!task.getIsCompleted());
        Task updated = taskRepository.save(task);
        return taskMapper.toResponse(updated);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        taskRepository.deleteById(id);
    }
}
