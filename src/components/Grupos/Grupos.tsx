import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSBS1, fetchSBS2, fetchSBS3, fetchSBS911 } from '../../redux/slices/gruposSlice';
import GraficoLinea from '../componentes/GraficoLinea';
import Cargador from '../componentes/Cargador';
import './Grupos.css';

export const Grupos: React.FC = () => {
    const dispatch = useDispatch();
    const datosSBS1 = useSelector((state: any) => state.grupos.sbs1);
    const datosSBS2 = useSelector((state: any) => state.grupos.sbs2);
    const datosSBS3 = useSelector((state: any) => state.grupos.sbs3);
    const datosSBS911 = useSelector((state: any) => state.grupos.sbs911);
    const [datosCargados, setDatosCargados] = useState(false);

    useEffect(() => {
        console.log('Componente Grupos montado');
        dispatch(fetchSBS1() as any);
        dispatch(fetchSBS2() as any);
        dispatch(fetchSBS3() as any);
        dispatch(fetchSBS911() as any);

        const intervalo = setInterval(() => {
            dispatch(fetchSBS1() as any);
            dispatch(fetchSBS2() as any);
            dispatch(fetchSBS3() as any);
            dispatch(fetchSBS911() as any);
        }, 10000);

        return () => clearInterval(intervalo);
    }, [dispatch]);

    useEffect(() => {
        console.log('Datos actualizados:', { datosSBS1, datosSBS2, datosSBS3, datosSBS911 });
        if (
            datosSBS1 && datosSBS1.data && datosSBS1.data.length > 0 &&
            datosSBS2 && datosSBS2.data && datosSBS2.data.length > 0 &&
            datosSBS3 && datosSBS3.data && datosSBS3.data.length > 0 &&
            datosSBS911 && datosSBS911.data && datosSBS911.data.length > 0
        ) {
            setDatosCargados(true);
        }
    }, [datosSBS1, datosSBS2, datosSBS3, datosSBS911]);

    return (
        <div className="contenedor-dashboard">
            <h2>Grupos SBS</h2>
            {!datosCargados ? (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100vh',
                    width: '100vw'
                }}>
                    <Cargador />
                </div>
            ) : (
                <div className="contenedor-secciones">
                    <div className="seccion seccion-sbs"> 
                        <h3 style={{ textAlign: 'center' }}>GRUPOS SBS 1</h3>
                        <GraficoLinea datosGrafico={datosSBS1.data} etiquetasSeries={datosSBS1.series} />
                    </div>
                    <div className="seccion seccion-sip-trunk">
                        <h3 style={{ textAlign: 'center' }}>GRUPOS SBS 2</h3>
                        <GraficoLinea datosGrafico={datosSBS2.data} etiquetasSeries={datosSBS2.series} />
                    </div>
                    <div className="seccion seccion-balanceo">
                        <h3 style={{ textAlign: 'center' }}>GRUPOS SBS 3</h3>
                        <GraficoLinea datosGrafico={datosSBS3.data} etiquetasSeries={datosSBS3.series} />
                    </div>
                    <div className="seccion seccion-balanceo">
                        <h3 style={{ textAlign: 'center' }}>GRUPOS SBS 911</h3>
                        <GraficoLinea datosGrafico={datosSBS911.data} etiquetasSeries={datosSBS911.series} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Grupos;