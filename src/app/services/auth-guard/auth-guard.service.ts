import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ApiServicesService } from '../api-services/api-services.service';

@Injectable()
export class AuthGuardService {

  constructor(
    public auth: ApiServicesService,
    public router: Router
  ) { }

  canActivate(): boolean {

    // check if user has already logged in
    if (this.auth.access_token) {
        return true;
    }
    else {
      this.router.navigate(['/sign-in']);
      return false;
    }

}

}
