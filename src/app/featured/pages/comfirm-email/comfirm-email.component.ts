import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { InputOtp } from 'primeng/inputotp';

@Component({
  selector: 'app-comfirm-email',
  imports: [FormsModule, ReactiveFormsModule,InputOtp],
  templateUrl: './comfirm-email.component.html',
  styleUrl: './comfirm-email.component.css'
})
export class ComfirmEmailComponent {
  private readonly _authService = inject(AuthService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _toaster = inject(ToastrService);
  private readonly _router = inject(Router);
  isCalingApi: WritableSignal<boolean> = signal(false);
  otpNumber !: string


  comfirmEmailForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    otp: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),],
    ],
  });

  comfirmEmailFormSubmit() {
    if (this.comfirmEmailForm.valid) {
      this.isCalingApi.set(true);
      const data = this.comfirmEmailForm.value;
      this._authService.comfirmEmail(data).subscribe({
        next: (res) => {
          this.isCalingApi.set(false);
          this._toaster.success(res.message);
          setTimeout(() => {
             this._router.navigate(['/auth/login']);
          }, 500);
        },
        error: (err) => {
          this.isCalingApi.set(false);
        },
      });
    }else{
      this.comfirmEmailForm.markAllAsTouched();
    }
  }
}
