package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public final class TaskSpecifications {

    private TaskSpecifications() {
    }

    public static Specification<Task> isCompleted(Boolean completed) {
        if (completed == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("isCompleted"), completed);
    }

    public static Specification<Task> dueDateFrom(LocalDateTime from) {
        if (from == null) {
            return null;
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dueDate"), from);
    }

    public static Specification<Task> dueDateTo(LocalDateTime to) {
        if (to == null) {
            return null;
        }
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("dueDate"), to);
    }
}
