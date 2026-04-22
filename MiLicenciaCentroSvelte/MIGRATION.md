# Documentación de Migración: Angular → Svelte (SvelteKit)

## Proyecto: MiLicenciaCentro

### Resumen

Migración completa del proyecto **MiLicenciaCentro** de **Angular 14** a **SvelteKit** (Svelte 4 + Vite).
El proyecto es una plataforma para la gestión de licencias de conducción en Colombia,
que incluye cotización, compra de PINs, pagos, agendamiento y consultas.

---

## Estructura de Directorios

### Equivalencia de carpetas

| Angular (`src/app/`) | Svelte (`src/`) | Notas |
|---|---|---|
| `enums/` | `lib/enums/` | Sin cambios en estructura |
| `const/` | `lib/const/` | Sin cambios en estructura |
| `interfaces/` | `lib/interfaces/` | Sin cambios en estructura |
| `class/` | `lib/class/` | Sin cambios en estructura |
| `services/` | `lib/services/` | Convertidos a módulos TS/stores |
| `interceptors/` | `lib/services/http.service.ts` | Consolidados en un servicio HTTP |
| `components/common/` | `lib/components/` | Convertidos a componentes `.svelte` |
| `components/pages/` | `routes/` | Usando routing de SvelteKit |
| `modules/` | `routes/` (anidado) | Usando lazy loading de SvelteKit |
| `pipes/` | (funciones TS puras) | No hay concepto de pipes en Svelte |
| `environments/` | `lib/environments/` | Sin cambios en estructura |
| `app-routing.module.ts` | `routes/` (file-based) | Routing basado en archivos de SvelteKit |
| `app.module.ts` | `routes/+layout.svelte` | Layout global de la aplicación |
| `app.component.ts/html` | `routes/+layout.svelte` | Componente raíz |

---

## Cambios Relevantes por Categoría

### 1. Enums

**Sin cambios funcionales.** Los enums de TypeScript se mantienen idénticos.

- Todos los archivos de `src/app/enums/` se migran a `src/lib/enums/`
- Las importaciones usan el alias `$lib` de SvelteKit en vez de paths relativos

```typescript
// Angular
import { TipoDocumento } from 'src/app/enums/TipoDocumento';

// Svelte
import { TipoDocumento } from '$lib/enums/TipoDocumento';
```

### 2. Interfaces (contratos de datos)

**Sin cambios funcionales.** Las interfaces TypeScript se mantienen idénticas.

- Todos los archivos de `src/app/interfaces/` se migran a `src/lib/interfaces/`
- Se usa el alias `$lib` para las importaciones

### 3. Constantes

**Sin cambios funcionales.** Los objetos `CategoriasTexto` y `rutas` se mantienen idénticos.

### 4. Validadores de formulario

**Cambio significativo:** El `FechaValidador` de Angular usaba `ValidatorFn` de `@angular/forms`.
En Svelte no existe el concepto de `FormGroup`, por lo que se convierte a una función pura:

```typescript
// Angular (con FormGroup)
export const FechaValidador: ValidatorFn = (fg: any) => { ... };

// Svelte (función pura - src/lib/const/customValidators/ThreeInputDateValidator.ts)
export function fechaEsValida(dia: number, mes: number, anio: number): boolean { ... }
export function obtenerDiasEnMes(month: number, year: number): number | undefined { ... }
```

### 5. Servicios (Services)

Los servicios de Angular usan inyección de dependencias (`@Injectable`).
En Svelte se convierten a **módulos TypeScript** con funciones exportadas o **stores de Svelte**.

#### LoaderService → `loader.store.ts`

```typescript
// Angular - Subject<boolean> en servicio @Injectable
export class LoaderService {
  isLoading = new Subject<boolean>();
  show() { this.isLoading.next(true); }
  hide() { this.isLoading.next(false); }
}

// Svelte - writable store
export const isLoading = writable<boolean>(false);
export function showLoader(): void { isLoading.set(true); }
export function hideLoader(): void { isLoading.set(false); }
```

#### AuthService → `auth.service.ts`

