import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth/auth.service';
import e from 'express';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _toaster = inject(ToastrService);
  private readonly _router = inject(Router);
  isCalingApi: WritableSignal<boolean> = signal(false);
  @ViewChild('rememberMeInput') rememberMeInput!: ElementRef<HTMLInputElement>;

  loginForm: FormGroup = this._formBuilder.group({
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

  loginFormSubmit() {
    if (this.loginForm.valid) {
      this.isCalingApi.set(true);

      this._authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isCalingApi.set(false);
          this._authService.accessToken.set(res.accessToken);
          console.log(res);
          localStorage.setItem('refreshToken', res.refreshToken);
          if (this.rememberMeInput.nativeElement.checked) {
            localStorage.setItem('accessToken', res.accessToken);
          }
          this._toaster.success('Login Successfully');
          setTimeout(() => {
            this._router.navigate(['/home']);
          }, 500);
        },
        error: (err) => {
          this.isCalingApi.set(false);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
