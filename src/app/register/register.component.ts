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

  constructor(
    private fb: FormBuilder, 
    private cryptoService: CryptoService,
    private router: Router // Injetando o Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required], // 'name' no backend espera o nome completo
      email: ['', [Validators.required, Validators.email]], // Email deve ser válido
      password: ['', [Validators.required, Validators.minLength(6)]], // Senha com mínimo de 6 caracteres
      passwordConfirmation: ['', Validators.required] // Confirmação de senha
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      // Verificar se as senhas coincidem
      if (formData.password !== formData.passwordConfirmation) {
        alert('As senhas não coincidem!');
        return;
      }

      // Chama o método registerUser do CryptoService para enviar os dados ao backend
      this.cryptoService.registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordConfirmation
      ).subscribe(
        response => {
          console.log('Usuário registrado com sucesso', response);
          alert('Registro realizado com sucesso!');
          
          // Redireciona para o componente de Wallet após o registro
          this.router.navigate(['/wallet']); // Navega para a página '/wallet'
        },
        error => {
          console.error('Erro no registro', error);
          alert('Ocorreu um erro ao registrar o usuário.');
        }
      );
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  onCancel() {
    this.registerForm.reset(); // Limpa o formulário ao cancelar
  }

}
