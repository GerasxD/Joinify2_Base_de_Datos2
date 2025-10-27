import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CreaciongrupoComponent } from './creaciongrupo.component';

describe('CreaciongrupoComponent', () => {
  let component: CreaciongrupoComponent;
  let fixture: ComponentFixture<CreaciongrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreaciongrupoComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaciongrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
