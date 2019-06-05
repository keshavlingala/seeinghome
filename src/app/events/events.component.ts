import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../shared/services/auth.service';
import {EventData} from '../Types/event-data';
import {MatDatepickerInputEvent, MatExpansionPanel} from '@angular/material';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  eventData: EventData;
  date: Date;
  error = '';
  events: EventData[] = [];
  timer: number;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService
  ) {
  }

  async ngOnInit() {
    this.eventData = {
      date: null,
      name: '',
      venue: ''
    };
    this.db.collection('Events').snapshotChanges()
      .subscribe(docs => {
        this.events = docs.map(post => {
          return {
            id: post.payload.doc.id,
            ...post.payload.doc.data()
          } as EventData;
        });
        console.log(this.events);
      });
  }

  addEvent(input: string, event: MatDatepickerInputEvent<any>) {
    this.eventData.date = event.value;
    this.date = new Date(event.value);
    console.log(this.date);
  }

  timeSelected(time) {
    console.log(time.value);
    const t = time.value.split(':');
    console.log(t);
    if (t.length === 2) {
      this.date.setHours(t[0]);
      this.date.setMinutes(t[1]);
      console.log(this.date);
    }
  }

  async OnSubmit(panel: MatExpansionPanel) {
    this.error = '';
    console.log(this.eventData);
    try {
      await this.db.collection('Events').add({
        name: this.eventData.name,
        venue: this.eventData.venue,
        date: this.date
      });
      this.eventData = {
        date: null,
        name: '',
        venue: ''
      };
      panel.close();
    } catch (e) {
      this.error = e;
      panel.open();
    }
  }

  isValid() {
    return this.eventData.date != null;
  }

  deleteEvent(event: EventData) {
    if (confirm('Are you Sure you want to delete This Event')) {
      this.db.collection('Events').doc(event.id).delete().then(v => {
        console.log('Delete success');
      }).catch(alert);
    }
  }
}
