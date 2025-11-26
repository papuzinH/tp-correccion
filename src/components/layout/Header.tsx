import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Calendar, FileText, ExternalLink } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { mockState, escalasDeNotas } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
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

      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
        <div className={styles.modalSection}>
          <h2 className={styles.modalTitle}>Información del Trabajo Práctico:</h2>
          
          <div className={styles.modalRow}>
            <span className={styles.modalLabel}>Título:</span>
            <span className={styles.modalValue}>{mockState.tpConfiguracion.alias}</span>
          </div>

          <div className={styles.modalRow}>
            <Calendar size={18} className="text-gray-500 mt-0.5" />
            <span className={styles.modalLabel}>Vigencia:</span>
            <span className={styles.modalValue}>
              {formatDate(mockState.tpConfiguracion.fechaInicio)} a {formatDate(mockState.tpConfiguracion.fechaVencimiento)}
            </span>
          </div>

          <div className={styles.modalRow}>
            <FileText size={18} className="text-gray-500 mt-0.5" />
            <span className={styles.modalLabel}>Escala de notas:</span>
            <span className={styles.modalValue}>{escala?.nombre || 'No definida'}</span>
          </div>

          <button className={styles.consignaButton}>
            <ExternalLink size={16} />
            Abrir consigna TP
          </button>
        </div>

        <div className={styles.modalSection}>
          <h2 className={styles.modalTitle}>Información de la entrega:</h2>
          
          <div className={styles.modalRow}>
            <span className={styles.modalLabel}>Entrega {mockState.tpConfiguracion.esGrupal ? 'grupal' : 'individual'}:</span>
            <span className={styles.modalValue}>{groupMembers || 'Sin integrantes'}</span>
          </div>

          {primeraEntrega && (
            <div className={styles.modalRow}>
              <span className={styles.modalLabel}>Primera entrega:</span>
              <span className={styles.modalValue}>
                📅 {formatDate(primeraEntrega.fecha)}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </header>
  );
};
