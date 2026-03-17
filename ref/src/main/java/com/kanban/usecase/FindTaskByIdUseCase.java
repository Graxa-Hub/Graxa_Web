package com.kanban.usecase;

import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import com.kanban.domain.TaskNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class FindTaskByIdUseCase {

    private final TaskGateway taskGateway;

    public FindTaskByIdUseCase(TaskGateway taskGateway) {
        this.taskGateway = taskGateway;
    }

    public Task execute(Long id) {
        return taskGateway.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }
}