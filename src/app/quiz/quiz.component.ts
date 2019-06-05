import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Quiz} from '../Types/quiz';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../shared/services/auth.service';
import * as firebase from 'firebase/app';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quiz: Quiz;
  quizzes: Quiz[] = [];

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private snack: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.quiz = {
      options: [], question: '', correctAns: '', solutionDesc: ''
    };
    this.db.collection('Quizzes').snapshotChanges().subscribe(quizzes => {
      this.quizzes = quizzes.map(quiz => {
        return {
          id: quiz.payload.doc.id,
          ...quiz.payload.doc.data()
        } as Quiz;
      });
    });
  }


  onSubmit(form: NgForm) {
    console.log(this.quiz);
    this.quiz.answered = [];
    this.quiz.wrongs = [];
    this.db.collection('Quizzes').add(this.quiz).then(r => {
      console.log('Uploaded');
    });
    this.quiz = {
      answered: [],
      correctAns: '',
      question: '',
      solutionDesc: '',
      wrongs: [],
      options: []
    };
    this.snack.open('Question Added Succefully', 'Close', {
      duration: 1000
    });
    form.reset();

  }

  createOption(option: HTMLInputElement) {
    this.quiz.options.push(option.value);
    option.value = '';
  }

  isValid() {
    return (this.quiz.options.length >= 2 && this.quiz.correctAns !== '');
  }

  answered(qes: Quiz, opt: string) {
    if (qes.correctAns === opt) {
      console.log('Correct!!..');
      this.db.collection('Quizzes').doc(qes.id).update({
        answered: firebase.firestore.FieldValue.arrayUnion(this.authService.getUID())
      });
    } else {
      console.log('Wrong!!');
      this.db.collection('Quizzes').doc(qes.id).update({
        wrongs: firebase.firestore.FieldValue.arrayUnion(this.authService.getUID())
      });
    }
  }

  isAvailable(qes: Quiz) {
    return !(qes.answered.includes(this.authService.getUID()) || qes.wrongs.includes(this.authService.getUID()));
  }
}
