import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = "";
  userId = 0;
  changeEmailMsg = "";
  changePhoneMsg = "";
  changeZipMsg = "";
  changePwdMsg = "";
  imgURL = "https://s1.chu0.com/src/img/png/f5/f585c840fdaf4d47a344df75ee34c14a.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:00KSYo4Cz9Msm67tpVJbja5C56k="

  linkMsg = "";
  link = false;

  oldInfo: any = {
    accountName: "",
    email: "",
    phoneNum: "",
    zipcode: "",
    password: "**********",
    google: ""
  }

  public userInfo: any = {
    accountName: "",
    email: "",
    phoneNum: "",
    zipcode: "",
    password: "",
    password2: ""
  }

  url = "http://127.0.0.1:3000/";
  // url = "https://smileychat.herokuapp.com/";
  filetypeMsg = "";


  constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {

    this.http.get(this.url + "username", {withCredentials: true}).subscribe((res:any) => {
      this.oldInfo.accountName = res["username"];
      this.userInfo.accountName = res["username"];
      this.http.get(this.url + "email/" + this.oldInfo.accountName, {withCredentials: true}).subscribe((res:any) => {
        this.oldInfo.email = res["email"];
      })
  
      this.http.get(this.url + "phoneNum/" + this.oldInfo.accountName, {withCredentials: true}).subscribe((res:any) => {
        this.oldInfo.phoneNum = res["phoneNum"];
      })
  
      this.http.get(this.url + "zipcode/" + this.oldInfo.accountName, {withCredentials: true}).subscribe((res:any) => {
        this.oldInfo.zipcode = res["zipcode"];
      })

      this.http.get(this.url + "avatar/" + this.oldInfo.accountName, {withCredentials: true}).subscribe((res:any) => {
        this.imgURL = res["avatar"];
      })

      this.http.get(this.url + "google/", {withCredentials: true}).subscribe((res:any) => {
        if (res['auth']) {
          if (res['auth']['Google']) {
            this.link = true;
          } 
        }
        
      })

    });
    
  }


  gotoMain(){
    this.router.navigate(['main']);
  }

  uploadAvatar(img: any){
    let file = img.files[0];
    console.log(file)
    const fd = new FormData();
    fd.append('image', file);

    this.http.put(this.url + 'avatar/', fd, {withCredentials: true}).subscribe((res:any) => {
      this.http.get(this.url + "avatar/" + this.oldInfo.accountName, {withCredentials: true}).subscribe((res:any) => {
        this.imgURL = res["avatar"];
      })
    })

  }

  updateInfo(){
    this.changeEmailMsg = "";
    this.changePhoneMsg = "";
    this.changePwdMsg = "";
    this.changeZipMsg = "";

    if (this.userInfo.email != "" && this.userInfo.email != null && (this.userInfo.email != this.oldInfo.email)) {
      this.changeEmailMsg = "Email changed from " + this.oldInfo.email + " to " + this.userInfo.email ;

      this.http.put(this.url + "email/", {email: this.userInfo.email}, {withCredentials: true}).subscribe((res:any) => {
        this.oldInfo.email = res["email"];
      })
    }

    if (this.userInfo.phoneNum != "" && this.userInfo.phoneNum != null && (this.userInfo.phoneNum != this.oldInfo.phoneNum)) {
      this.changePhoneMsg = "Phone changed from " + this.oldInfo.phoneNum + " to " + this.userInfo.phoneNum ;

      this.http.put(this.url + "phoneNum/", {phoneNum: this.userInfo.phoneNum}, {withCredentials: true}).subscribe((res:any) => {
        this.oldInfo.phoneNum = res["phoneNum"];
      })
    }

    if (this.userInfo.zipcode != "" && this.userInfo.zipcode != null && (this.userInfo.zipcode != this.oldInfo.zipcode)) {
      this.changeZipMsg = "Zipcode changed from " + this.oldInfo.zipcode + " to " + this.userInfo.zipcode ;

      this.http.put(this.url + "zipcode/", {zipcode: this.userInfo.zipcode}, {withCredentials: true}).subscribe((res:any) => {
        this.oldInfo.zipcode = res["zipcode"];
      })
    }

    if (this.userInfo.password != "" && this.userInfo.password != null && (this.userInfo.password != this.oldInfo.password)) {
      var msg1 = "";

      this.http.put(this.url + "password/", {password: this.userInfo.password}, {withCredentials: true}).subscribe((res:any) => {
        if (res["result"] == "success") {
          this.changePwdMsg = "Password changed successfully!";
        }
      })
    }

    this.userInfo.email = "";
    this.userInfo.phoneNum = "";
    this.userInfo.zipcode = "";
    this.userInfo.password = "";
    this.userInfo.password2 = "";
  }

  linkAccount(){
    this.http.get(this.url + "linkAccount", {withCredentials: true}).subscribe((res:any) => {
    
      if (res['result'] == "lack account")
        this.router.navigate(['']);
      else if (res['result'] == "success") {
        this.linkMsg = res['username1'] + " has successfully linked to " + res['username2'];
        this.ngOnInit();
      }
       
    })
  }

  unlinkAccount(){
    this.http.delete(this.url + "google/", {withCredentials: true}).subscribe((res:any) => {
      this.linkMsg = "Successful unlink!";
      this.link = false;
    })
  }
}

