import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PostsComponent } from './posts/posts.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild(PostsComponent) postComponent: any;
  
  userInfo: any = {
    username: "DLeebron",
    status: "HAPPY!",
    followingList: [],
    followingAvatars:[],
    followingStatus:[]
  }

  avatar = "";
  newStatus = "";
  newFollower = "";
  userExist = "";
  url = "http://127.0.0.1:3000/";
  // url = "https://smileychat.herokuapp.com/";

  constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.url + "username", {withCredentials: true}).subscribe((res:any) => {
      this.userInfo.username = res["username"];
      this.http.get(this.url + "headline/" + this.userInfo.username, {withCredentials: true}).subscribe((res:any) => {
        this.userInfo.username = res["username"];
        this.userInfo.status = res["headline"];
      })

      this.addAvatar();

      this.http.get(this.url + "avatar/" + this.userInfo.username, {withCredentials: true}).subscribe((res:any) => {
        if (res["avatar"].startsWith("public")) {
          this.avatar = this.url + res["avatar"];
        } else {
          this.avatar = res["avatar"];
        }
      })
    })
  }


  addAvatar(){
    this.http.get(this.url + "following/" + this.userInfo.username, {withCredentials: true}).subscribe((res:any) => {
      this.userInfo.followingList = res["followingList"];
      return new Promise(
        async addAvatar=>{
          for (let i = 0; i < this.userInfo.followingList.length; i++) {
            await this.http.get(this.url + "avatar/" + this.userInfo.followingList[i], {withCredentials: true}).subscribe((res:any) => {
              this.userInfo.followingAvatars[i] = res["avatar"];
            })
            await this.http.get(this.url + "headline/" + this.userInfo.followingList[i], {withCredentials: true}).subscribe((res:any) => {
              this.userInfo.followingStatus[i] = res["headline"];      
            })
          }
        }
      )
    })

  }

  removeFollowing(key: any){
    this.http.delete(this.url + "following/" + this.userInfo.followingList[key], {withCredentials: true}).subscribe((res:any) => {
      this.postComponent.addAvatars();
      this.userInfo.followingList = res['followingList'];
      this.addAvatar();
    })
  }


  logout(){
    this.http.put(this.url + "logout", {}, {withCredentials: true}).subscribe((res:any) => {
      if (res["result"] == "OK") {
        this.router.navigate(['']);
      }
    })
  }


  gotoProfile(){
    this.router.navigate(['profile']);
  }


  updateStatus(){
    if (this.newStatus.trim() == "") return;
    this.http.put(this.url + "headline/", {headline: this.newStatus} , {withCredentials: true}).subscribe((res:any) => {
      this.userInfo.status = res['headline'];
      this.newStatus = "";
    })
  }


  addFollower(){
    if (this.userInfo.followingList != null && this.userInfo.followingList.indexOf(this.newFollower) > -1) {
      this.userExist = "Already following!";
      this.newFollower = "";
    } 
    else if (this.newFollower == this.userInfo.username) {
      this.userExist = "Cannot follow yourself!";
      this.newFollower = "";}
    else if (this.newFollower.trim() == "") this.userExist = "Cannot be empty!";
    else {
      this.http.put(this.url + "following/" + this.newFollower, {},  {withCredentials: true}).subscribe((res:any) => {
        if (res['result'] == "User does not exist!") {
          this.userExist = "User does not exist!"
          this.newFollower = "";
        } else {
          this.addAvatar();
          this.postComponent.addAvatars();
          this.userExist = "";
          this.newFollower = "";
          this.userInfo.followingList = res['followingList'];
        }
      });
    }
  }
}
