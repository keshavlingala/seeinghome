import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../shared/services/auth.service';
import {UserData} from '../../Types/UserData';
import {Post} from '../../Types/Post';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: UserData;
  posts: Post[] = [];
  profileUID = '';

  constructor(
    private db: AngularFirestore,
    private  authService: AuthService,
    private snak: MatSnackBar,
    private storage: AngularFireStorage,
    private routes: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {

    // using async function in case of data dependency
    this.userData = {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      profilePicURL: '/assets/ppHolder.svg'
      //  use a place holder untill getting the image url from the database
    };
    const params = this.routes.snapshot.params;
    console.log(params);
    let uid = params.uid;
    this.profileUID = uid;
    if (!uid) {
      uid = this.authService.getUID();
    }
    await this.db.collection('Users').doc(uid).ref.get().then(doc => {
      if (doc.exists) {
        // if user exist get details
        this.db.collection('Users').doc(uid)
          .valueChanges().subscribe(res => {
          this.userData = res as UserData;
          // setting page user data
          console.log(this.userData);
        });
        this.db.collection('Posts', ref => ref.where('owner.uid', '==', uid))
          .snapshotChanges().subscribe(res => {
          this.posts = res.map(post => {
            return {
              id: post.payload.doc.id,
              ...post.payload.doc.data()
            } as Post;
            // getting the user posts
          });
        });
      } else {
        // else show 404 not found page
        this.router.navigate(['/profile/404']);
      }
    });
  }

  async like(card: Post) {
    console.log('Collection Updated');
    await this.db.collection('Posts').doc(card.id).update({
      likes: card.likes + 1
    });
    this.snak.open('You Liked ' + card.title, '', {
      duration: 1000
    });
    console.log('Update Finished');
  }

  async deletePost(card: Post) {
    if (this.authService.checkUser()) {
      if (confirm('Are You Sure you want to delete this Post')) {
        await this.storage.storage.refFromURL(card.imageURL).delete();
        console.log('File Deleted');
        await this.db.collection('Posts').doc(card.id).delete().then(res => {
          console.log('Delete Success');
        });
      }
    }
  }
}
