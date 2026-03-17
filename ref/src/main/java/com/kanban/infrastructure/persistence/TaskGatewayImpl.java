package com.kanban.infrastructure.persistence;

import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import com.kanban.domain.TaskStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TaskGatewayImpl implements TaskGateway {

    private final TaskRepository jpaRepository;

    public TaskGatewayImpl(TaskRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Task save(Task task) {
        TaskJpaEntity entity = toJpaEntity(task);
        TaskJpaEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Task> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public List<Task> findByStatus(TaskStatus status) {
        return jpaRepository.findByStatus(status).stream().map(this::toDomain).toList();
    }

    @Override
    public void delete(Task task) {
        jpaRepository.delete(toJpaEntity(task));
    }

    @Override
    public boolean existsByTitle(String title) {
        return jpaRepository.existsByTitle(title);
    }

    @Override
    public boolean existsByTitleAndIdNot(String title, Long id) {
        return jpaRepository.existsByTitleAndIdNot(title, id);
    }

    // --- conversores internos ---

    private Task toDomain(TaskJpaEntity e) {
        return new Task(e.getId(), e.getTitle(), e.getDescription(), e.getDueDate(), e.getStatus());
    }

    private TaskJpaEntity toJpaEntity(Task t) {
        return new TaskJpaEntity(t.getId(), t.getTitle(), t.getDescription(), t.getDueDate(), t.getStatus());
    }
}