import { Component, OnInit } from '@angular/core';
import { FilterButton, Filter } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  filterButton: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Completed, label: 'Completed', isActive: false },
  ]

  length;
  hasComplete$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    // const subscription = someObservarble.subscribe(...);
    // subscription.unsubscribe();
    this.hasComplete$ = this.todoService.todos$.pipe(
      map(todos => todos.some(t => t.isCompleted)),
      takeUntil(this.destroy$)
    )
    this.todoService.length$.pipe(takeUntil(this.destroy$)).subscribe(length => {
      this.length = length;
    })
  }

  filter(type: Filter){
    this.setActiveFilterBtn(type);
    this.todoService.filterTodos(type);
  }
  private setActiveFilterBtn(type: Filter){
    this.filterButton.forEach(btn => {
      btn.isActive = btn.type === type;
    })
  }
  clearCompleted(){
    this.todoService.clearCompleted();
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