```typescript
// Angular - HttpClient + localStorage
export class AuthService {
  refreshToken() {
    return this.http.post<AuthResponse>(url, request).pipe(tap(...));
  }
  getJwtToken() { return localStorage.getItem(JWT_TOKEN); }
}

// Svelte - fetch nativo + localStorage
export async function refreshToken(): Promise<AuthResponse> {
  const response = await fetch(url, { method: 'POST', body: JSON.stringify(request) });
  return response.json();
}
export function getJwtToken(): string | null { return localStorage.getItem(JWT_TOKEN); }
```

#### RoutesService → `routes.service.ts`

Misma lógica, convertida a funciones exportadas sin clase.

#### UtilService → `util.service.ts` + stores

- Las funciones de validación se mantienen como funciones puras
- `abrirDialogo()` y `abrirAlerta()` interactúan con Svelte stores en vez de `MatDialog`/`MatSnackBar`

### 6. Interceptores HTTP

**Cambio significativo:** Los tres interceptores de Angular se consolidan en un único servicio `http.service.ts`:

| Angular Interceptor | Función en Svelte |
|---|---|
| `TokenInterceptor` | `buildHeaders()` en `http.service.ts` |
| `LoaderInterceptor` | Conteo de `activeRequests` en `http.service.ts` |
| `AppHttpInterceptor` | Manejo de errores en `catch` de `http.service.ts` |

```typescript
// Uso en componentes Svelte
import { httpGet, httpPost } from '$lib/services/http.service';

// GET tipado
const data = await httpGet<MiInterface>('https://api.example.com/endpoint');

// POST tipado  
const result = await httpPost<ResponseType>('https://api.example.com/endpoint', payload);
```

### 7. Componentes UI

Los componentes de Angular Material se reemplazan con componentes Svelte con CSS puro:

| Angular (Material) | Svelte | Diferencias |
|---|---|---|
| `LoaderComponent` + `MatProgressBar` | `Loader.svelte` | CSS animation en vez de Material |
| `DialogoSimpleComponent` + `MatDialog` | `DialogoSimple.svelte` + `dialog.store.ts` | Store reactivo |
| `NavigationComponent` + `MatSidenav` | `Navigation.svelte` | Estado local con `let` reactivo |
| `FooterComponent` | `Footer.svelte` | Equivalente directo |
| `FieldErrorComponent` | `FieldError.svelte` | Equivalente directo |
| `MatSnackBar` | `Alert.svelte` + `alert.store.ts` | Store reactivo |

### 8. Sistema de Routing

**Cambio significativo:** Angular usa routing declarativo con `RouterModule`.
SvelteKit usa routing **basado en sistema de archivos**.

```
# Angular (app-routing.module.ts + módulos lazy)
{ path: '', loadChildren: () => import('./modules/public/principal/principal.module').then(...) }
{ path: '**', loadChildren: () => import('./modules/error/error.module').then(...) }

# SvelteKit (estructura de archivos)
src/routes/
├── +layout.svelte      # Equivalente al AppComponent con <router-outlet>
├── +page.svelte        # Ruta raíz '/'
├── +error.svelte       # Manejador global de errores (404, 500, etc.)
└── error/
    └── +page.svelte    # Página de error /error
```

### 9. Módulo de la App

**Angular** tiene un `AppModule` centralizado que declara todos los componentes,
importa los módulos de Angular Material, configura interceptores y proveedores.

**SvelteKit** no tiene un archivo de módulo central. En cambio:
- Los componentes globales (Loader, Navigation, Footer) se importan en `+layout.svelte`
- Los interceptores se reemplazan con el servicio HTTP unificado
- Los providers se reemplazan con módulos/stores importados directamente

### 10. Gestión de Estado

**Angular** usa `BehaviorSubject`/`Subject` de RxJS para estado reactivo.
**Svelte** usa stores nativos (`writable`, `readable`, `derived`).

| Angular (RxJS) | Svelte |
|---|---|
| `BehaviorSubject<T>` | `writable<T>(initialValue)` |
| `Subject<T>` | `writable<T>(null)` o eventos |
| `.subscribe()` | `$store` (auto-suscripción) |
| `.next(value)` | `store.set(value)` / `store.update(fn)` |
| `.pipe(map(...))` | `derived(store, fn)` |

### 11. Google Analytics

En Angular, el tracking de GA se hace en el `AppComponent` suscribiéndose a eventos del Router.
En SvelteKit, se puede usar la función `afterNavigate` en el layout:

