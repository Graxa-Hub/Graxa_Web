package com.kanban.infrastructure.web;

import com.kanban.domain.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toDomain(TaskRequestDTO dto) {
        return new Task(
                null,
                dto.getTitle(),
                dto.getDescription(),
                dto.getDueDate(),
                dto.getStatus()
        );
    }

    public TaskResponseDTO toDTO(Task task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .build();
    }
}