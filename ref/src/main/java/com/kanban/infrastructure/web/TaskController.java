package com.kanban.infrastructure.web;

import com.kanban.domain.Task;
import com.kanban.domain.TaskStatus;
import com.kanban.usecase.CreateTaskUseCase;
import com.kanban.usecase.DeleteTaskUseCase;
import com.kanban.usecase.FindAllTasksUseCase;
import com.kanban.usecase.FindTaskByIdUseCase;
import com.kanban.usecase.FindTasksByStatusUseCase;
import com.kanban.usecase.UpdateTaskStatusUseCase;
import com.kanban.usecase.UpdateTaskUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final CreateTaskUseCase createTask;
    private final FindAllTasksUseCase findAllTasks;
    private final FindTaskByIdUseCase findTaskById;
    private final FindTasksByStatusUseCase findTasksByStatus;
    private final UpdateTaskUseCase updateTask;
    private final UpdateTaskStatusUseCase updateTaskStatus;
    private final DeleteTaskUseCase deleteTask;
    private final TaskMapper taskMapper;

    public TaskController(
            CreateTaskUseCase createTask,
            FindAllTasksUseCase findAllTasks,
            FindTaskByIdUseCase findTaskById,
            FindTasksByStatusUseCase findTasksByStatus,
            UpdateTaskUseCase updateTask,
            UpdateTaskStatusUseCase updateTaskStatus,
            DeleteTaskUseCase deleteTask,
            TaskMapper taskMapper) {
        this.createTask = createTask;
        this.findAllTasks = findAllTasks;
        this.findTaskById = findTaskById;
        this.findTasksByStatus = findTasksByStatus;
        this.updateTask = updateTask;
        this.updateTaskStatus = updateTaskStatus;
        this.deleteTask = deleteTask;
        this.taskMapper = taskMapper;
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> create(@Valid @RequestBody TaskRequestDTO dto) {
        Task task = taskMapper.toDomain(dto);
        Task saved = createTask.execute(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(taskMapper.toDTO(saved));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> findAll() {
        List<TaskResponseDTO> result = findAllTasks.execute().stream()
                .map(taskMapper::toDTO)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(taskMapper.toDTO(findTaskById.execute(id)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponseDTO>> findByStatus(@PathVariable TaskStatus status) {
        List<TaskResponseDTO> result = findTasksByStatus.execute(status).stream()
                .map(taskMapper::toDTO)
                .toList();
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> update(@PathVariable Long id, @Valid @RequestBody TaskRequestDTO dto) {
        Task updated = updateTask.execute(id, taskMapper.toDomain(dto));
        return ResponseEntity.ok(taskMapper.toDTO(updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDTO> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        TaskStatus status = TaskStatus.valueOf(body.get("status"));
        Task updated = updateTaskStatus.execute(id, status);
        return ResponseEntity.ok(taskMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteTask.execute(id);
        return ResponseEntity.noContent().build();
    }
}