import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avaliacoes } from './avaliacoes';

describe('Avaliacoes', () => {
  let component: Avaliacoes;
  let fixture: ComponentFixture<Avaliacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avaliacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avaliacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
