import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MProductComponent } from './m-product.component';

describe('MProductComponent', () => {
  let component: MProductComponent;
  let fixture: ComponentFixture<MProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
