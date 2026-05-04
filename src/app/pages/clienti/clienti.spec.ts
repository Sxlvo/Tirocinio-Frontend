import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ClientiComponent } from './clienti';
import { ApiService } from '../../api';

describe('ClientiComponent', () => {
  let component: ClientiComponent;
  let fixture: ComponentFixture<ClientiComponent>;
  const apiMock = {
    getClientiByAgente: vi.fn(() => of({ value: [] })),
  };

  beforeEach(async () => {
    apiMock.getClientiByAgente.mockClear();
    localStorage.setItem('agentCode', 'AG001');

    await TestBed.configureTestingModule({
      imports: [ClientiComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(apiMock.getClientiByAgente).toHaveBeenCalledWith('AG001');
  });
});
