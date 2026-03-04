export interface RespuestaRecaptcha<T> {
    ok: boolean,
    mensaje: string,
    data: T[]
  }