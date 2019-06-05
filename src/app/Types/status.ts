import {Owner} from './Post';
import {StatComment} from './statComment';

export class Status {
  id?: string;
  data: string;
  likes: number;
  emotion: string;
  owner: Owner;
  comments?: StatComment[];
}
