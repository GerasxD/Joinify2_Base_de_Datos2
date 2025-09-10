import { trigger, state, style, transition, animate, query, group } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  // Transición de fade con slide
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
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(100%)' })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0%)' }))
    ], { optional: true })
  ]),

  // Transiciones específicas para mejorar la experiencia
  transition('home => about', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(50px)' })
    ], { optional: true }),
    query(':leave', [
      animate('250ms ease-in', style({ opacity: 0, transform: 'translateY(-50px)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms 150ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
    ], { optional: true })
  ]),

  transition('about => home', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-50px)' })
    ], { optional: true }),
    query(':leave', [
      animate('250ms ease-in', style({ opacity: 0, transform: 'translateY(50px)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms 150ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
    ], { optional: true })
  ])
]);

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      animate('200ms', style({ opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms 100ms', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);

export const scaleAnimation = trigger('scaleAnimation', [
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
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.8)' })
    ], { optional: true }),
    query(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'scale(1.1)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ], { optional: true })
  ])
]);
