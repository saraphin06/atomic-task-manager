package com.taskmanager.unit;

import com.taskmanager.TestFixtures;
import com.taskmanager.dto.*;
import com.taskmanager.entity.Task;
import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.mapper.TaskMapper;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        task = TestFixtures.createTask();
        taskResponse = TestFixtures.createTaskResponse();
    }

    @Nested
    @DisplayName("createTask")
    class CreateTask {

        @Test
        @DisplayName("should create task with valid input")
        void createTask_validInput_returnsCreatedTask() {
            TaskCreateRequest request = TestFixtures.createTaskRequest();

            when(taskMapper.toEntity(request)).thenReturn(task);
            when(taskRepository.save(task)).thenReturn(task);
            when(taskMapper.toResponse(task)).thenReturn(taskResponse);

            TaskResponse result = taskService.createTask(request);

            assertThat(result).isNotNull();
            assertThat(result.getTitle()).isEqualTo("Test Task");
            verify(taskRepository).save(task);
        }
    }

    @Nested
    @DisplayName("getTaskById")
    class GetTaskById {

        @Test
        @DisplayName("should return task when it exists")
        void getTaskById_existingId_returnsTask() {
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskMapper.toResponse(task)).thenReturn(taskResponse);

            TaskResponse result = taskService.getTaskById(1L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("should throw NotFoundException when task does not exist")
        void getTaskById_nonExistingId_throwsNotFoundException() {
            when(taskRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.getTaskById(999L))
                    .isInstanceOf(TaskNotFoundException.class)
                    .hasMessageContaining("999");
        }
    }

    @Nested
    @DisplayName("updateTask")
    class UpdateTask {

        @Test
        @DisplayName("should update task with valid input")
        void updateTask_validInput_returnsUpdatedTask() {
            TaskUpdateRequest request = TestFixtures.updateTaskRequest();
            Task updatedTask = TestFixtures.createTask();
            updatedTask.setTitle("Updated Task");

            TaskResponse updatedResponse = TaskResponse.builder()
                    .id(1L)
                    .title("Updated Task")
                    .description("Updated Description")
                    .isCompleted(false)
                    .build();

            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);
            when(taskMapper.toResponse(updatedTask)).thenReturn(updatedResponse);

            TaskResponse result = taskService.updateTask(1L, request);

            assertThat(result.getTitle()).isEqualTo("Updated Task");
            verify(taskRepository).save(any(Task.class));
        }

        @Test
        @DisplayName("should throw NotFoundException when task does not exist")
        void updateTask_nonExistingId_throwsNotFoundException() {
            TaskUpdateRequest request = TestFixtures.updateTaskRequest();
            when(taskRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.updateTask(999L, request))
                    .isInstanceOf(TaskNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("deleteTask")
    class DeleteTask {

        @Test
        @DisplayName("should delete existing task")
        void deleteTask_existingId_deletesSuccessfully() {
            when(taskRepository.existsById(1L)).thenReturn(true);

            taskService.deleteTask(1L);

            verify(taskRepository).deleteById(1L);
        }

        @Test
        @DisplayName("should throw NotFoundException when deleting non-existing task")
        void deleteTask_nonExistingId_throwsNotFoundException() {
            when(taskRepository.existsById(999L)).thenReturn(false);

            assertThatThrownBy(() -> taskService.deleteTask(999L))
                    .isInstanceOf(TaskNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("toggleTask")
    class ToggleTask {

        @Test
        @DisplayName("should toggle incomplete task to completed")
        void toggleTask_incompletedBecomesTrue() {
            task.setIsCompleted(false);
            Task toggled = TestFixtures.createTask();
            toggled.setIsCompleted(true);

            TaskResponse toggledResponse = TaskResponse.builder()
                    .id(1L).isCompleted(true).build();

            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(toggled);
            when(taskMapper.toResponse(toggled)).thenReturn(toggledResponse);

            TaskResponse result = taskService.toggleTask(1L);

            assertThat(result.getIsCompleted()).isTrue();
        }

        @Test
        @DisplayName("should toggle completed task to incomplete")
        void toggleTask_completedBecomesFalse() {
            task.setIsCompleted(true);
            Task toggled = TestFixtures.createTask();
            toggled.setIsCompleted(false);

            TaskResponse toggledResponse = TaskResponse.builder()
                    .id(1L).isCompleted(false).build();

            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any(Task.class))).thenReturn(toggled);
            when(taskMapper.toResponse(toggled)).thenReturn(toggledResponse);

            TaskResponse result = taskService.toggleTask(1L);

            assertThat(result.getIsCompleted()).isFalse();
        }

        @Test
        @DisplayName("should throw NotFoundException when toggling non-existing task")
        void toggleTask_nonExistingId_throwsNotFoundException() {
            when(taskRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.toggleTask(999L))
                    .isInstanceOf(TaskNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("getAllTasks")
    class GetAllTasks {

        @Test
        @DisplayName("should return paginated results")
        @SuppressWarnings("unchecked")
        void getAllTasks_returnsPaginatedResults() {
            List<Task> tasks = List.of(task);
            Page<Task> page = new PageImpl<>(tasks);

            when(taskRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
            when(taskMapper.toResponse(task)).thenReturn(taskResponse);

            PagedResponse<TaskResponse> result = taskService.getAllTasks(
                    null, null, null, "createdAt", "asc", 0, 10);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getTotalElements()).isEqualTo(1);
        }

        @Test
        @DisplayName("should enforce max page size")
        @SuppressWarnings("unchecked")
        void getAllTasks_enforcesMaxPageSize() {
            Page<Task> page = new PageImpl<>(List.of());
            when(taskRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

            taskService.getAllTasks(null, null, null, "createdAt", "asc", 0, 200);

            verify(taskRepository).findAll(any(Specification.class), argThat((Pageable p) -> p.getPageSize() == 100));
        }
    }
}
