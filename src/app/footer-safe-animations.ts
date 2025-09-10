import { trigger, transition, style, animate, query } from '@angular/animations';

/**
 * 🔒 ANIMACIONES SIN POSITION ABSOLUTE
 * Estas animaciones NO mueven el footer porque mantienen el flujo del documento
 */

// ✅ FADE SIN PROBLEMAS DE LAYOUT
export const footerSafeFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.95)' }),
      animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ], { optional: true })
  ])
]);

// ✅ SLIDE VERTICAL SIN POSITION ABSOLUTE  
export const footerSafeSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(30px)' }),
      animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ 
        opacity: 1, 
        transform: 'translateY(0)' 
      }))
    ], { optional: true })
  ])
]);

// ✅ SCALE ZOOM SIN PROBLEMAS
export const footerSafeScaleAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ 
        opacity: 0, 
        transform: 'scale(0.8) rotateX(15deg)' 
      }),
      animate('350ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ 
        opacity: 1, 
        transform: 'scale(1) rotateX(0deg)' 
      }))
    ], { optional: true })
  ])
]);

// ✅ ROTACIÓN SUAVE SIN ABSOLUTE
export const footerSafeRotateAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ 
        opacity: 0, 
        transform: 'perspective(600px) rotateY(35deg)' 
      }),
      animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ 
        opacity: 1, 
        transform: 'perspective(600px) rotateY(0deg)' 
      }))
    ], { optional: true })
  ])
]);

// ✅ EFECTO MATRIZ TECH SIN PROBLEMAS
export const footerSafeMatrixAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ 
        opacity: 0, 
        transform: 'translateX(20px)',
        filter: 'brightness(1.5) hue-rotate(90deg) blur(1px)'
      }),
      animate('250ms ease-out', style({ 
        opacity: 1, 
        transform: 'translateX(0px)',
        filter: 'brightness(1) hue-rotate(0deg) blur(0px)'
      }))
    ], { optional: true })
  ])
]);

// ✅ SLIDE HORIZONTAL SIN ABSOLUTE (RECOMENDADO PARA JOINIFY)
export const footerSafeHorizontalSlide = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ 
        opacity: 0, 
        transform: 'translateX(50px) scale(0.95)' 
      }),
      animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ 
        opacity: 1, 
        transform: 'translateX(0px) scale(1)' 
      }))
    ], { optional: true })
  ])
]);

// ✅ EFECTO STREAMING THEME SIN PROBLEMAS
export const footerSafeStreamingAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'translateY(40px) scale(0.9)',
        filter: 'brightness(1.2) saturate(1.3)'
      }),
      animate('350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ 
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
        filter: 'brightness(1) saturate(1)'
      }))
    ], { optional: true })
  ])
]);

// ✅ COMBINACIÓN PREMIUM (La más elegante)
export const footerSafePremiumAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'translateY(30px) scale(0.92) perspective(800px) rotateX(10deg)',
        filter: 'blur(2px)'
      }),
      animate('400ms cubic-bezier(0.23, 1, 0.32, 1)', style({ 
        opacity: 1,
        transform: 'translateY(0px) scale(1) perspective(800px) rotateX(0deg)',
        filter: 'blur(0px)'
      }))
    ], { optional: true })
  ])
]);

/**
 * 🎯 RECOMENDACIONES PARA JOINIFY:
 * 
 * 🥇 footerSafeStreamingAnimation - Perfecto para tu app de streaming
 * 🥈 footerSafePremiumAnimation - Súper elegante con múltiples efectos  
 * 🥉 footerSafeHorizontalSlide - Simple y profesional
 * 
 * 💡 TODAS estas animaciones mantienen el footer en su lugar correcto!
 */

/**
 * 🔧 INSTRUCCIONES DE USO:
 * 
 * En app.component.ts, cambia por cualquiera de estas:
 * 
 * import { footerSafeStreamingAnimation } from './footer-safe-animations';
 * animations: [footerSafeStreamingAnimation]
 */
