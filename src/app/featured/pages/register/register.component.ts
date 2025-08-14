import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly _authService = inject(AuthService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _toaster = inject(ToastrService);
  private readonly _router = inject(Router);
  isCalingApi: WritableSignal<boolean> = signal(false);

  registerForm: FormGroup = this._formBuilder.group({
    userName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9_]*$'),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_]).{10,}$'
        ),
      ],
    ],
  });

  registerFormSubmit() {
    if (this.registerForm.valid) {
      this.isCalingApi.set(true);
      console.log(this.registerForm.value);
      this._authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.isCalingApi.set(false);
          this._toaster.success('Register Successfully');
          setTimeout(() => {
            this._router.navigate(['/auth/confirmEmail']);
          }, 500);
        },error: (err) => {
          this.isCalingApi.set(false);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
