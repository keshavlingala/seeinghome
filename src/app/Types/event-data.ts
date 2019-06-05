import {Timestamp} from '@firebase/firestore-types';

export class EventData {
  id?: string;
  name: string;
  date: Timestamp;
  venue: string;
}
