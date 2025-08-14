import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputOtp } from 'primeng/inputotp';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [FormsModule, InputOtp, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  private readonly _authService = inject(AuthService);
  private readonly _toastr = inject(ToastrService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  steps: WritableSignal<number> = signal(1);
  email: WritableSignal<string> = signal('');
  isEmailNotValid: WritableSignal<boolean> = signal(false);
  isOtpNotValid: WritableSignal<boolean> = signal(false);
  otp: WritableSignal<string> = signal('');
  isCalingApi: WritableSignal<boolean> = signal(false);

  comfirmPasswordForm: FormGroup = this._formBuilder.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\W_]).{10,}$'
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [this.passwordMatchValidator] }
  );

  nextStep() {
    this.steps.update((val) => val + 1);
  }

  /**
   * Initiates the process to send an OTP to the user's email.
   * Sets the isCalingApi flag to true while the request is in progress.
   * On successful response, logs the response, sets the isCalingApi flag to false,
   * advances to the next step, and displays a success toast.
   * On error, sets the isCalingApi flag to false.
   */

  sentEmailTogGetOtp() {
    if (
      this.email().includes('@') &&
      this.email().includes('.') &&
      this.email().length > 5
    ) {
      this.isEmailNotValid.set(false);
      this.isCalingApi.set(true);
      this._authService.sendOtp(this.email()).subscribe({
        next: (res) => {
          console.log(res);
          this.isCalingApi.set(false);
          this.nextStep();
          this._toastr.success('Email sent successfully');
        },
        error: (err) => {
          this.isCalingApi.set(false);
        },
      });
    } else {
      this.isEmailNotValid.set(true);
    }
  }

  /**
   * Initiates the process to verify the OTP sent to the user's email.
   * Sets the isCalingApi flag to true while the request is in progress.
   * On successful response, logs the response, sets the isCalingApi flag to false,
   * advances to the next step, and displays a success toast.
   * On error, sets the isCalingApi flag to false.
   */
  sentOtpToVerify() {
    if (this.otp().length === 6) {
      this.isOtpNotValid.set(false);
      this.isCalingApi.set(true);
      this._authService.verifyOtp(this.email(), this.otp()).subscribe({
        next: (res) => {
          console.log(res);
          this.isCalingApi.set(false);
          this.nextStep();
          this._toastr.success('Otp sent successfully');
        },
        error: (err) => {
          this.isCalingApi.set(false);
        },
      });
    } else {
      this.isOtpNotValid.set(true);
    }
  }

  /**
   * Submits the form to reset the password. If the form is valid, it makes a
   * POST request to the server to reset the password. If there is an error, it
   * sets isCalingApi to false. If the request is successful, it shows a success
   * toast and navigates to the login page after 500ms.
   * If the form is invalid, it marks all the fields as touched.
   */
  comfirmPasswordSubmit() {
    if (this.comfirmPasswordForm.valid) {
      this.isCalingApi.set(true);
      let formValue = {
        email: this.email(),
        newPassword: this.comfirmPasswordForm.value.newPassword,
        confirmPassword: this.comfirmPasswordForm.value.confirmPassword,
      };
      console.log(formValue);

      this._authService.resetPssowrdFromOtp(formValue).subscribe({
        next: (res) => {
          console.log(res);
          this._toastr.success('Password reset successfully');
          this.isCalingApi.set(false);
          setTimeout(() => {
            this._router.navigate(['/auth/login']);
          }, 500);
        },
        error: (err) => {
          this.isCalingApi.set(false);
        },
      });
    } else {
      this.comfirmPasswordForm.markAllAsTouched();
    }
  }

  /**
   * Checks if the new password and confirm password match.
   * Returns null if they do and { notMatch: true } if they don't.
   * @param form The AbstractControl for the form containing the new password and confirm password.
   */
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatch: true };
  }
}
