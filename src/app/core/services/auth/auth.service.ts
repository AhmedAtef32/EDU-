import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Environment } from '../../environments/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  accessToken: WritableSignal<string> = signal('');

  /**
   * Sends a POST request to the server to register a user.
   * @param Data an object with the user's registration data.
   * @returns an Observable of the response from the server.
   */
  register(Data: object): Observable<any> {
    return this._http.post(`${Environment.baseUrl}/Register`, Data);
  }

  /**
   * Sends a POST request to the server to log in a user.
   * @param Data an object with the user's login data.
   * @returns an Observable of the response from the server.
   */
  login(Data: object): Observable<any> {
    return this._http.post(`${Environment.baseUrl}/Login`, Data);
  }

  /**
   * Sends a POST request to the server to send an OTP to the user's email.
   * @param email The user's email address to which the OTP will be sent.
   * @returns An Observable of the response from the server.
   */

  sendOtp(email: string): Observable<any> {
    return this._http.post(`${Environment.baseUrl}/send-Otp/${email}`, {
      email: email,
    });
  }

  /**
   * Sends a POST request to the server to verify the OTP sent to the user's email.
   * @param email The user's email address to which the OTP was sent.
   * @param otpNumber The OTP number received by the user.
   * @returns An Observable of the response from the server.
   */
  verifyOtp(email: string, otpNumber: string): Observable<any> {
    return this._http.post(`${Environment.baseUrl}/verify-OTP`, {
      email: email,
      otp: otpNumber,
    });
  }

  /**
   * Sends a POST request to the server to reset the user's password using OTP.
   * @param data An object containing the necessary information for password reset.
   * @returns An Observable of the response from the server.
   */

  resetPssowrdFromOtp(data: object): Observable<any> {
    return this._http.post(`${Environment.baseUrl}/Reset-Password`, data);
  }


  /**
   * Sends a POST request to the server to confirm the user's email.
   * @param data An object containing the necessary information for email confirmation.
   * @returns An Observable of the response from the server.
   */
  comfirmEmail(data: object): Observable<any> {
    return this._http.post(`${Environment.baseUrl}/Confirm-Email`, data);
  }

  /**
   * Sends a POST request to the server to refresh the user's access token.
   * @returns An Observable of the response from the server.
   */
  reFreshToken(): Observable<any> {
    return this._http.post(`${Environment.baseUrl}/RefreshToken`, {
      RefreshToken: localStorage.getItem('refreshToken')!,
    });
  }
}
