import { TestBed } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'getToken').and.returnValue('fake-token');

    const interceptor = TestBed.inject(AuthInterceptor);

    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.has('Authorization')).toBe(true);
        expect(req.headers.get('Authorization')).toBe('Bearer fake-token');
        return {
          subscribe: () => {},
        } as any;
      },
    };

    interceptor.intercept(httpRequest, httpHandler);
  });
});
