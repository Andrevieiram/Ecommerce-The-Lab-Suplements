// src/utils/storage.ts

/**
 * Salva um valor no localStorage, convertendo-o para JSON.
 */
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
}

/**
 * Lê um valor do localStorage e o converte de volta do JSON.
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error("Erro ao ler do localStorage:", error);
    return null;
  }
}