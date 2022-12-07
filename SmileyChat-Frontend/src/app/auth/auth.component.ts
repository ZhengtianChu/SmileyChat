import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  
  userList: any[] = [];

  url = "http://127.0.0.1:3000/"
  // url = "https://smileychat.herokuapp.com/";

  errorState = false;

  constructor(private http: HttpClient, private router: Router) { }

  public loggerInfo: any = {
    loginName: "",
    password: "",
    loginMsg:""
  }

  ngOnInit(): void {
  }

  login(){
    let loginUser = {
      username : this.loggerInfo.loginName,
      password : this.loggerInfo.password
    }

    this.http.post(this.url + 'login', loginUser, {withCredentials: true}).subscribe((res:any) => {
      if (res["result"] == "success") {
        this.router.navigate(['main']);
      } else {
        this.loggerInfo.loginMsg = "Incorrect username or password";
      }
    })


  }
}
