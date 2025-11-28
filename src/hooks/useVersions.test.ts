import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useVersions } from './useVersions';
import { Entrega } from '../types';

const mockEntrega: Entrega = {
  idEntregaTP: 1,
  integrantes: [1, 2],
  versiones: [
    { idVersionEntregaTP: 1, idEntregaTP: 1, fecha: '2024-01-01', idUsuario: 1, texto: 'Version 1', adjuntos: [] },
    { idVersionEntregaTP: 2, idEntregaTP: 1, fecha: '2024-01-02', idUsuario: 2, texto: 'Version 2', adjuntos: [] },
  ],
};

describe('useVersions', () => {
  it('should return the latest version by default', () => {
    const { result } = renderHook(() => useVersions(mockEntrega));
    expect(result.current.versionsToShow).toHaveLength(1);
    expect(result.current.versionsToShow[0].idVersionEntregaTP).toBe(2);
  });

  it('should show all versions when history is toggled', () => {
    const { result } = renderHook(() => useVersions(mockEntrega));
    act(() => {
      result.current.toggleHistory();
    });
    expect(result.current.showHistory).toBe(true);
    expect(result.current.versionsToShow).toHaveLength(2);
  });
});