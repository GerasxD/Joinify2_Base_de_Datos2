import { trigger, transition, style, animate, query, group } from '@angular/animations';

/**
 * Archivo con diferentes estilos de animación que puedes usar
 * Solo cambia la importación en app.component.ts para probar diferentes efectos
 */

// Animación simple de fade
export const fadeTransition = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(':leave', [animate('200ms', style({ opacity: 0 }))], { optional: true }),
    query(':enter', [animate('400ms 100ms', style({ opacity: 1 }))], { optional: true })
  ])
]);

// Animación de slide desde la derecha
export const slideRightTransition = trigger('routeAnimations', [
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
    query(':enter', [style({ transform: 'translateX(100%)' })], { optional: true }),
    query(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))], { optional: true }),
    query(':enter', [animate('300ms ease-out', style({ transform: 'translateX(0%)' }))], { optional: true })
  ])
]);

// Animación de escala con fade
export const scaleTransition = trigger('routeAnimations', [
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
    query(':enter', [style({ opacity: 0, transform: 'scale(0.8)' })], { optional: true }),
    query(':leave', [animate('250ms ease-in', style({ opacity: 0, transform: 'scale(1.1)' }))], { optional: true }),
    query(':enter', [animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))], { optional: true })
  ])
]);

// Animación de rotación suave
export const rotateTransition = trigger('routeAnimations', [
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
    query(':enter', [style({ opacity: 0, transform: 'rotateY(90deg)' })], { optional: true }),
    query(':leave', [animate('250ms ease-in', style({ opacity: 0, transform: 'rotateY(-90deg)' }))], { optional: true }),
    query(':enter', [animate('350ms 100ms ease-out', style({ opacity: 1, transform: 'rotateY(0deg)' }))], { optional: true })
  ])
]);

// Animación de flip vertical
export const flipTransition = trigger('routeAnimations', [
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
    query(':enter', [style({ opacity: 0, transform: 'rotateX(90deg)' })], { optional: true }),
    query(':leave', [animate('250ms ease-in', style({ opacity: 0, transform: 'rotateX(-90deg)' }))], { optional: true }),
    query(':enter', [animate('350ms 100ms ease-out', style({ opacity: 1, transform: 'rotateX(0deg)' }))], { optional: true })
  ])
]);

/**
 * INSTRUCCIONES DE USO:
 * 
 * 1. En app.component.ts, cambia la importación:
 *    import { slideInAnimation } from './animations';
 *    por:
 *    import { fadeTransition } from './animation-options';
 * 
 * 2. En el decorador @Component, cambia:
 *    animations: [slideInAnimation]
 *    por:
 *    animations: [fadeTransition]
 * 
 * 3. Puedes probar cualquiera de estas opciones:
 *    - fadeTransition: Fade simple
 *    - slideRightTransition: Slide desde la derecha
 *    - scaleTransition: Efecto de escala
 *    - rotateTransition: Rotación en Y
 *    - flipTransition: Rotación en X (flip vertical)
 */
