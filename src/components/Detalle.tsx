import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavegadorContext } from './NavegadorContext';
import { fetchCamaraById } from '../redux/slices/camarasSlice';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../redux/store';

const StyledDetalle = styled.div`
  width: 100%;
  height: 100%;
  max-height: 180px;
  overflow: auto;
`;

const Detalle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { camaraSeleccionada } = useContext(NavegadorContext);
  const { camara, status } = useSelector((state: RootState) => ({
    camara: state.camaras.camara,
    status: state.camaras.status === 'succeeded',
  }));

  useEffect(() => {
    const fetchCamara = async () => {
      if (camaraSeleccionada) {
        await dispatch(fetchCamaraById(camaraSeleccionada));
      }
    };

    fetchCamara();
  }, [dispatch, camaraSeleccionada]);

  const cam = camara || {};

  return (
    <StyledDetalle>
      {camara && (
        <div>
          <h1 className="text-lg font-semibold">{cam.name}</h1>
          <p><strong>Sector:</strong> {cam.sector}</p>
          {cam.nombre && <p><strong>Nombre:</strong> {cam.nombre}</p>}
          <p><strong>IP:</strong> {cam.ip}</p>
          <p><strong>Tipo:</strong> {cam.tipo}</p>
          <p><strong>Cantidad:</strong> {cam.cantidad}</p>
          <p><strong>Descripción:</strong> {cam.descripcion}</p>
          <p><strong>Layer:</strong> {cam.layer}</p>
          <p><strong>ONU:</strong> {cam.onu}</p>
        </div>
      )}
    </StyledDetalle>
  );
}

export default Detalle;