import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { of, Observable } from 'rxjs';
import { from } from 'rxjs';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private db: any;

  constructor() {
    this.db = new Dexie('myDb');
    this.db.version(1).stores({
      events: `++id, title, location, date, category`
    });
  }

  getEvents(): Observable<EventModel[]> {
    return from(this.db.events.toCollection().toArray());
  }

  getUpcomingEvents(): Observable<EventModel[]> {
    return from(this.db.events.orderBy('date').toArray());
  }

  getEventsForCategory(category): Observable<EventModel[]> {
    return from(this.db.events.where('category').equalsIgnoreCase(category).toArray());
  }

  getEvent(id: number): Observable<EventModel> {
    return from(this.db.events.get(id));
  }

  addEvent(event: EventModel): Observable<boolean> {
    const { id, ...data } = event;
    return from(this.db.events.add(data));
  }

  editEvent(event: EventModel): Observable<boolean> {
    const { id, ...data } = event;
    console.log(id, data, event)  ;
    return from(this.db.events.update(+id, data));
  }

  removeEvent(id: number): Observable<boolean> {
    return from(this.db.events.where(':id').equals(id).delete());
  }
}
