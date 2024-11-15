import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoService } from '../crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cryptoService: CryptoService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('password_confirmation');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsDontMatch: true };
    }
    return null;
  }

  checkEmailExists(email: string): void {
    this.cryptoService.checkEmail(email).subscribe(
      response => {
      },
      error => {
        if (error.status === 409) {
          this.errorMessage = 'Este e-mail já está em uso.';
        } else {
          this.errorMessage = 'Ocorreu um erro ao verificar o e-mail.';
        }
      }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      this.checkEmailExists(formData.email);

      if (!this.errorMessage) {
        this.cryptoService.registerUser(
          formData.name,
          formData.email,
          formData.password,
          formData.password_confirmation
        ).subscribe(
          response => {
            console.log('Usuário registrado com sucesso', response);
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Erro no registro', error);
            alert('Ocorreu um erro ao registrar o usuário.');
          }
        );
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  onCancel() {
    this.registerForm.reset();
    this.router.navigate(['/']);
  }

}