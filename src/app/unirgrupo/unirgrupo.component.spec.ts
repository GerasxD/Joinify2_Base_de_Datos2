import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UnirGrupoComponent } from './unirgrupo.component';

describe('UnirgrupoComponent', () => {
  let component: UnirGrupoComponent;
  let fixture: ComponentFixture<UnirGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UnirGrupoComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnirGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
