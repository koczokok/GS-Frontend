"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TodoItem } from "@/types/todo"
import { useSession } from "next-auth/react"
import { getTodosByUser, getTodos, createTodo, updateTodo, deleteTodo } from "@/lib/api"
import { Plus, Trash2, X } from "lucide-react"

export function TodoList() {
  const { data: session } = useSession()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTodoText, setNewTodoText] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const fetchTodos = async () => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Try to get userId from session, fallback to all todos
      if (session.userId && typeof session.userId === "string") {
        const userId = parseInt(session.userId)
        if (!isNaN(userId)) {
          const data = await getTodosByUser(userId)
          setTodos(data)
          setError(null)
          return
        }
      }
      
      // Fallback to all todos if userId not available
      const data = await getTodos()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos")
      console.error("Error fetching todos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [session])

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoText.trim() || !session?.userId) return

    try {
      setIsAdding(true)
      const userId = typeof session.userId === "string" ? parseInt(session.userId) : session.userId
      if (isNaN(userId)) {
        throw new Error("Invalid user ID")
      }

      const newTodo = await createTodo({
        text: newTodoText.trim(),
        done: false,
        deadline: null,
        userId: userId,
        challenge: null,
      })

      setTodos([...todos, newTodo])
      setNewTodoText("")
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo")
      console.error("Error adding todo:", err)
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleTodo = async (todo: TodoItem) => {
    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        done: !todo.done,
      })

      setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo")
      console.error("Error updating todo:", err)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter((t) => t.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo")
      console.error("Error deleting todo:", err)
    }
  }

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/95">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/95">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white">To-Do List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Todo Form */}
        {!session?.userId && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            Please sign in to add and manage tasks.
          </div>
        )}
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            disabled={isAdding || !session?.userId}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newTodoText.trim() || isAdding || !session?.userId}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="text-destructive text-xs bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}

        {/* Todos List */}
        {todos.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">No todos yet. Add some tasks to get started!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`p-3 rounded-lg border border-border/50 ${
                  todo.done
                    ? "bg-secondary/30 opacity-60"
                    : "bg-secondary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTodo(todo)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      todo.done
                        ? "bg-primary border-primary cursor-pointer hover:bg-primary/80"
                        : "border-muted-foreground cursor-pointer hover:border-primary"
                    }`}
                    disabled={!session?.userId}
                  >
                    {todo.done && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        todo.done
                          ? "line-through text-muted-foreground"
                          : "text-white"
                      }`}
                    >
                      {todo.text}
                    </p>
                    {todo.deadline && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(todo.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={!session?.userId}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

