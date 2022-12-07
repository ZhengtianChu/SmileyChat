import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RegisterationComponent } from './registeration.component';
import { AppModule } from 'src/app/app.module';

describe('RegisterationComponent', () => {
  let component: RegisterationComponent;
  let fixture: ComponentFixture<RegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterationComponent ],
      imports: [FormsModule, AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not sign up a previously registered user', (done: DoneFn) => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const signUpBtn = rootDivElement.querySelector('#signUpBtn');
    setTimeout(function(){
      component.userInfo.accountName = "Bret";
      signUpBtn.click();
      expect(component.used).toBe("Account name is already used.")
      done();
    },1000);
   
  });

  
});
