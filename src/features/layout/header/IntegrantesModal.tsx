import { useState, useEffect } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Usuario } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import styles from './IntegrantesModal.module.css';

interface IntegrantesModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrantes: Usuario[];
  onSave: (integrantes: Usuario[]) => void;
}

export const IntegrantesModal = ({ isOpen, onClose, integrantes, onSave }: IntegrantesModalProps) => {
  const allUsuarios = useAppStore(state => state.usuarios);
  const [tempIntegrantes, setTempIntegrantes] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTempIntegrantes(integrantes);
      setSearchTerm('');
    }
  }, [isOpen, integrantes]);

  const handleRemove = (idUsuario: number) => {
    setTempIntegrantes(prev => prev.filter(u => u.idUsuario !== idUsuario));
  };

  const handleAdd = (usuario: Usuario) => {
    if (!tempIntegrantes.some(u => u.idUsuario === usuario.idUsuario)) {
      setTempIntegrantes(prev => [...prev, usuario]);
    }
    setSearchTerm('');
  };

  const filteredUsers = allUsuarios.filter(u =>
    !tempIntegrantes.some(t => t.idUsuario === u.idUsuario) &&
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccept = () => {
    onSave(tempIntegrantes);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <h2 className={styles.modalTitle}>¿Quiénes participan de esta entrega?</h2>
      <div className={styles.chipsContainer}>
        {tempIntegrantes.map(integrante => (
          <div key={integrante.idUsuario} className={styles.chip}>
            <span className={styles.chipName}>{integrante.nombre} {integrante.apellido}</span>
            <button className={styles.removeButton} onClick={() => handleRemove(integrante.idUsuario)}>×</button>
          </div>
        ))}
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar estudiante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && filteredUsers.length > 0 && (
          <ul className={styles.suggestions}>
            {filteredUsers.map(user => (
              <li key={user.idUsuario} className={styles.suggestionItem} onClick={() => handleAdd(user)}>
                {user.nombre} {user.apellido}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.buttonsContainer}>
        <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
        <Button variant="primary" onClick={handleAccept}>Aceptar</Button>
      </div>
    </Modal>
  );
};
