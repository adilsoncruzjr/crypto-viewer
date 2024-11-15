import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cryptoService: CryptoService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.cryptoService.loginUser(email, password).subscribe(
        (response) => {
          // Armazenar o token de acesso no serviço e localStorage
          this.cryptoService.setToken(response.token);

          // Armazenar os dados do usuário (caso precise)
          this.cryptoService.setUser(response.user);

          // Redirecionar para a página da carteira
          this.router.navigate(['/wallet']);
        },
        (error) => {
          console.error('Erro no login:', error);
          alert('Credenciais inválidas');
        }
      );
    }
  }

  onCancel() {
    this.loginForm.reset();  // Reseta o formulário
    this.router.navigate(['/']);  // Redireciona para a página inicial
  }
}
