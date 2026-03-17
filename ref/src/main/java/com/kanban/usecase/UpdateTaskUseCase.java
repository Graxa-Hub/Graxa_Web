package com.kanban.usecase;

import com.kanban.domain.DuplicateTitleException;
import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import org.springframework.stereotype.Service;

@Service
public class UpdateTaskUseCase {

    private final TaskGateway taskGateway;
    private final FindTaskByIdUseCase findTaskByIdUseCase;

    public UpdateTaskUseCase(TaskGateway taskGateway, FindTaskByIdUseCase findTaskByIdUseCase) {
        this.taskGateway = taskGateway;
        this.findTaskByIdUseCase = findTaskByIdUseCase;
    }

    public Task execute(Long id, Task updated) {
        Task existing = findTaskByIdUseCase.execute(id);
        if (taskGateway.existsByTitleAndIdNot(updated.getTitle(), id)) {
            throw new DuplicateTitleException(updated.getTitle());
        }
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDueDate(updated.getDueDate());
        existing.setStatus(updated.getStatus());
        return taskGateway.save(existing);
    }
}