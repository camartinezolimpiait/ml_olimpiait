/**
 * Validador de fecha con tres campos separados (día/mes/año).
 * Migrado desde Angular: src/app/const/customValidators/ThreeInputDateValidator.ts
 *
 * En Svelte no hay FormGroup de Angular, por lo que este validador
 * es una función pura que acepta los valores directamente.
 */

/**
 * Devuelve la cantidad de días en un mes dado, considerando años bisiestos.
 */
export function obtenerDiasEnMes(month: number, year: number): number | undefined {
  if (month < 1 || month > 12) return undefined;
  const mesesCon31 = [1, 3, 5, 7, 8, 10, 12];
  if (mesesCon31.includes(month)) return 31;
  if (month === 2) {
    const esBisiesto = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return esBisiesto ? 29 : 28;
  }
  return 30;
}

/**
 * Valida que el día sea válido para el mes y año dados.
 * @returns true si la fecha es válida, false si no lo es
 */
export function fechaEsValida(dia: number, mes: number, anio: number): boolean {
  if (!dia || !mes || !anio) return false;
  const diasEnMes = obtenerDiasEnMes(mes, anio);
  return diasEnMes !== undefined && dia >= 1 && dia <= diasEnMes;
}
