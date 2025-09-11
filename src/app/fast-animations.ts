import { trigger, transition, style, animate, query, group } from '@angular/animations';

/**
 * 🚀 ANIMACIONES ULTRA RÁPIDAS Y OPTIMIZADAS
 * Estas animaciones están diseñadas para ser instantáneas y super fluidas
 */

// ⚡ CARD FLIP ULTRA RÁPIDO
export const fastCardFlipAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', perspective: '800px' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backfaceVisibility: 'hidden',
        willChange: 'transform' // Optimización para GPU
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ 
          transform: 'rotateY(-180deg)',
          opacity: 0
        }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'rotateY(180deg)', opacity: 0 }),
        animate('200ms 50ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ 
          transform: 'rotateY(0deg)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ])
]);

// ⚡ SLIDE ULTRA RÁPIDO
export const fastSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        willChange: 'transform' // Optimización
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('150ms cubic-bezier(0.4, 0.0, 1, 1)', style({ 
          transform: 'translateX(-100%)',
          opacity: 0.7
        }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('200ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ 
          transform: 'translateX(0%)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ])
]);

// ⚡ FADE INSTANTÁNEO
export const instantFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({ willChange: 'opacity' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('100ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('150ms 50ms ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

// ⚡ SCALE ZOOM RÁPIDO
export const fastScaleAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        willChange: 'transform, opacity'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('120ms cubic-bezier(0.4, 0.0, 1, 1)', style({ 
          transform: 'scale(0.8)',
          opacity: 0
        }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'scale(1.1)', opacity: 0 }),
        animate('180ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ 
          transform: 'scale(1)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ])
]);

// ⚡ SLIDE VERTICAL SÚPER RÁPIDO
export const fastVerticalSlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        willChange: 'transform'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('130ms ease-in', style({ 
          transform: 'translateY(-30px)',
          opacity: 0
        }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('170ms ease-out', style({ 
          transform: 'translateY(0px)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ])
]);

// ⚡ MATRIX RÁPIDO (Efecto tech instantáneo)
export const fastMatrixAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        willChange: 'transform, filter'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('100ms ease-in', style({ 
          transform: 'translateX(-20px)',
          filter: 'brightness(0.3)',
          opacity: 0
        }))
      ], { optional: true }),
      query(':enter', [
        style({ 
          transform: 'translateX(20px)', 
          filter: 'brightness(1.5) hue-rotate(90deg)', 
          opacity: 0 
        }),
        animate('150ms ease-out', style({ 
          transform: 'translateX(0px)',
          filter: 'brightness(1)',
          opacity: 1
        }))
      ], { optional: true })
    ])
  ])
]);

/**
 * 🎯 ANIMACIONES ESPECÍFICAS PARA JOINIFY (ULTRA OPTIMIZADAS)
 */

// ⚡ TEMA STREAMING OPTIMIZADO
export const optimizedStreamingAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        willChange: 'transform, opacity, filter'
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('120ms cubic-bezier(0.55, 0.085, 0.68, 0.53)', style({ 
          transform: 'translateX(-30%) scale(0.9)',
          opacity: 0,
          filter: 'brightness(0.7)'
        }))
      ], { optional: true }),
      query(':enter', [
        style({ 
          transform: 'translateX(30%) scale(0.9)',
          opacity: 0,
          filter: 'brightness(1.3)'
        }),
        animate('160ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ 
          transform: 'translateX(0%) scale(1)',
          opacity: 1,
          filter: 'brightness(1)'
        }))
      ], { optional: true })
    ])
  ])
]);

/**
 * 🔥 LA MÁS RÁPIDA DE TODAS - MODO PERFORMANCE
 */
export const lightningFastAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    group([
      query(':leave', [
        animate('80ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('120ms ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

/**
 * 💡 CONSEJOS DE USO:
 * 
 * 🏆 MÁS RÁPIDAS:
 * - lightningFastAnimation (80-120ms total)
 * - instantFadeAnimation (100-200ms total)
 * - fastVerticalSlideAnimation (130-170ms total)
 * 
 * 🎨 RÁPIDAS Y BONITAS:
 * - optimizedStreamingAnimation (120-160ms)
 * - fastCardFlipAnimation (200-250ms)
 * - fastScaleAnimation (120-180ms)
 */