```typescript
// src/routes/+layout.svelte
import { afterNavigate } from '$app/navigation';
afterNavigate(({ to }) => {
  if (typeof gtag !== 'undefined') {
    gtag('set', 'page_path', to?.url.pathname);
    gtag('event', 'page_view');
  }
});
```

### 12. Service Worker / PWA

Angular tenía `@angular/service-worker` configurado con `ngsw-config.json`.
En SvelteKit se puede usar [`@vite-pwa/sveltekit`](https://vite-pwa-org.netlify.app/frameworks/sveltekit) para funcionalidad equivalente.

### 13. Pipes de Angular

Los pipes de Angular no tienen equivalente directo en Svelte.
Se convierten a **funciones TypeScript puras** importadas en los componentes:

| Angular Pipe | Equivalente Svelte |
|---|---|
| `enum-to-arr` | Función `enumToArray()` en utils |
| `image-src` | Interpolación directa `src="/assets/..."` |
| `time` | Función `formatTime()` en utils |

### 14. Formularios Reactivos

Angular usa `ReactiveFormsModule` con `FormGroup`, `FormControl`, `Validators`.
En Svelte, los formularios se manejan con:
- Variables reactivas (`let value = ''`)
- Binding bidireccional (`bind:value`)
- Validación manual o librerías como [`felte`](https://felte.dev/) o [`svelte-forms-lib`](https://svelte-forms-lib.netlify.app/)

---

## Dependencias: Angular vs Svelte

| Angular | Svelte equivalente |
|---|---|
| `@angular/core`, `@angular/common` | SvelteKit (incluido) |
| `@angular/forms` | Binding nativo + validación manual |
| `@angular/router` | SvelteKit file-based routing |
| `@angular/material` | CSS puro + componentes Svelte |
| `@angular/cdk` | CSS puro |
| `@angular/service-worker` | `@vite-pwa/sveltekit` |
| `angular-ng-autocomplete` | Componente nativo |
| `apollo-angular` | `@apollo/client` (sin wrapper Angular) |
| `ng-recaptcha` | API nativa de reCAPTCHA |
| `rxjs` | Stores de Svelte + Promises |
| `zone.js` | No necesario en Svelte |
| `crypto-js` | `crypto-js` (sin cambios) |
| `moment` | `Intl.DateTimeFormat` nativo o `date-fns` |

---

## Consideraciones de Seguridad

### ⚠️ Credenciales en código

Los archivos `environment.ts` y `environment.prod.ts` del proyecto Angular original
contienen credenciales (UserName/UserPassword para auth). En SvelteKit, estas deben
moverse a variables de entorno del servidor:

```typescript
// ❌ No hacer en SvelteKit (se expone al cliente)
export const environment = {
  apiAuth: { UserName: '...', UserPassword: '...' }
};

// ✅ Correcto en SvelteKit (solo accesible en servidor)
// src/lib/server/auth.server.ts
import { API_AUTH_USER, API_AUTH_PASSWORD } from '$env/static/private';
```

### Token JWT en localStorage

El token JWT se almacena en `localStorage`. Se mantiene el mismo comportamiento que en Angular.
Para mayor seguridad en producción, considerar `httpOnly cookies` gestionadas desde el servidor.

---

## Estado de Migración

| Módulo | Estado | Notas |
|---|---|---|
| Enums (todos) | ✅ Completo | Sin cambios funcionales |
| Interfaces principales | ✅ Completo | auth, compraPin, cotizacion |
| Constantes | ✅ Completo | CategoriasTexto, rutas |
| Validadores | ✅ Completo | Adaptado a funciones puras |
| LoaderService | ✅ Completo | → `loader.store.ts` |
| AuthService | ✅ Completo | → `auth.service.ts` |
| EncryptService | ✅ Completo | → `encrypt.service.ts` |
| RoutesService | ✅ Completo | → `routes.service.ts` |
| UtilService | ✅ Completo | → `util.service.ts` |
| HTTP Interceptors (3) | ✅ Completo | → `http.service.ts` |
| TipoDocumentoPtesaClass | ✅ Completo | Sin cambios funcionales |
| LoaderComponent | ✅ Completo | → `Loader.svelte` (DaisyUI spinner) |
| DialogoSimpleComponent | ✅ Completo | → `DialogoSimple.svelte` (DaisyUI modal) |
| NavigationComponent | ✅ Completo | Integrado en `+layout.svelte` (DaisyUI navbar) |
| FooterComponent | ✅ Completo | Integrado en `+layout.svelte` |
| FieldErrorComponent | ✅ Completo | → `FieldError.svelte` (DaisyUI/Tailwind) |
| InicioCentroComponent | ✅ Completo | → `routes/+page.svelte` (DaisyUI) |
| ErrorComponent | ✅ Completo | → `routes/+error.svelte` (DaisyUI) |
| AppComponent | ✅ Completo | → `routes/+layout.svelte` (DaisyUI navbar+footer) |
| Módulo Anulación | ✅ Completo | → `routes/anulacion/` (BFF) |
| Módulo CambioBeneficiario | ✅ Completo | → `routes/cambio-beneficiario/` (BFF) |
| Módulo Consulta | ✅ Completo | → `routes/consulta/` (BFF) |
| Módulo Consulta Devolución | ✅ Completo | → `routes/consulta-devolucion/` (BFF) |
| Módulo Resumen | ✅ Completo | → `routes/resumen/` |
| Búsqueda Centros | ✅ Completo | → `routes/sdc/busqueda-centros/` |
| Listado Centros | ✅ Completo | → `routes/centros/` |
| Página 403 | ✅ Completo | → `routes/403/` |
| API BFF Centros | ✅ Completo | → `routes/api/centros/` |
| RBAC hooks.server.ts | ✅ Completo | Guardas de ruta por roles |
| Tailwind CSS + DaisyUI | ✅ Completo | Tema personalizado `milicencia` |
| Módulo Cotizador | 🔄 Estructura | Requiere implementación de páginas |
| Módulo CompraPin | 🔄 Estructura | Requiere implementación de páginas |
| Google Analytics | 🔄 Parcial | Requiere `afterNavigate` en layout |
| Service Worker/PWA | ⏳ Pendiente | Requiere `@vite-pwa/sveltekit` |
| reCAPTCHA v3 | ⏳ Pendiente | Requiere integración con API nativa |
| GraphQL | ⏳ Pendiente | Requiere `@apollo/client` sin wrapper |

---

## Integración Tailwind CSS + DaisyUI

### Configuración

El proyecto usa Tailwind CSS v3 con DaisyUI v4. La configuración se encuentra en:

- `tailwind.config.js` — tema personalizado `milicencia` con colores de marca
- `postcss.config.js` — integración PostCSS
- `src/app.css` — directivas `@tailwind base/components/utilities`

### Tema personalizado `milicencia`

```js
// tailwind.config.js
milicencia: {
  "primary": "#1565c0",    // Azul principal
  "secondary": "#0d47a1",  // Azul oscuro
  "accent": "#f57c00",     // Naranja
  "neutral": "#374151",    // Gris oscuro (footer)
  ...
}
```

### Uso del tema

El tema se activa con `data-theme="milicencia"` en el div raíz de `+layout.svelte`.

---

## Patrón BFF (Backend For Frontend)

Las páginas que necesitan datos del servidor usan el patrón BFF con `+page.server.ts`:

```
routes/
├── +layout.server.ts     # Pasa user a todas las páginas
├── +page.server.ts       # Datos de la home
├── consulta/
│   └── +page.server.ts   # Form actions para consulta de PIN
├── anulacion/
│   └── +page.server.ts   # Form actions para anulación
└── api/
    └── centros/
        └── +server.ts    # Proxy BFF → API externa
```

Los form actions de SvelteKit reemplazan los servicios Angular que hacían POST directamente desde el cliente.

---

## RBAC con hooks.server.ts

El archivo `src/hooks.server.ts` implementa guardas de ruta por rol:

```typescript
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['Administrador', 'Director'],
  '/admin/reportes': ['Administrador', 'Director', 'Auditor'],
  '/admin/operaciones': ['Administrador', 'Instructor'],
};
```

La sesión se lee de una cookie `session` (Base64 JSON) y se adjunta a `event.locals.user`.

---

## Cómo Ejecutar el Proyecto Svelte

```bash
# Instalar dependencias
cd MiLicenciaCentroSvelte
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview

# Verificar TypeScript
npm run check
```

---

## Referencias

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte Stores](https://svelte.dev/docs/svelte-store)
- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
- [Migrando de Angular a Svelte](https://kit.svelte.dev/docs/migrating)
