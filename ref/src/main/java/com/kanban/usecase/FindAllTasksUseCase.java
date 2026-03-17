package com.kanban.usecase;

import com.kanban.domain.Task;
import com.kanban.domain.TaskGateway;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FindAllTasksUseCase {

    private final TaskGateway taskGateway;

    public FindAllTasksUseCase(TaskGateway taskGateway) {
        this.taskGateway = taskGateway;
    }

    public List<Task> execute() {
        return taskGateway.findAll();
    }
}