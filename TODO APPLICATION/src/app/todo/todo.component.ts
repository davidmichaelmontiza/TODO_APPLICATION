import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatTabsModule } from "@angular/material/tabs"
import { TodoService } from "../todo.service"
import type { Todo } from "../todo.model"

@Component({
  selector: "app-todo",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = []
  newTodoTitle = ""
  searchText = ""
  activeTab: "tasks" | "completed" = "tasks"
  editingTodo: Todo | null = null
  editText = ""

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data.slice(0, 10)
    })
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return

    const todo: Partial<Todo> = {
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
    }

    this.todoService.addTodo(todo).subscribe((created) => {
      this.todos.unshift(created)
      this.newTodoTitle = ""
    })
  }

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo.id, todo).subscribe()
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id)
    })
  }

  startEdit(todo: Todo) {
    this.editingTodo = todo
    this.editText = todo.title
  }

  saveEdit() {
    if (this.editingTodo && this.editText.trim()) {
      this.editingTodo.title = this.editText
      this.updateTodo(this.editingTodo)
      this.cancelEdit()
    }
  }

  cancelEdit() {
    this.editingTodo = null
    this.editText = ""
  }

  setActiveTab(tab: "tasks" | "completed") {
    this.activeTab = tab
  }

  get filteredTodos() {
    return this.todos.filter(
      (todo) =>
        (this.activeTab === "tasks" ? !todo.completed : todo.completed) &&
        todo.title.toLowerCase().includes(this.searchText.toLowerCase()),
    )
  }

  get incompleteTasks() {
    return this.todos.filter((todo) => !todo.completed).length
  }

  get completedTasks() {
    return this.todos.filter((todo) => todo.completed).length
  }
}
