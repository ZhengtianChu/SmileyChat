import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {

  public userInfo: any = {
      username: "",
      email: "",
      phoneNum: "",
      birthday: "",
      zipcode: "",
      password: "",
      password2: ""
  }
  used = "";
  url = "http://127.0.0.1:3000/"
  // url = "https://smileychat.herokuapp.com/";

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {

  }



  onSubmit(){
    this.http.post(this.url + 'register', this.userInfo, {withCredentials: true}).subscribe((res:any) => {
      if (res["result"] == "success") {
        let loginUser = {
          username : this.userInfo.username,
          password : this.userInfo.password
        }
        this.http.post(this.url + 'login', loginUser).subscribe((res2:any) => {
          if (res2["result"] == "success") {
            this.router.navigate(['main']);
          }
        })
      } else if (res["result"] == "user exists") {
        this.used = "Account name is already used."
      } else if (res["result"] == "email exists") {
        this.used = "This email is already registered."
      }
    })
    
  }

}
