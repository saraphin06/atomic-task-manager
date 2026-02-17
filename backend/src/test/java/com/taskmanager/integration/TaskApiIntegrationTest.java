package com.taskmanager.integration;

import com.taskmanager.dto.TaskCreateRequest;
import com.taskmanager.dto.TaskUpdateRequest;
import com.taskmanager.entity.Task;
import com.taskmanager.repository.TaskRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class TaskApiIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api/tasks";
        taskRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/tasks - should create task and return 201")
    void createTask_returns201WithLocation() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Integration Test Task")
                .description("Created via integration test")
                .dueDate(LocalDateTime.of(2026, 6, 15, 10, 0))
                .assignedTo("Tester")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post()
        .then()
                .statusCode(201)
                .header("Location", containsString("/api/tasks/"))
                .body("title", equalTo("Integration Test Task"))
                .body("description", equalTo("Created via integration test"))
                .body("isCompleted", equalTo(false))
                .body("assignedTo", equalTo("Tester"));
    }

    @Test
    @DisplayName("POST /api/tasks - invalid body returns 400 with errors")
    void createTask_invalidBody_returns400WithErrors() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post()
        .then()
                .statusCode(400)
                .body("status", equalTo(400))
                .body("message", equalTo("Validation failed"))
                .body("errors", hasSize(greaterThanOrEqualTo(1)))
                .body("errors.field", hasItem("title"));
    }

    @Test
    @DisplayName("GET /api/tasks - should return 200 with paginated results")
    void getAllTasks_returns200WithPaginatedResults() {
        createSampleTask("Task 1");
        createSampleTask("Task 2");
        createSampleTask("Task 3");

        given()
                .queryParam("page", 0)
                .queryParam("size", 2)
        .when()
                .get()
        .then()
                .statusCode(200)
                .body("content", hasSize(2))
                .body("totalElements", equalTo(3))
                .body("totalPages", equalTo(2));
    }

    @Test
    @DisplayName("GET /api/tasks?isCompleted=true - should return only completed tasks")
    void getAllTasks_filterByCompleted_returnsFiltered() {
        Task completed = createSampleTask("Completed Task");
        completed.setIsCompleted(true);
        taskRepository.save(completed);
        createSampleTask("Incomplete Task");

        given()
                .queryParam("isCompleted", true)
        .when()
                .get()
        .then()
                .statusCode(200)
                .body("content", hasSize(1))
                .body("content[0].title", equalTo("Completed Task"));
    }

    @Test
    @DisplayName("GET /api/tasks?sortBy=title&sortDirection=asc - should return sorted tasks")
    void getAllTasks_sortByTitle_returnsSorted() {
        createSampleTask("Charlie");
        createSampleTask("Alpha");
        createSampleTask("Bravo");

        given()
                .queryParam("sortBy", "title")
                .queryParam("sortDirection", "asc")
        .when()
                .get()
        .then()
                .statusCode(200)
                .body("content[0].title", equalTo("Alpha"))
                .body("content[1].title", equalTo("Bravo"))
                .body("content[2].title", equalTo("Charlie"));
    }

    @Test
    @DisplayName("GET /api/tasks/{id} - should return 200 with task")
    void getTaskById_returns200WithTask() {
        Task task = createSampleTask("Find Me");

        given()
        .when()
                .get("/{id}", task.getId())
        .then()
                .statusCode(200)
                .body("title", equalTo("Find Me"))
                .body("id", equalTo(task.getId().intValue()));
    }

    @Test
    @DisplayName("GET /api/tasks/{id} - not found returns 404")
    void getTaskById_notFound_returns404() {
        given()
        .when()
                .get("/{id}", 99999)
        .then()
                .statusCode(404)
                .body("status", equalTo(404))
                .body("message", containsString("99999"));
    }

    @Test
    @DisplayName("PUT /api/tasks/{id} - should update and return 200")
    void updateTask_returns200WithUpdatedTask() {
        Task task = createSampleTask("Original Title");

        TaskUpdateRequest updateRequest = TaskUpdateRequest.builder()
                .title("Updated Title")
                .description("Updated Description")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(updateRequest)
        .when()
                .put("/{id}", task.getId())
        .then()
                .statusCode(200)
                .body("title", equalTo("Updated Title"))
                .body("description", equalTo("Updated Description"));
    }

    @Test
    @DisplayName("PATCH /api/tasks/{id}/toggle - should toggle completion status")
    void toggleTask_togglesCompletionStatus() {
        Task task = createSampleTask("Toggle Me");

        // First toggle: false -> true
        given()
        .when()
                .patch("/{id}/toggle", task.getId())
        .then()
                .statusCode(200)
                .body("isCompleted", equalTo(true));

        // Second toggle: true -> false
        given()
        .when()
                .patch("/{id}/toggle", task.getId())
        .then()
                .statusCode(200)
                .body("isCompleted", equalTo(false));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id} - should delete and return 204")
    void deleteTask_returns204() {
        Task task = createSampleTask("Delete Me");

        given()
        .when()
                .delete("/{id}", task.getId())
        .then()
                .statusCode(204);

        // Verify it's gone
        given()
        .when()
                .get("/{id}", task.getId())
        .then()
                .statusCode(404);
    }

    private Task createSampleTask(String title) {
        Task task = Task.builder()
                .title(title)
                .description("Sample description")
                .isCompleted(false)
                .build();
        return taskRepository.save(task);
    }
}
