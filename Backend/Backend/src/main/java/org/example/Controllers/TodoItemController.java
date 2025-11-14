package org.example.Controllers;

import org.example.Entities.TodoItem;
import org.example.Services.TodoItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoItemController {

    private final TodoItemService todoService;

    public TodoItemController(TodoItemService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public List<TodoItem> getAllTodos() {
        return todoService.getAllTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoItem> getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<TodoItem> getTodosByUser(@PathVariable Long userId) {
        return todoService.getTodosByUserId(userId);
    }

    @GetMapping("/deadline")
    public List<TodoItem> getTodosBeforeDeadline(@RequestParam Date date) {
        return todoService.getTodosBeforeDeadline(date);
    }

    @PostMapping
    public TodoItem createTodo(@RequestBody TodoItem todo) {
        return todoService.saveTodo(todo);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
}
