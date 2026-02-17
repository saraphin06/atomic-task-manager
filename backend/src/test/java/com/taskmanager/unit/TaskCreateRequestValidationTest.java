package com.taskmanager.unit;

import com.taskmanager.dto.TaskCreateRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class TaskCreateRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("valid request passes validation")
    void validRequest_passesValidation() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Valid Task")
                .description("Some description")
                .dueDate(LocalDateTime.of(2026, 12, 31, 23, 59))
                .build();

        Set<ConstraintViolation<TaskCreateRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("blank title fails validation")
    void blankTitle_failsValidation() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("")
                .build();

        Set<ConstraintViolation<TaskCreateRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("title"));
    }

    @Test
    @DisplayName("null title fails validation")
    void nullTitle_failsValidation() {
        TaskCreateRequest request = TaskCreateRequest.builder().build();

        Set<ConstraintViolation<TaskCreateRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("title"));
    }

    @Test
    @DisplayName("title exceeding max length fails validation")
    void titleTooLong_failsValidation() {
        String longTitle = "A".repeat(101);
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title(longTitle)
                .build();

        Set<ConstraintViolation<TaskCreateRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("title"));
    }

    @Test
    @DisplayName("null description passes validation")
    void nullDescription_passesValidation() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Valid Task")
                .build();

        Set<ConstraintViolation<TaskCreateRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("description exceeding max length fails validation")
    void descriptionTooLong_failsValidation() {
        String longDesc = "A".repeat(501);
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Valid Task")
                .description(longDesc)
                .build();

        Set<ConstraintViolation<TaskCreateRequest>> violations = validator.validate(request);

        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("description"));
    }
}
