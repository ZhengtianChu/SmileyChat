import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private activeRouter: ActivatedRoute) { }

  getPosts(){
    return this.http.get("https://jsonplaceholder.typicode.com/posts");
  }

  queryUser(){
    return this.activeRouter.queryParams;
  }

  getUsers(){
    return this.http.get("https://jsonplaceholder.typicode.com/users");
  }
}
