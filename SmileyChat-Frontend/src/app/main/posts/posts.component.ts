import { Component, OnInit } from '@angular/core';
import { PostsService } from './posts.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  userPosts: any[] = [];
  validPosts: any[] = [];
  showPosts: any[] = [];
  pageAmount: any[] = [];

  pager = {
    total: 0,
    curPage: 1,
    pageSize: 10,
    amount: 0
  };

  username = "";
  avatar = "";

  newPost = {
    title: "",
    body: ""
  };

  followingList = [];

  url = "http://127.0.0.1:3000/"
  // url = "https://smileychat.herokuapp.com/";

  searchText: any = "";

  constructor(private postService: PostsService, private http: HttpClient) { }


  ngOnInit(): void {
    this.http.get(this.url + 'username', {withCredentials: true}).subscribe((res:any) => {
      let username = res["username"];
      this.username = username;     
      this.http.get(this.url + "avatar/" + this.username, {withCredentials: true}).subscribe((res:any) => {
          this.avatar = res["avatar"];
      })
    })
    this.addAvatars();
  }


  addAvatars(){
    this.http.get(this.url + "articles/", {withCredentials: true}).subscribe((res:any) => {
      this.userPosts = res["articles"];
      this.userPosts.sort(function(a,b){return Date.parse(b.date) - Date.parse(a.date)});

      return new Promise(
        async addAvatar=>{
          for (let i = 0; i < this.userPosts.length; i++) {
            await this.http.get(this.url + "avatar/" + this.userPosts[i].author, {withCredentials: true}).subscribe((res:any) => {
         
              this.userPosts[i].avatar = res["avatar"];
            
              return new Promise(
                async addCommentAvatar=>{
                  for (let j = 0; j < this.userPosts[i].comments.length; j++) {
                    await this.http.get(this.url + "avatar/" + this.userPosts[i].comments[j].author, {withCredentials: true}).subscribe((res:any) => {

                      this.userPosts[i].comments[j].avatar = res["avatar"];

                    })
                  }
                }
              )
              
            })
          }
          this.validPosts = this.userPosts;
          this.getPagePost(1)
        }
      )

    })
  }


  getPagePost(curPage: any){
    this.pager.total = this.validPosts.length;
    this.pager.amount = Math.floor((this.pager.total - 0.1) / this.pager.pageSize) + 1;
    this.pageAmount = Array(this.pager.amount).fill(0).map((x, i) => i);
    this.pager.curPage = curPage;
    this.showPosts = this.validPosts.slice((curPage - 1) * this.pager.pageSize, (curPage * this.pager.pageSize));
  }


  getPrePage(){
    if (this.pager.curPage > 1) {
      this.pager.curPage --;
      this.getPagePost(this.pager.curPage);
    }
  }


  getNextPage(){
    if (this.pager.curPage < this.pager.amount) {
      this.pager.curPage ++;
      this.getPagePost(this.pager.curPage);
    }
  }


  addPost(img: any){
    let file = img.files[0];
    if (file != null) {
      const fd = new FormData();
      fd.append('image', file);
      this.http.put(this.url + "img", fd, {withCredentials: true}).subscribe((res:any) => {
        let img = res['url'];

        this.http.post(this.url + "article/", {text: this.newPost.body, img: img}, {withCredentials: true}).subscribe((res:any) => {
          this.newPost.body = "";
          this.getPagePost(1);
          this.addAvatars();
        });

      })
    } else {
      this.http.post(this.url + "article/", {text: this.newPost.body}, {withCredentials: true}).subscribe((res:any) => {
        this.newPost.body = "";
        this.getPagePost(1);
        this.addAvatars();
      });
    }
  }


  clean(){
    this.newPost.body = "";
  }


  searchPost(){
    let text = this.searchText;
    this.validPosts = this.userPosts.filter(function(p:any){
      return p.author.includes(text) || p.text.includes(text);
    })
    this.getPagePost(1);
    this.searchText = "";
  }


  addComment(id: any, comment: any){
    if (comment.trim() == "") {
      return;
    }
    this.http.put(this.url + "articles/" + id, {text: comment, commentId: -1}, {withCredentials: true}).subscribe((res:any)=>{
      this.addAvatars();
    })
  }


  editComment(id: any, comment: any, commentId: any){
    if (comment.trim() == "") {
      return;
    }
    this.http.put(this.url + "articles/" + id, {text: comment, commentId: commentId}, {withCredentials: true}).subscribe((res:any)=>{
      this.addAvatars();
    })
  }

  
  updatePost(id:any, text: any){
    this.http.put(this.url + "articles/" + id, {text: text}, {withCredentials: true}).subscribe((res:any)=>{
      this.addAvatars();
    })
  }
}
