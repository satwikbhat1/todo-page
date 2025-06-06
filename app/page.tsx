"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  created_at: string
  updated_at: string
}

const API_BASE_URL = "http://localhost:8000"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({ title: "", description: "" })
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/todos`)
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      } else {
        throw new Error("Failed to fetch todos")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch todos. Make sure the backend server is running.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Create new todo
  const createTodo = async () => {
    if (!newTodo.title.trim()) {
      toast({
        title: "Error",
        description: "Todo title is required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })

      if (response.ok) {
        const createdTodo = await response.json()
        setTodos([...todos, createdTodo])
        setNewTodo({ title: "", description: "" })
        toast({
          title: "Success",
          description: "Todo created successfully",
        })
      } else {
        throw new Error("Failed to create todo")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      })
    }
  }

  // Update todo
  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
        setEditingTodo(null)
        toast({
          title: "Success",
          description: "Todo updated successfully",
        })
      } else {
        throw new Error("Failed to update todo")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
        toast({
          title: "Success",
          description: "Todo deleted successfully",
        })
      } else {
        throw new Error("Failed to delete todo")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  // Toggle todo completion
  const toggleTodo = async (todo: Todo) => {
    await updateTodo(todo.id, { completed: !todo.completed })
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Stay organized and get things done</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="text-sm">
              Total: {totalCount}
            </Badge>
            <Badge variant="default" className="text-sm">
              Completed: {completedCount}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Remaining: {totalCount - completedCount}
            </Badge>
          </div>
        </div>

        {/* Add new todo form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Todo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Todo title..."
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && createTodo()}
              />
              <Input
                placeholder="Description (optional)..."
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && createTodo()}
              />
              <Button onClick={createTodo} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Todo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo list */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Loading todos...</p>
              </CardContent>
            </Card>
          ) : todos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-2">No todos yet!</p>
                <p className="text-sm text-gray-400">Add your first todo above to get started.</p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo.id} className={`transition-all duration-200 ${todo.completed ? "opacity-75" : ""}`}>
                <CardContent className="p-6">
                  {editingTodo?.id === todo.id ? (
                    <div className="space-y-4">
                      <Input
                        value={editingTodo.title}
                        onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                        placeholder="Todo title..."
                      />
                      <Input
                        value={editingTodo.description}
                        onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                        placeholder="Description..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateTodo(editingTodo.id, {
                              title: editingTodo.title,
                              description: editingTodo.description,
                            })
                          }
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingTodo(null)}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p
                            className={`text-sm mt-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-600"}`}
                          >
                            {todo.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(todo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingTodo(todo)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteTodo(todo.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
