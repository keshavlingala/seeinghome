import {Component, OnInit} from '@angular/core';
import {Owner, Post} from '../../Types/Post';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../shared/services/auth.service';
import {UserData} from '../../Types/UserData';
import {NgForm} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/storage';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  postData: Post;
  imageFile: File;
  currentUser: UserData;
  warnMessage: string;
  loading = false;
  status = '';

  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage,
    private router: Router,
    public dialogRef: MatDialogRef<AddPostComponent>,
    private db: AngularFirestore,
  ) {

  }

  ngOnInit() {
    this.postData = {description: '', imageURL: '', owner: undefined, title: ''};
    this.db.collection('Users').doc(this.authService.getUID()).valueChanges().subscribe(data => {
      this.currentUser = {
        uid: this.authService.getUID(),
        ...data
      } as UserData;
      console.log(this.currentUser);
    });
  }

  imageSelected(event) {
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      if (this.imageFile.size < 5000000 && this.imageFile.type.includes('image')) {
        this.warnMessage = '';
      } else {
        this.warnMessage = 'Image Size should be less than 5 MB';
      }
    }
    this.warnMessage = '';
  }

  isValid() {
    if (this.imageFile) {
      return (this.imageFile.size < 5000000) && this.imageFile.type.includes('image');
    } else {
      return false;
    }
  }


  async onSubmit(form: NgForm) {
    this.loading = true;
    this.status = 'Uploading Image to the Server...';
    console.log(form);
    console.log(this.postData);
    try {
      const task = await this.storage
        .ref('posts/' + this.currentUser.firstName + (new Date()).getTime())
        .put(this.imageFile);
      this.status = 'Image Uploaded Successfully';
      this.status = 'Fetching the Download URL...';
      const postURL = await task.ref.getDownloadURL();
      const owner: Owner = {
        name: this.currentUser.firstName + ' ' + this.currentUser.lastName,
        profileURL: this.currentUser.profilePicURL,
        uid: this.authService.getUID()
      };
      const data: Post = {
        description: this.postData.description,
        imageURL: postURL,
        likes: 0,
        owner,
        title: this.postData.title
      };
      this.status = 'Adding Post to the Database...';
      await this.db.collection('Posts').add(data);
      this.router.navigate(['/home']);
      this.loading = false;
      this.dialogRef.close();
    } catch (e) {
      this.loading = false;
      alert(e);
      console.log(e);
    }
  }
}
