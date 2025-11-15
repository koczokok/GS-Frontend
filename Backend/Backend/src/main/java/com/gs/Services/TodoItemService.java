package com.gs.Services;

import com.gs.Entities.TodoItem;
import com.gs.Repositories.TodoItemRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TodoItemService {

    private final TodoItemRepository todoRepository;

    public TodoItemService(TodoItemRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoItem> getAllTodos() {
        return todoRepository.findAll();
    }

    public Optional<TodoItem> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    public List<TodoItem> getTodosByUserId(Long userId) {
        return todoRepository.findByUserId(userId);
    }

    public List<TodoItem> getTodosBeforeDeadline(Date date) {
        return todoRepository.findByDeadlineBefore(date);
    }

    public TodoItem saveTodo(TodoItem todo) {
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
