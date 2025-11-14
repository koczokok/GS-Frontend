package org.example.Repositories;

import org.example.Entities.TodoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Date;

@Repository
public interface TodoItemRepository extends JpaRepository<TodoItem, Long> {
    List<TodoItem> findByUserId(Long userId);
    List<TodoItem> findByDeadlineBefore(Date date);
}
