package com.kanban.usecase;

import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import com.kanban.domain.TaskStatus;
import org.springframework.stereotype.Service;

@Service
public class UpdateTaskStatusUseCase {

    private final TaskGateway taskGateway;
    private final FindTaskByIdUseCase findTaskByIdUseCase;

    public UpdateTaskStatusUseCase(TaskGateway taskGateway, FindTaskByIdUseCase findTaskByIdUseCase) {
        this.taskGateway = taskGateway;
        this.findTaskByIdUseCase = findTaskByIdUseCase;
    }

    public Task execute(Long id, TaskStatus status) {
        Task existing = findTaskByIdUseCase.execute(id);
        existing.setStatus(status);
        return taskGateway.save(existing);
    }
}
