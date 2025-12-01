import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('passwordHide', [
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      transition('visible => hidden', [
        animate('0.2s ease-out')
      ]),
      transition('hidden => visible', [
        animate('0.2s ease-in')
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  passwordLength = 0;
  isTyping = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loginForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordLength = value?.length || 0;
      this.isTyping = value?.length > 0;
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordInput(event: any) {
    const value = event.target.value;
    this.passwordLength = value.length;
    this.isTyping = value.length > 0;
  }

  getPasswordDots(): number[] {
    return Array(this.passwordLength).fill(0);
  }

  async login() {
    if (this.loginForm.valid) {
      // Simulación de login - aquí iría la lógica real
      console.log('Login:', this.loginForm.value);
      this.router.navigate(['/globe']);
    }
  }
}

