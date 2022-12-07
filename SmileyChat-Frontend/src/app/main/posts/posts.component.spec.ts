import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { PostsComponent } from './posts.component';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsComponent ],
      imports: [AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all articles for current logged in user', (done:DoneFn) => {
    component.userId = 1;
    setTimeout(function(){
      expect(component.userPosts.length).toEqual(40);
      var Posts = localStorage.getItem("showPosts")
      if (Posts != null) {
        // let testid : any[] = [];
        // component.userPosts.forEach((element:any) => {
        //   testid.push(element.id);
        // });
        // let arr = [];
        // for (var i = 11; i <= 50; i++) {
        //   arr.push(i);
        // }
        expect(component.showPosts).toEqual(JSON.parse(Posts));
      }
      done();
    },1000)
  });

  it('should fetch subset of articles for current logged in user given search keyword', (done:DoneFn) => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const searchBtn = rootDivElement.querySelector('#searchBtn');
    component.userId = 1;
    setTimeout(function(){
      component.searchText = "err";
      searchBtn.click();
      expect(component.showPosts.length).toEqual(3);

      component.searchText = "quo";
      searchBtn.click();
      expect(component.showPosts.length).toEqual(15);
      done();
    },1000);
   
  })

  it('should add a new post', (done:DoneFn) => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const postBtn = rootDivElement.querySelector('#newPostBtn');
   
    setTimeout(function(){
      component.newPost.body = "Hello World!";
      component.newPost.title = "First Post";
      component.addPost();
      expect(component.showPosts.length).toEqual(41);
      done();
    },1000)
    
   
  })

  it('should clean the title and body of new post', () => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const cleanBtn = rootDivElement.querySelector('#cleanBtn');
    component.newPost.body = "Hello World!";
    component.newPost.title = "First Post";
    cleanBtn.click();
    expect("").toEqual(component.newPost.body);
    expect("").toEqual(component.newPost.title);
   
  })




  
});
