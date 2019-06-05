import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../shared/services/auth.service';
import {NgForm} from '@angular/forms';
import {UserData} from '../Types/UserData';
import {Status} from '../Types/status';
import {MatSnackBar} from '@angular/material';
import {StatComment} from '../Types/statComment';
import {Owner} from '../Types/Post';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  statusData: Status;
  loading = false;
  UserData: UserData;
  sentiments = [
    'sentiment_satisfied_alt',
    'sentiment_dissatisfied',
    'sentiment_satisfied',
    'sentiment_very_dissatisfied',
    'sentiment_very_satisfied'
  ];
  allStatus: Status[] = [];
  owner: Owner;

  constructor(
    private db: AngularFirestore,
    private snackbar: MatSnackBar,
    private auth: AuthService
  ) {
  }

  async ngOnInit() {
    this.statusData = {
      data: '',
      likes: 0,
      emotion: 'sentiment_satisfied_alt',
      owner: null
    };
    // asynchronously collecting the current user data
    this.db.collection('Users').doc(this.auth.getUID()).valueChanges().subscribe(data => {
      this.UserData = {
        uid: this.auth.getUID(),
        ...data
      } as UserData;
      // collect and assign it to a field variable
      this.owner = {
        profileURL: this.UserData.profilePicURL,
        name: this.UserData.firstName + ' ' + this.UserData.lastName,
        uid: this.auth.getUID()
      };
      console.log(this.UserData);
    });
    this.db.collection('Status')
      .snapshotChanges()
      .subscribe(all => {
        this.allStatus = all.map(post => {
          return {
            id: post.payload.doc.id,
            ...post.payload.doc.data()
          } as Status;
        });
        // Fetching Comments for each post
        this.allStatus.forEach(stat => {
          this.db.collection('Status').doc(stat.id)
            .collection('Comments')
            .snapshotChanges().subscribe(comments => {
            stat.comments = comments.map(c => {
              return {
                id: c.payload.doc.id,
                ...c.payload.doc.data()
              } as StatComment;
            });
          });
        });

      });
  }


  selectEmoji(s: string) {
    this.statusData.emotion = s;
  }

  addRes(form: NgForm) {
    this.loading = true;
    this.statusData.owner = {
      uid: this.auth.getUID(),
      profileURL: this.UserData.profilePicURL,
      name: this.UserData.firstName + ' ' + this.UserData.lastName
    };
    console.log(this.statusData);
    this.db.collection('Status').add(this.statusData).then(() => {
      console.log('Updated Success');
      this.loading = false;
    });
    form.resetForm();

  }

  async thumbUp(stat: Status) {
    // adding the current user to liked persons with some user info
    this.db.collection('Status').doc(stat.id)
      .collection('Likes').doc(this.auth.getUID()).set(this.owner);
    // checking the post total likes and updating the post field
    this.db.collection('Status').doc(stat.id)
      .collection('Likes').snapshotChanges().subscribe(res => {
      this.db.collection('Status').doc(stat.id).update({
        likes: res.length
      });
    });
    // notifing user about his like
    this.snackbar.open('Liked Status', '', {
      duration: 1000
    });
  }

  comment(stat: Status, commentInput: HTMLInputElement) {
    const owner = this.owner;
    const data: StatComment = {
      comment: commentInput.value,
      owner
    };
    console.log(data);
    this.db.collection('Status').doc(stat.id)
      .collection('Comments').add(data).then(() => {
    });
    commentInput.value = '';

  }

  sharestat(stat: Status) {
    window.open('https://api.whatsapp.com/send?text=Hey Buddy Check this Website  https://seeinghome.web.app/');
  }

  async deletePost(stat: Status) {
    // Deleteing all it's likes
    await this.db.collection('Status').doc(stat.id)
      .collection('Likes').snapshotChanges()
      .subscribe(likes => {
        likes.forEach(like => {
          this.db.collection('Status').doc(stat.id).collection('Likes')
            .doc(like.payload.doc.id).delete();
        });
      });
    // Deleting all it's Comments
    await this.db.collection('Status').doc(stat.id)
      .collection('Comments').snapshotChanges()
      .subscribe(comments => {
        comments.forEach(comment => {
          this.db.collection('Status').doc(stat.id)
            .collection('Comments')
            .doc(comment.payload.doc.id).delete();
        });
      });
    await this.db.collection('Status').doc(stat.id).delete();
  }
}
