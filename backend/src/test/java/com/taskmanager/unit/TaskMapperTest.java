package com.taskmanager.unit;

import com.taskmanager.dto.TaskCreateRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.mapper.TaskMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class TaskMapperTest {

    private TaskMapper taskMapper;

    @BeforeEach
    void setUp() {
        taskMapper = new TaskMapper();
    }

    @Test
    @DisplayName("should map TaskCreateRequest to Task entity correctly")
    void mapToEntity_validRequest_mapsCorrectly() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("My Task")
                .description("My Description")
                .dueDate(LocalDateTime.of(2026, 6, 1, 12, 0))
                .assignedTo("Alice")
                .build();

        Task entity = taskMapper.toEntity(request);

        assertThat(entity.getTitle()).isEqualTo("My Task");
        assertThat(entity.getDescription()).isEqualTo("My Description");
        assertThat(entity.getDueDate()).isEqualTo(LocalDateTime.of(2026, 6, 1, 12, 0));
        assertThat(entity.getAssignedTo()).isEqualTo("Alice");
        assertThat(entity.getIsCompleted()).isFalse();
        assertThat(entity.getId()).isNull();
    }

    @Test
    @DisplayName("should map Task entity to TaskResponse with all fields")
    void mapToResponse_entity_mapsAllFields() {
        LocalDateTime now = LocalDateTime.now();
        Task task = Task.builder()
                .id(5L)
                .title("Test")
                .description("Desc")
                .isCompleted(true)
                .dueDate(now)
                .assignedTo("Bob")
                .createdAt(now)
                .updatedAt(now)
                .build();

        TaskResponse response = taskMapper.toResponse(task);

        assertThat(response.getId()).isEqualTo(5L);
        assertThat(response.getTitle()).isEqualTo("Test");
        assertThat(response.getDescription()).isEqualTo("Desc");
        assertThat(response.getIsCompleted()).isTrue();
        assertThat(response.getDueDate()).isEqualTo(now);
        assertThat(response.getAssignedTo()).isEqualTo("Bob");
        assertThat(response.getCreatedAt()).isEqualTo(now);
        assertThat(response.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("should handle null optional fields gracefully")
    void mapToEntity_nullOptionalFields_handledGracefully() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Minimal Task")
                .build();

        Task entity = taskMapper.toEntity(request);

        assertThat(entity.getTitle()).isEqualTo("Minimal Task");
        assertThat(entity.getDescription()).isNull();
        assertThat(entity.getDueDate()).isNull();
        assertThat(entity.getAssignedTo()).isNull();
        assertThat(entity.getIsCompleted()).isFalse();
    }
}
