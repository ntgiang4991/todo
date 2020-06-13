import { Component } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo';
  hasTodo$: Observable<boolean>;
  constructor(private todoService: TodoService){}

  ngOninit(){
    this.todoService.fetchFromLocalStorage();
    /*
      length$ > 0, hasTodo$ = true, length$ = 0, hasTodo$ = false;
      length$ là Observable<number>, hasTodo$ là Observable<boolean> - 2 kiểu dữ liệu khác nhau => sử dụng pipe & map để thay đổi kdl
      khi length - number > 0 return true - boolean
    */
    this.hasTodo$ = this.todoService.length$.pipe(map(length => length > 0));
    console.log(this.todoService.length$)
  }
}
