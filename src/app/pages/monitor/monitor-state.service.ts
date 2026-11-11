import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitorStateService {
  private overdueSubject = new BehaviorSubject<boolean>(false);
  public overdue$: Observable<boolean> = this.overdueSubject.asObservable();

  setOverdue(value: boolean): void {
    this.overdueSubject.next(value);
  }

  get isOverdue(): boolean {
    return this.overdueSubject.getValue();
  }
}
