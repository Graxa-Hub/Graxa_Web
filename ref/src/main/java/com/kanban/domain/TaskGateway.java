package com.kanban.domain;

import java.util.List;
import java.util.Optional;

public interface TaskGateway {
    Task save(Task task);
    Optional<Task> findById(Long id);
    List<Task> findAll();
    List<Task> findByStatus(TaskStatus status);
    void delete(Task task);
    boolean existsByTitle(String title);
    boolean existsByTitleAndIdNot(String title, Long id);
}