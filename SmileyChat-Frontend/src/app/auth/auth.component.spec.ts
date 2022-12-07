import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { AuthComponent } from './auth.component';
import { HttpClientModule } from "@angular/common/http";

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      imports: [AppModule, HttpClientModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in a previously registered user', (done:DoneFn) => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const loginButton = rootDivElement.querySelector('.btn');


    component.getUsers().subscribe((res:any)=>{
      component.userList = res
      component.loggerInfo.loginName = "Bret"
      component.loggerInfo.password = "Kulas Light"
      loginButton.click();
   
      let loginState = localStorage.getItem("loginState") == null ? "No" : localStorage.getItem("loginState");
      expect(loginState).toEqual("Yes");
      done();
    });

  });

  it('should not log in an invalid user', (done:DoneFn) => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const loginButton = rootDivElement.querySelector('.btn');

    component.getUsers().subscribe((res:any)=>{
      component.userList = res
      component.loggerInfo.loginName = "Bret"
      component.loggerInfo.password = "Kulas123"
      loginButton.click();
   
      expect(component.errorState).toEqual(true);

      component.loggerInfo.loginName = "123Bret"
      component.loggerInfo.password = "Kulas123"
      loginButton.click();
      expect(component.errorState).toEqual(true);

      done();
    });

  });
});
