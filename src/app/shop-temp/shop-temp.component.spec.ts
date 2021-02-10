import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopTempComponent } from './shop-temp.component';

describe('ShopTempComponent', () => {
  let component: ShopTempComponent;
  let fixture: ComponentFixture<ShopTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
