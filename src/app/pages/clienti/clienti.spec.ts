import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientiComponent } from './clienti';

describe('ClientiComponent', () => {
  let component: ClientiComponent;
  let fixture: ComponentFixture<ClientiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientiComponent],    
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
