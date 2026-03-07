import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  // get token from localStorage
  const token = localStorage.getItem('token');

  let modifiedReq = req;

  // attach JWT token
  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        console.error('Unauthorized - please login again');
      }

      if (error.status === 500) {
        console.error('Server error occurred');
      }

      return throwError(() => error);
    })
  );
};