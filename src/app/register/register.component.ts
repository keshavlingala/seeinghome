import {Component, OnInit} from '@angular/core';
import {UserData} from '../Types/UserData';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private _AfStorage: AngularFireStorage,
    private _db: AngularFirestore,
    private _authService: AuthService,
    private _route: Router
  ) {
    if (_authService.isLoggedIn) {
      this._route.navigate(['/home']);
    }
  }

  private _status = 'Status Field';

  get status(): string {
    return this._status;
  }

  private _selectedFile: any;

  get selectedFile(): any {
    return this._selectedFile;
  }

  private _loading = false;

  get loading(): boolean {
    return this._loading;
  }

  private _userData: UserData;

  get userData(): UserData {
    return this._userData;
  }

  get AfStorage(): AngularFireStorage {
    return this._AfStorage;
  }

  get db(): AngularFirestore {
    return this._db;
  }

  get authService(): AuthService {
    return this._authService;
  }

  get route(): Router {
    return this._route;
  }

  ngOnInit() {
    this._userData = {
      email: '',
      firstName: '',
      lastName: ''
    };
  }

  async onSubmit(email: string, pass: string) {
    this._loading = true;
    try {
      this._status = 'Creating User...';
      console.log('Sign Up Started');
      await this._authService.signup(email, pass);
      console.log('Sign Up Ended');
      this._status = 'New User Created';
      console.log('Upload Task Start');
      if (this._selectedFile && this._selectedFile.type.includes('image')) {
        this._status = 'Profile Pic Uploading...';
        const upload = await this._AfStorage
          .ref('profiles/' + this._userData.firstName + (new Date()).getTime())
          .put(this._selectedFile);
        console.log('Upload Task Finish');
        this._status = 'Profile Pic Uploaded Successfully';
        const url = await upload.ref.getDownloadURL();
        console.log('Download URL Fetched');
        this._status = 'Profile Reference Fetched';
        this._userData.profilePicURL = url;
      } else {
        let holder: string;
        holder = 'https://firebasestorage.googleapis.com/v0/b/seeingsweethome.appspot.com/o/Zonal_OC.jpg' +
          '?alt=media&token=6c7dc727-aaeb-4c8b-8401-49c40e4ecf99';
        this._userData.profilePicURL = holder;
        this._status = 'No File Found, Using PlaceHolder Instead';
      }
      console.log('Uploading UserInfo to Database');
      this._status = 'Adding user to Database...';
      console.log(this._userData);
      await this._db.collection('Users').doc(this._authService.getUser.uid).set(this._userData);
      console.log('Database Updated Successfully');
      this._status = 'Registration Finished Successfully';
      await setTimeout(null, 500);
      this._loading = false;
      this._route.navigate(['/login']);
    } catch (e) {
      alert(e);
      this._loading = false;
    }
    // this.AfStorage.ref('profiles/' + email + this.userData.rollNo).put(file);
  }

  isValid(fileMessage: HTMLSpanElement) {
    console.log(this._selectedFile);
    if (this._selectedFile) {
      console.log('file present');
      if ((this._selectedFile.size < 5000000) && this._selectedFile.type.includes('image')) {
        fileMessage.innerHTML = '';
        return true;
      } else {
        fileMessage.innerHTML = 'File Should be Image File less than 5MB ';
        this._selectedFile = null;
        return false;
      }
    } else {
      console.log('file not present');
      fileMessage.innerHTML = '';
      return true;
    }
  }

  fileSelected(event) {
    this._selectedFile = event.target.files[0];
    console.log(this._selectedFile);
  }
}
