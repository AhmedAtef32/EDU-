import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const errInterceptor: HttpInterceptorFn = (req, next) => {
  const _toastr: ToastrService = inject(ToastrService);
  const _authService: AuthService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      _toastr.error(err.error.errors.Error[0], 'Error');
      if (err.status === 401) {
        _authService.reFreshToken().subscribe({
          next: (res) => {
            localStorage.setItem('refreshToken', res.refreshToken);
            _authService.accessToken.set(res.accessToken);
            if (localStorage.getItem('accessToken')) {
              localStorage.setItem('accessToken', res.accessToken);
            }
          },
        });
      }

      return throwError(() => err);
    })
  );
};
