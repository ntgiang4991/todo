import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { Filter } from '../models/filtering.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // biến private
  private static readonly TodoStorageKey = 'todos';
  private todos: Todo[] = [];
  private filteredTodos: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);// theo dõi filteredTodos; displayTodosSubject vừa là Observable, vừa là Observer
  /*
    1 Subject phải có Observer mới có thể đẩy giá trị mới vào stream của mình
    displayTodosSubject là private vì không phải class nào cũng có thể thay đổi dữ liệu, chỉ có class TodoService có thể đẩy dữ liệu mới vào thôi.
  */
  private currentFilter: Filter = Filter.All;

  // biến public
  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();// bên ngoài có thể xem dữ liệu của displayTodosSubject bằng biến todo$ - expose để bên ngoài sử dụng
  /*
    todos$ là Observable của displayTodosSubject (displayTodosSubject vừa là Observable, vừa là Observer) - chỉ có thể xem, lấy giá trị mà k thêm vào được
  */
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) { }

  // lấy dữ liệu từ LocalStorage
  fetchFromLocalStorage(){
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    // alert(this.todos);
    // this.filteredTodos = [...this.todos.map(todo => ({...todo}))];// map, set,... cloneDeep của lodash
    this.filteredTodos = [...this.todos];
    this.updateTodosData();
  }

  updateToLocalStorage(){
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);//
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }
 
  private updateTodosData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }

  /*private*/ filterTodos(filter: Filter, isFiltering: boolean = true){
    this.currentFilter = filter;
    switch(filter){
      case Filter.Active: this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Completed: this.filteredTodos = this.todos.filter(todo => todo.isCompleted);
        break;
      case Filter.All: 
        // this.filteredTodos = [...this.todos.map(todo => ({...todo}))];
        this.filteredTodos = [...this.todos];
        break;
    }

    if(isFiltering){
      this.updateTodosData();
    }
  }

  addTodo(content: string){
    const date = new Date(Date.now()).getTime();
    const newTodo = new Todo(date, content);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean){
    const index = this.todos.findIndex(t => t.id === id);
    const todo = this.todos[index];
    todo.isCompleted = isCompleted;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  editTodo(id: number, content: string){
    const index = this.todos.findIndex(t => t.id === id);
    const todo = this.todos[index];
    todo.content = content;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  deleteTodo(id: number){
    const index = this.todos.findIndex(t => t.id === id);
    this.todos.splice(index, 1);
    this.updateToLocalStorage();
  }

  toggleAll(){
    this.todos = this.todos.map(todo => {
      return {
        ...todo, 
        isCompleted: !this.todos.every(t => t.isCompleted)
      };
    });
    this.updateToLocalStorage();
  }

  clearCompleted(){
    this.todos = this.todos.filter(todo => !todo.isCompleted);
    this.updateToLocalStorage();
  }
}
