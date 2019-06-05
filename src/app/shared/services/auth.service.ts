import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserData} from '../../Types/UserData';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  user: User;
  currentUser: UserData;

  constructor(
    private db: AngularFirestore,
    private _afAuth: AngularFireAuth,
    private router: Router) {
    _afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.db.collection('Users').doc(this.user.uid).snapshotChanges().subscribe(res => {
          this.currentUser = {...res.payload.data} as UserData;
        });
      } else {
        localStorage.setItem('user', null);
      }
    });
    _afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });

  }

  get afAuth(): AngularFireAuth {
    return this._afAuth;
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  get getUser() {
    return this._afAuth.auth.currentUser;
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }

  getUID() {
    return localStorage.getItem('_uid');
  }

  checkUser(): boolean {
    const uid = this.afAuth.auth.currentUser.uid;
    if (this.getUID() !== uid) {
      localStorage.setItem('_uid', uid);
      console.log('Hack Blocked');
      return false;
    } else {
      return true;
    }
  }

  async login(e: string, p: string) {
    try {
      await this._afAuth.auth.signInWithEmailAndPassword(e, p);
      localStorage.setItem('_uid', this._afAuth.auth.currentUser.uid);
    } catch (e) {
      // alert('Error!' + e.message);
      throw e;
    }
  }

  async signup(e: string, p: string) {
    try {
      await this._afAuth.auth.createUserWithEmailAndPassword(e, p);
      localStorage.setItem('_uid', this._afAuth.auth.currentUser.uid);
    } catch (e) {
      alert(e);
      throw e;
    }
  }

  async logout() {
    await this._afAuth.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('_uid');
    this.router.navigate(['/login']);
  }
}
