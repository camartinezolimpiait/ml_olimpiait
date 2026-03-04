import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { ConfigService } from "../config/config.service";

@Injectable({
    providedIn: 'root'
})
export class EncryptService {

    constructor(private readonly configService:ConfigService){}
    encryptUsingAES256(request: string): string {
        return this.#encryptUsingAES256Hided(request);
    }

    decryptUsingAES256(ciphertext: string): string {
        return this.#decryptUsingAES256Hided(ciphertext);
    }
    #encryptUsingAES256Hided(request: string): string {
        return (CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(request), CryptoJS.enc.Utf8.parse(this.configService.getDeofuscatedDato1()),
        {
            keySize: 128 / 8,
            iv: CryptoJS.enc.Utf8.parse(this.configService.getDeofuscatedDato2()),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })).toString();
    }
    #decryptUsingAES256Hided(ciphertext: string): string {
        return (CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(this.configService.getDeofuscatedDato1()),
        {
            keySize: 128 / 8,
            iv: CryptoJS.enc.Utf8.parse(this.configService.getDeofuscatedDato2()),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })).toString(CryptoJS.enc.Utf8);
    }
}