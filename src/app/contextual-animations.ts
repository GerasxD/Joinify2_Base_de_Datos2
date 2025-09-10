import { trigger, transition, style, animate, query, group } from '@angular/animations';

/**
 * ANIMACIONES CONTEXTUALES
 * Diferentes animaciones según el tipo de navegación
 */

// 🏠 Para páginas principales (Home, About, Features, Contact)
export const mainPagesAnimation = trigger('routeAnimations', [
  // Navegación entre páginas principales
  transition('home => about', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':enter', [style({ transform: 'translateX(100%)', opacity: 0 })], { optional: true }),
    query(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-30%)', opacity: 0.3 }))], { optional: true }),
    query(':enter', [animate('400ms 100ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))], { optional: true })
  ]),
  
  transition('about => features', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':enter', [style({ transform: 'scale(0.8)', opacity: 0 })], { optional: true }),
    query(':leave', [animate('250ms ease-in', style({ transform: 'scale(1.1)', opacity: 0 }))], { optional: true }),
    query(':enter', [animate('350ms 100ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))], { optional: true })
  ]),

  // Animación por defecto para otras transiciones
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(':leave', [animate('200ms', style({ opacity: 0 }))], { optional: true }),
    query(':enter', [animate('300ms 100ms', style({ opacity: 1 }))], { optional: true })
  ])
]);

// 🔐 Para páginas de autenticación (Login, Register)
export const authPagesAnimation = trigger('routeAnimations', [
  transition('login <=> register', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':enter', [style({ transform: 'rotateY(90deg)', opacity: 0 })], { optional: true }),
    query(':leave', [animate('300ms ease-in', style({ transform: 'rotateY(-90deg)', opacity: 0 }))], { optional: true }),
    query(':enter', [animate('400ms 150ms ease-out', style({ transform: 'rotateY(0deg)', opacity: 1 }))], { optional: true })
  ]),
  
  // Otras transiciones más suaves
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0, transform: 'translateY(30px)' })], { optional: true }),
    query(':leave', [animate('200ms', style({ opacity: 0, transform: 'translateY(-30px)' }))], { optional: true }),
    query(':enter', [animate('300ms 100ms', style({ opacity: 1, transform: 'translateY(0px)' }))], { optional: true })
  ])
]);

// 👥 Para páginas de grupos (crear-grupo, mis-grupos, unir-grupo)
export const groupPagesAnimation = trigger('routeAnimations', [
  transition('crear-grupo => mis-grupos', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':enter', [style({ transform: 'translateX(-100%) scale(0.9)', opacity: 0 })], { optional: true }),
    query(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%) scale(0.9)', opacity: 0 }))], { optional: true }),
    query(':enter', [animate('400ms 100ms ease-out', style({ transform: 'translateX(0%) scale(1)', opacity: 1 }))], { optional: true })
  ]),

  transition('mis-grupos => unir-grupo', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':enter', [style({ transform: 'rotateX(90deg)', opacity: 0 })], { optional: true }),
    query(':leave', [animate('250ms ease-in', style({ transform: 'rotateX(-45deg)', opacity: 0 }))], { optional: true }),
    query(':enter', [animate('350ms 100ms ease-out', style({ transform: 'rotateX(0deg)', opacity: 1 }))], { optional: true })
  ]),

  // Animación por defecto para páginas de grupos
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0, transform: 'scale(0.9)' })], { optional: true }),
    query(':leave', [animate('200ms', style({ opacity: 0, transform: 'scale(1.1)' }))], { optional: true }),
    query(':enter', [animate('300ms 100ms', style({ opacity: 1, transform: 'scale(1)' }))], { optional: true })
  ])
]);

/**
 * 🎨 ANIMACIONES TEMÁTICAS PARA JOINIFY
 * Animaciones personalizadas que van con tu tema
 */

// Animación con tema de streaming/entretenimiento
export const streamingThemeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':leave', [
      animate('350ms ease-in', style({ 
        transform: 'translateX(-50%) rotateZ(-5deg)',
        opacity: 0,
        filter: 'brightness(0.5) saturate(2)'
      }))
    ], { optional: true }),
    query(':enter', [
      style({ 
        transform: 'translateX(50%) rotateZ(5deg)',
        opacity: 0,
        filter: 'brightness(2) saturate(0.5)'
      }),
      animate('400ms 150ms ease-out', style({ 
        transform: 'translateX(0%) rotateZ(0deg)',
        opacity: 1,
        filter: 'brightness(1) saturate(1)'
      }))
    ], { optional: true })
  ])
]);

// Animación con gradientes (similar a tu diseño)
export const gradientThemeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-in', style({ 
        transform: 'translateY(-100px) scale(0.8)',
        opacity: 0,
        filter: 'hue-rotate(180deg)'
      }))
    ], { optional: true }),
    query(':enter', [
      style({ 
        transform: 'translateY(100px) scale(0.8)',
        opacity: 0,
        filter: 'hue-rotate(-180deg)'
      }),
      animate('400ms 100ms ease-out', style({ 
        transform: 'translateY(0px) scale(1)',
        opacity: 1,
        filter: 'hue-rotate(0deg)'
      }))
    ], { optional: true })
  ])
]);

/**
 * 📱 CÓMO CAMBIAR DE ANIMACIÓN:
 * 
 * En app.component.ts, cambia la importación:
 * 
 * // Para todas las páginas principales
 * import { mainPagesAnimation } from './contextual-animations';
 * 
 * // Para tema de streaming
 * import { streamingThemeAnimation } from './contextual-animations';
 * 
 * // Para tema con gradientes
 * import { gradientThemeAnimation } from './contextual-animations';
 * 
 * Luego en animations: [nombreDeLaAnimacion]
 */
