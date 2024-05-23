import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { tap, catchError } from "rxjs/operators";

export interface AuthResponseData{
    
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;   
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


@Injectable({providedIn: "root"})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    
  
    constructor(private http: HttpClient) { }
    
    signUp(email:string, password:string) {
     return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCvPT3G0WELhhE1VBcHAkmdiy3CJQ01oXc', {
            email: email,
            password: password,
            returnSecureToken: true
        }
     ).pipe(catchError(this.handleError),
         tap(resData => { this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn )})
     )
    }
    
    private handleAuthentication(email: string, userId: string,  token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
             const user = new User(
                email,
                userId,
                 token,
                 expirationDate);
             this.user.next(user);
    }
    
    login(email: string, password: string) {
       
     return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCvPT3G0WELhhE1VBcHAkmdiy3CJQ01oXc", {
              email: email,
            password: password,
            returnSecureToken: true
     })
         .pipe(catchError(this.handleError),
             tap(resData => {
                 this.handleAuthentication(
                     resData.email,
                     resData.localId,
                       resData.idToken,
                     +resData.expiresIn
                   
                 )
    })
)}
    
    private handleError(errorRes: HttpErrorResponse) {
          let errorMessage = 'An error occured';
         if (!errorRes.error || !errorRes.error.error) { 
             return throwError(errorMessage);
         }
    
        switch (errorRes.error.error.errors[0].message) {
            case "EMAIL_EXISTS":
                errorMessage = 'This email already exists.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.'
                break;
            case 'USER_DISABLED':
                errorMessage = 'The user account has been disabled by an administrator'
                break;
            case 'INVALID_PASSWORD': 
                errorMessage = 'The password is invalid or the user does not have a password.'
        }
         return throwError(errorMessage);
         
    }
}