import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private _authService: AuthService
  ) {
  }

  get authService(): AuthService {
    return this._authService;
  }

  ngOnInit() {

  }

  verifyEmail(message: HTMLSpanElement) {
    this._authService.getUser.sendEmailVerification().then(() => {
      message.innerHTML = 'Email Verification Link Sent to ' + this._authService.getUser.email;
    });
  }


}
