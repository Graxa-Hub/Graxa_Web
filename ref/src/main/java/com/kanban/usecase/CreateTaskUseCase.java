package com.kanban.usecase;

import com.kanban.domain.DuplicateTitleException;
import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import org.springframework.stereotype.Service;

@Service
public class CreateTaskUseCase {

    private final TaskGateway taskGateway;

    public CreateTaskUseCase(TaskGateway taskGateway) {
        this.taskGateway = taskGateway;
    }

    public Task execute(Task task) {
        if (taskGateway.existsByTitle(task.getTitle())) {
            throw new DuplicateTitleException(task.getTitle());
        }
        return taskGateway.save(task);
    }
}
