// See https://kit.svelte.dev/docs/types#app
declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        nombre: string;
        rol: 'Administrador' | 'Director' | 'Auditor' | 'Instructor' | 'Cliente';
        email: string;
      } | null;
    }
    interface PageData {
      user?: App.Locals['user'];
    }
  }
}

export {};
