package com.kanban.infrastructure.persistence;

import com.kanban.domain.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskJpaEntity, Long> {
    boolean existsByTitle(String title);
    boolean existsByTitleAndIdNot(String title, Long id);
    List<TaskJpaEntity> findByStatus(TaskStatus status);
}