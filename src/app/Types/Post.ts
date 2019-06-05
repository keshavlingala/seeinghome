export class Post {
  id?: string;
  title: string;
  description: string;
  imageURL: string;
  owner: Owner;
  likes?: number;
}

export interface Owner {
  uid: string;
  profileURL: string;
  name: string;
}


