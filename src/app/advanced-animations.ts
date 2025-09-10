import { trigger, transition, style, animate, query, group, stagger, keyframes } from '@angular/animations';

/**
 * ANIMACIONES AVANZADAS Y ESPECTACULARES
 * Efectos más elaborados para transiciones entre páginas
 */

// 1. ANIMACIÓN TIPO CARD FLIP 🃏
export const cardFlipAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', perspective: '1000px' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backfaceVisibility: 'hidden'
      })
    ], { optional: true }),
    query(':leave', [
      animate('400ms ease-in', style({ 
        transform: 'rotateY(-180deg)',
        opacity: 0.3
      }))
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'rotateY(180deg)', opacity: 0 }),
      animate('400ms 200ms ease-out', style({ 
        transform: 'rotateY(0deg)',
        opacity: 1
      }))
    ], { optional: true })
  ])
]);

// 2. ANIMACIÓN TIPO SLIDING DOORS 🚪
export const slidingDoorsAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':leave', [
      animate('350ms ease-in', style({ 
        transform: 'translateX(-50%) scale(0.8)',
        opacity: 0
      }))
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(50%) scale(0.8)', opacity: 0 }),
      animate('400ms 150ms ease-out', style({ 
        transform: 'translateX(0%) scale(1)',
        opacity: 1
      }))
    ], { optional: true })
  ])
]);

// 3. ANIMACIÓN TIPO ZOOM EXPLOSION 💥
export const zoomExplosionAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-in', style({ 
        transform: 'scale(1.2)',
        opacity: 0,
        filter: 'blur(5px)'
      }))
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'scale(0.3)', opacity: 0, filter: 'blur(10px)' }),
      animate('400ms 100ms ease-out', style({ 
        transform: 'scale(1)',
        opacity: 1,
        filter: 'blur(0px)'
      }))
    ], { optional: true })
  ])
]);

// 4. ANIMACIÓN TIPO WAVE 🌊
export const waveAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':leave', [
      animate('400ms ease-in', 
        keyframes([
          style({ transform: 'translateY(0px) rotateX(0deg)', opacity: 1, offset: 0 }),
          style({ transform: 'translateY(-20px) rotateX(20deg)', opacity: 0.7, offset: 0.5 }),
          style({ transform: 'translateY(-100px) rotateX(90deg)', opacity: 0, offset: 1 })
        ])
      )
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateY(100px) rotateX(-90deg)', opacity: 0 }),
      animate('450ms 150ms ease-out',
        keyframes([
          style({ transform: 'translateY(100px) rotateX(-90deg)', opacity: 0, offset: 0 }),
          style({ transform: 'translateY(20px) rotateX(-20deg)', opacity: 0.7, offset: 0.5 }),
          style({ transform: 'translateY(0px) rotateX(0deg)', opacity: 1, offset: 1 })
        ])
      )
    ], { optional: true })
  ])
]);

// 5. ANIMACIÓN TIPO CUBE ROTATION 🎲
export const cubeRotationAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ 
      position: 'relative',
      perspective: '1000px',
      transformStyle: 'preserve-3d'
    }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backfaceVisibility: 'hidden'
      })
    ], { optional: true }),
    query(':leave', [
      animate('500ms ease-in-out', style({ 
        transform: 'rotateY(-90deg) translateZ(-200px)',
        opacity: 0.5
      }))
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'rotateY(90deg) translateZ(-200px)', opacity: 0.5 }),
      animate('500ms ease-in-out', style({ 
        transform: 'rotateY(0deg) translateZ(0px)',
        opacity: 1
      }))
    ], { optional: true })
  ])
]);

// 6. ANIMACIÓN TIPO ELASTIC BOUNCE 🏀
export const elasticBounceAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-in', style({ 
        transform: 'translateY(-50px) scale(0.5)',
        opacity: 0
      }))
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateY(100px) scale(0.3)', opacity: 0 }),
      animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ 
        transform: 'translateY(0px) scale(1)',
        opacity: 1
      }))
    ], { optional: true })
  ])
]);

// 7. ANIMACIÓN TIPO MATRIX DIGITAL 💻
export const matrixAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':leave', [
      animate('350ms ease-in',
        keyframes([
          style({ transform: 'translateX(0px)', filter: 'brightness(1)', opacity: 1, offset: 0 }),
          style({ transform: 'translateX(-20px)', filter: 'brightness(1.5) hue-rotate(90deg)', opacity: 0.8, offset: 0.3 }),
          style({ transform: 'translateX(-100%)', filter: 'brightness(0.5) hue-rotate(180deg)', opacity: 0, offset: 1 })
        ])
      )
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(100%)', filter: 'brightness(2) hue-rotate(270deg)', opacity: 0 }),
      animate('400ms 100ms ease-out',
        keyframes([
          style({ transform: 'translateX(100%)', filter: 'brightness(2) hue-rotate(270deg)', opacity: 0, offset: 0 }),
          style({ transform: 'translateX(20px)', filter: 'brightness(1.5) hue-rotate(90deg)', opacity: 0.8, offset: 0.7 }),
          style({ transform: 'translateX(0px)', filter: 'brightness(1)', opacity: 1, offset: 1 })
        ])
      )
    ], { optional: true })
  ])
]);

/**
 * 🎯 INSTRUCCIONES DE USO:
 * 
 * 1. En app.component.ts, importa la animación que quieras:
 *    import { cardFlipAnimation } from './advanced-animations';
 * 
 * 2. Cambia en el decorador @Component:
 *    animations: [cardFlipAnimation]
 * 
 * 3. ¡Y listo! Tu aplicación usará la nueva animación.
 * 
 * 🌟 RECOMENDACIONES:
 * - cardFlipAnimation: Elegante para aplicaciones empresariales
 * - zoomExplosionAnimation: Dinámico para apps de entretenimiento
 * - waveAnimation: Suave para aplicaciones de diseño
 * - elasticBounceAnimation: Divertido para apps casuales
 * - matrixAnimation: Tech/gaming vibes
 * - cubeRotationAnimation: Profesional con efecto 3D
 */
