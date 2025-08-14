import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmEmailComponent } from './comfirm-email.component';

describe('ComfirmEmailComponent', () => {
  let component: ComfirmEmailComponent;
  let fixture: ComponentFixture<ComfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComfirmEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
