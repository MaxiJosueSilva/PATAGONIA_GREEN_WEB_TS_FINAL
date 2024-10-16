import React, { useMemo } from 'react';

interface AlertBannerProps {
  camaras: any[];
}

const AlertBanner: React.FC<AlertBannerProps> = ({ camaras }) => {
  const alerts = useMemo(() => {
    return camaras.filter(camara => {
      const temp = parseInt(camara.onu?.system?.temps?.cpu || '0');
      const rx = parseFloat(camara.onu?.optics?.rx_power_onu || '0');
      return temp > 70 || rx < -28 || camara.onu?.online === 'false';
    });
  }, [camaras]);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-500 text-white p-2 text-center">
      <p>¡Alerta! {alerts.length} cámara(s) requieren atención.</p>
    </div>
  );
};

export default AlertBanner;