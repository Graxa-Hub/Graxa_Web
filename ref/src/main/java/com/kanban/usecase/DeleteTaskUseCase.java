package com.kanban.usecase;

import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import org.springframework.stereotype.Service;

@Service
public class DeleteTaskUseCase {

    private final TaskGateway taskGateway;
    private final FindTaskByIdUseCase findTaskByIdUseCase;

    public DeleteTaskUseCase(TaskGateway taskGateway, FindTaskByIdUseCase findTaskByIdUseCase) {
        this.taskGateway = taskGateway;
        this.findTaskByIdUseCase = findTaskByIdUseCase;
    }

    public void execute(Long id) {
        Task existing = findTaskByIdUseCase.execute(id);
        taskGateway.delete(existing);
    }
}
