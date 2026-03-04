
# GitHub Copilot - Instrucciones y Reglas de Uso

Este archivo define las reglas y recomendaciones para el uso de GitHub Copilot en toda la solución.

## Alcance

Estas reglas aplican para todos los proyectos y archivos dentro de la solución.

# Instrucciones para MiLicenciaCentro

## Arquitectura General

- **Framework:** Angular 14 (TypeScript), RxJS, Apollo GraphQL, Angular Material.
- **Estructura Principal:** Toda la lógica central está en `src/app/`. Límites principales:
	- **Ruteo:** Definido en `app-routing.module.ts`, usa prefijos dinámicos desde environment y módulos cargados de forma perezosa (`modules/public/principal`, `modules/error`).
	- **Módulos:** Los módulos de funcionalidad están en `modules/`, el código compartido en `modules/compartidos`.
	- **Componentes:** UI dividida en `components/common` (compartidos) y `components/pages` (específicos).
	- **Servicios:** Lógica de negocio y utilidades en `services/`.
	- **Constantes/Enums:** Centralizados en `const/` y `enums/`.
	- **Interfaces:** Modelos de datos en `interfaces/`.

## Flujo de Datos e Integración

- **Endpoints API:** Gestionados vía archivos de entorno (`src/environments/`). Usar `environment.serverUrl` y `const/rutas.ts` para URLs de servicios.
- **GraphQL:** Configuración de Apollo client en `graphql.module.ts`.
- **Navegación:** Usa Angular Router, con rutas que referencian variables de entorno y constantes.
- **SEO y Diálogos:** Patrones comunes vía `UtilService` (`services/util/util.service.ts`), incluyendo metadatos SEO y manejo de diálogos.

## Flujos de Trabajo para Desarrolladores

- **Instalar dependencias:** `npm install` en `MiLicenciaCentro/`.
- **Servidor de desarrollo:** `ng serve --port 4290` (puerto personalizado).
- **Build:** `ng build` (artifacts en `dist/mi-licencia-centro`).
- **Test:** `ng test` (Karma).
- **Scaffolding:** Usar Angular CLI (`ng generate component|service|module ...`), estilos por defecto SCSS.

## Convenciones Específicas del Proyecto

- **Nombres de archivos:** kebab-case para archivos, PascalCase para clases/tipos.
- **Código compartido:** Ubicar en `components/common` o `modules/compartidos`.
- **Ruteo:** Actualizar siempre `app-routing.module.ts` para nuevas features.
- **Ambientes:** Usar `environment.ts` y `environment.prod.ts` para configuración; el build reemplaza archivos según `angular.json`.
- **URLs de API:** Referenciar siempre `const/rutas.ts` para endpoints, nunca strings hardcodeadas.

## Reglas Generales

1. **Propósito**: Utilizar Copilot para acelerar el desarrollo, sugerir código y mejorar la productividad.
2. **Revisión de Código**: Todo el código generado por Copilot debe ser revisado manualmente antes de integrarse al proyecto.
3. **Licencias y Copyright**: Verificar que las sugerencias de Copilot no incluyan código con licencias incompatibles o contenido protegido por derechos de autor.
4. **Buenas Prácticas**: Priorizar las mejores prácticas de desarrollo en .NET 9 y mantener la calidad del código.
5. **Seguridad**: Validar que el código sugerido no introduzca vulnerabilidades de seguridad.
6. **Documentación**: Documentar adecuadamente el código generado por Copilot, especialmente si se trata de lógica compleja o funciones críticas.
7. **Identificación de Métodos Generados**: Todo método generado por GitHub Copilot debe incluir un comentario al inicio que indique claramente que fue generado por Copilot. Ejemplo: `// Método generado por GitHub Copilot`
8. **Marcado de Fragmentos de Código**: Cuando se genere un fragmento de código con GitHub Copilot, se debe indicar el inicio y el fin del fragmento con comentarios claros, por ejemplo:
	 // Inicio código generado por GitHub Copilot
	 ...código...
	 // Fin código generado por GitHub Copilot
9. **Notación Pascal para Métodos**: Todo nombre de método generado por GitHub Copilot debe estar en notación Pascal (la primera letra de cada palabra en mayúscula, sin guiones bajos).
10. **Documentación de Refactorizaciones y Optimizaciones**: Toda refactorización u optimización de código realizada por medio de GitHub Copilot debe incluir un comentario al inicio y al final del bloque indicando que fue realizada por Copilot. Ejemplo:
	 // Inicio refactorización/optimización por GitHub Copilot
	 ...código refactorizado...
	 // Fin refactorización/optimización por GitHub Copilot

## Configuración Recomendada

- Mantener Copilot actualizado a la última versión.
- Configurar Copilot para sugerencias contextuales y relevantes al stack .NET 9.
- Desactivar sugerencias automáticas en archivos sensibles o de configuración.

## Ejemplo de Uso Responsable

- Usar Copilot para generar funciones repetitivas, plantillas de clases, y ejemplos de pruebas unitarias.
- Evitar aceptar sugerencias sin comprender su funcionamiento.

---

## Patrones y Ejemplos

- **Lazy Loading:** Todas las rutas principales usan módulos cargados perezosamente.
- **Diálogo/Alerta:** Usar `UtilService.abrirDialogo()` y `abrirAlerta()` para feedback al usuario.
- **SEO:** Definir metadatos de página vía `UtilService.seo`.
- **Navegación:** Usar `NavigationComponent` para lógica de menú, referenciando constantes de `rutas`.

## Dependencias Externas

- **Angular Material:** Componentes UI.
- **Apollo Angular:** Integración GraphQL.
- **FontAwesome:** Iconos.
- **Moment.js:** Manejo de fechas.
- **ng-recaptcha:** Google reCAPTCHA.

## Comandos Útiles

- `ng generate component <nombre>`: Crear nuevo componente (SCSS por defecto).
- `ng generate service <nombre>`: Crear nuevo servicio.
- `ng build`: Compilar proyecto.
- `ng test`: Ejecutar pruebas unitarias.
- `ng serve --port 4290`: Servidor de desarrollo en puerto personalizado.

## Recursos Adicionales

- [Documentación Angular CLI](https://angular.io/cli)
- [Guía de estilos Angular](https://angular.io/guide/styleguide)
- [Documentación RxJS](https://rxjs.dev/)
- [Apollo Angular](https://www.apollographql.com/docs/angular/)

---

*Edita este archivo para agregar reglas o recomendaciones específicas según las necesidades del equipo o del proyecto.*
