import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      imports: [AppModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add articles when adding a follower', (done:DoneFn) => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const addFollowerBtn = rootDivElement.querySelector('#addFollowerBtn');

    setTimeout(function(){

      component.newFollower = "Antonette";
      addFollowerBtn.click();
      let showPosts = localStorage.getItem("showPosts")
      
      if (showPosts != null)
        expect(JSON.parse(showPosts).length).toEqual(40);

      component.newFollower = "XXXX";
      addFollowerBtn.click();
      showPosts = localStorage.getItem("showPosts")
      if (showPosts != null)
        expect(JSON.parse(showPosts).length).toEqual(40);

      component.newFollower = "Kamren";
      addFollowerBtn.click();
      showPosts = localStorage.getItem("showPosts")
      if (showPosts != null){
        expect(JSON.parse(showPosts).length).toEqual(50);
      }
      done();
    },1000)
  })

  it('should remove articles when removing a follower', (done:DoneFn) => {
    setTimeout(function(){
      component.removeFollowing(0)
      let showPosts = localStorage.getItem("showPosts")
      if (showPosts != null){
        expect(JSON.parse(showPosts).length).toEqual(30);
      }

      component.removeFollowing(0)
      showPosts = localStorage.getItem("showPosts")
      if (showPosts != null){
        expect(JSON.parse(showPosts).length).toEqual(20);
      }

      component.removeFollowing(0)
      showPosts = localStorage.getItem("showPosts")
      if (showPosts != null){
        expect(JSON.parse(showPosts).length).toEqual(10);
      }
      done();
    },1000)
  })

  
  it('should log out a user', () => {
    component.logout();
    let loginState = localStorage.getItem("loginState") == null ? "No" : localStorage.getItem("loginState");
    expect(loginState).toEqual("No");
  });

  it('should update status', () => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const updateStatusBtn = rootDivElement.querySelector('#updateStatusBtn');
    component.newStatus = "Free";
    updateStatusBtn.click();
    expect(component.userInfo.status).toEqual("Free");
  });

});
