import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layouts/auth/auth.component').then((c) => c.AuthComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./featured/pages/login/login.component').then(
            (c) => c.LoginComponent
          ),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./featured/pages/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        title: 'Register',
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import(
            './featured/pages/forget-password/forget-password.component'
          ).then((c) => c.ForgetPasswordComponent),
        title: 'Forget Password',
      },
      {
        path: 'confirmEmail',
        loadComponent: () =>
          import('./featured/pages/comfirm-email/comfirm-email.component').then(
            (c) => c.ComfirmEmailComponent
          ),
        title: 'Confirm Email',
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./featured/pages/home/home.component').then(
        (c) => c.HomeComponent
      ),
    title: 'Home',
  },
];
