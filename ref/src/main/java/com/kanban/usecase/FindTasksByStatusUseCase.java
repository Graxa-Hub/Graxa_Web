package com.kanban.usecase;

import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import com.kanban.domain.TaskStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FindTasksByStatusUseCase {

    private final TaskGateway taskGateway;

    public FindTasksByStatusUseCase(TaskGateway taskGateway) {
        this.taskGateway = taskGateway;
    }

    public List<Task> execute(TaskStatus status) {
        return taskGateway.findByStatus(status);
    }
}
