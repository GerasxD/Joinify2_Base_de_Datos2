import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
// import { slideInAnimation } from './animations';
// import { matrixAnimation } from './advanced-animations';
// import { cardFlipAnimation } from './advanced-animations';
// import { rotateTransition } from './animation-options';
import { footerSafeStreamingAnimation } from './footer-safe-animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [footerSafeStreamingAnimation]
})
export class AppComponent {
  title = 'suscComp';

  constructor(private contexts: ChildrenOutletContexts) {}

  // Método para obtener la animación basada en la ruta
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
