import React from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { mockState } from '../../data/mockData';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { 
    indiceUsuarioActual, 
    usuarios, 
    siguienteUsuario, 
    usuarioAnterior, 
  } = useAppStore(
    useShallow((state) => ({
      indiceUsuarioActual: state.indiceUsuarioActual,
      usuarios: state.usuarios,
      siguienteUsuario: state.siguienteUsuario,
      usuarioAnterior: state.usuarioAnterior,
    }))
  );

  const hasPrev = indiceUsuarioActual > 0;
  const hasNext = indiceUsuarioActual < usuarios.length - 1;

  // Get group members names from mock data
  const groupMembers = mockState.entrega1.integrantes
    .map(id => mockState.usuarios.find(u => u.idUsuario === id))
    .filter(Boolean)
    .map(u => `${u?.nombre} ${u?.apellido}`)
    .join(', ');

  return (
    <header className={styles.header}>
      <Button 
        onClick={usuarioAnterior}
        disabled={!hasPrev}
        icon={<ChevronLeft size={16} />}
      >
        Anterior
      </Button>

      <div className={styles.headerContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{mockState.tpConfiguracion.alias}</h1>
          <Info size={20} className={styles.infoIcon} />
        </div>
        <p className={styles.subtitle}>
          <span className={styles.subtitleLabel}>
            Entrega {mockState.tpConfiguracion.esGrupal ? 'grupal' : 'individual'}:
          </span> {groupMembers || 'Sin alumnos'}
        </p>
      </div>

      <Button 
        onClick={siguienteUsuario}
        disabled={!hasNext}
      >
        Siguiente
        <ChevronRight size={16} />
      </Button>
    </header>
  );
};
