import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private _error: string;
  private _loading: boolean;

  constructor(
    private _authservice: AuthService,
    private _router: Router) {
    if (_authservice.isLoggedIn) {
      _router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this._error = '';
  }


  get error(): string {
    return this._error;
  }

  get loading(): boolean {
    return this._loading;
  }

  get authservice(): AuthService {
    return this._authservice;
  }

  get router(): Router {
    return this._router;
  }

  login(value: string, value2: string) {

    this._loading = true;
    this._authservice.login(value, value2).then(res => {
      this._error = '';
      this._router.navigate(['/dashboard']);
    }).catch(reason => {
      this._error = reason;
      // alert('Reason: ' + reason);
      this._loading = false;
    });
  }
}
