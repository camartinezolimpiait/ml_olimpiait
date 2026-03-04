import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { AuthRequest } from "src/app/interfaces/auth/AuthRequest";
import { AuthResponse } from "src/app/interfaces/auth/AuthResponse";
import { environment } from "src/environments/environment";
import { getApiMilicencia } from 'src/app/services/util/api-milicencia.util';
import { EncryptService } from "../encrypt/encrypt.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    urlServices: string = getApiMilicencia() + "/servicios/global/";
    private readonly JWT_TOKEN = '_access';

    constructor(private readonly http: HttpClient,
        private readonly _encryptService: EncryptService) {}

    refreshToken() {
        let request: AuthRequest = { key: this._encryptService.encryptUsingAES256(JSON.stringify(
            {
                UserName: environment.apiAuth.UserName,
                UserPassword: environment.apiAuth.UserPassword,
                Key: Date.now()
            }
        ))};
        return this.http.post<AuthResponse>(this.urlServices + "Autenticate", request).pipe(tap((tokens: AuthResponse) => {
            this.storeJwtToken(tokens.tokenBearer);
        }));
    }

    getJwtToken(): any {
        return localStorage.getItem(this.JWT_TOKEN);
    }

    private storeJwtToken(jwt: string) {
        localStorage.setItem(this.JWT_TOKEN, jwt);
    }
}
