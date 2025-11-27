import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { mockState, escalasDeNotas } from '../../data/mockData';
import { Usuario } from '../../types';
import { TPInfoModal } from './header/TPInfoModal';
import { MembersModal } from './header/MembersModal';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditMembersModalOpen, setIsEditMembersModalOpen] = useState(false);
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

  // Get group members objects
  const integrantesObjects = entregaActual?.integrantes
    .map(id => usuarios.find(u => u.idUsuario === id))
    .filter((u): u is Usuario => !!u) || [];

  // Get group members names from current delivery
  const groupMembers = integrantesObjects
    .map(u => `${u.nombre} ${u.apellido}`)
    .join(', ');

  const escala = escalasDeNotas.find(e => e.idEscala === mockState.tpConfiguracion.idEscala);
  
  const primeraEntrega = React.useMemo(() => {
    if (!entregaActual?.versiones.length) return null;
    return [...entregaActual.versiones].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )[0];
  }, [entregaActual]);

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
          <button 
            className={styles.infoButton} 
            onClick={() => setIsInfoModalOpen(true)}
            aria-label="Ver información del TP"
          >
            <Info size={20} />
          </button>
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

      <TPInfoModal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        tpConfig={mockState.tpConfiguracion}
        escalaNombre={escala?.nombre || 'No definida'}
        groupMembers={groupMembers}
        primeraEntrega={primeraEntrega}
        onOpenEditMembers={() => setIsEditMembersModalOpen(true)}
      />

      <MembersModal 
        isOpen={isEditMembersModalOpen}
        onClose={() => setIsEditMembersModalOpen(false)}
        integrantes={integrantesObjects}
      />
    </header>
  );
};

