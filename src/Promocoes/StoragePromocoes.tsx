/**
 * Salva qualquer dado no LocalStorage convertendo para JSON.
 */
export function savePromocoes<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`[Storage] Erro ao salvar chave "${key}":`, error);
  }
}

/**
 * Recupera dados do LocalStorage. 
 * Retorna o valor tipado ou null se não existir/estiver corrompido.
 */
export function getPromocoes<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) return null;

    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`[Storage] Erro ao ler chave "${key}":`, error);
    return null;
  }
}

/**
 * Remove uma chave específica (Útil para limpar cache ou deletar tudo).
 */
export function removePromocoes(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Erro ao remover chave "${key}":`, error);
  }
}

/**
 * Limpa todo o LocalStorage (Cuidado: remove tokens e autenticação também).
 */
export function clearStorage(): void {
  localStorage.clear();
}