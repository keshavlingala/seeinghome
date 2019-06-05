import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Post} from '../../Types/Post';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddPostComponent} from '../add-post/add-post.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  spinner = true;
  posts: Post[] = [];

  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage,
    private snak: MatSnackBar,
    private dialog: MatDialog,
    private afStore: AngularFirestore,
    private router: Router
  ) {
    if (!authService.isLoggedIn) {
      router.navigate(['/login']);
    }
  }

  async ngOnInit() {
    this.spinner = true;
    const user = await this.authService.getUser;
    console.log(user);
    await this.afStore.collection('Posts').snapshotChanges().subscribe(posts => {
      this.posts = posts.map(post => {
        return {
          id: post.payload.doc.id,
          ...post.payload.doc.data()
        } as Post;
      });
      console.log(this.posts);
      this.spinner = false;
    });
  }


  async like(card: Post) {
    console.log('Collection Updated');
    await this.afStore.collection('Posts').doc(card.id).update({
      likes: card.likes + 1
    });
    this.snak.open('You Liked ' + card.title, '', {
      duration: 1000
    });
    console.log('Update Finished');
  }
  openDialog() {
    this.dialog.open(AddPostComponent);
  }
}


