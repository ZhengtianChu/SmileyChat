import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should fetch the logged in user's profile username", (done: DoneFn) => {
    setTimeout(() => {
      if (component.username != null)
      {
        expect("Bret").toEqual(component.username);
      } else {
        expect("").toEqual(component.username);
      }
      done();
    }, 1000);
  })

  it('should update the username information', () => {
    const rootDivElement = fixture.elementRef.nativeElement;
    const updateBtn = rootDivElement.querySelector('#updateBtn');

    component.userInfo.zipcode = "11111";
    component.userInfo.email = "123@456.com";
    component.userInfo.phoneNum = "123-456-7890";
    component.userInfo.password = "s111111"
    updateBtn.click();
    expect(component.oldInfo.zipcode).toBe("11111");
    expect(component.oldInfo.email).toBe("123@456.com");
    expect(component.oldInfo.phoneNum).toBe("123-456-7890");
    expect(component.oldInfo.password).toBe("*******");
  });
});
