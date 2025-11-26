import React from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { mockState } from '../../data/mockData';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { 
    indiceEntregaActual, 
    entregas, 
    usuarios,
    siguienteEntrega, 
    entregaAnterior, 
  } = useAppStore(
    useShallow((state) => ({
      indiceEntregaActual: state.indiceEntregaActual,
      entregas: state.entregas,
      usuarios: state.usuarios,
      siguienteEntrega: state.siguienteEntrega,
      entregaAnterior: state.entregaAnterior,
    }))
  );

  const hasPrev = indiceEntregaActual > 0;
  const hasNext = indiceEntregaActual < entregas.length - 1;

  const entregaActual = entregas[indiceEntregaActual];

  // Get group members names from current delivery
  const groupMembers = entregaActual?.integrantes
    .map(id => usuarios.find(u => u.idUsuario === id))
    .filter(Boolean)
    .map(u => `${u?.nombre} ${u?.apellido}`)
    .join(', ');

  return (
    <header className={styles.header}>
      <Button 
        onClick={entregaAnterior}
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
        onClick={siguienteEntrega}
        disabled={!hasNext}
      >
        Siguiente
        <ChevronRight size={16} />
      </Button>
    </header>
  );
};
