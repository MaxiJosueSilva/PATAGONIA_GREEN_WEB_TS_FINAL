import React from 'react';
import styled from '@emotion/styled';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: var(--sidebar-color);
  padding: 20px;
  color: var(--text-color);
`;

const Section = styled.section`
  margin-bottom: 20px;
`;

const Slider = styled.input`
  width: 100%;
  margin: 10px 0;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 5px;
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid #666;
  border-radius: 4px;
`;

function Sidebar({ settings, onSettingsChange }) {
  const handleChange = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <SidebarContainer>
      <h2>Configuración</h2>
      
      <Section>
        <h3>Umbrales de Temperatura</h3>
        <label>
          Temperatura Mínima (°C)
          <Slider
            type="range"
            min="15"
            max="30"
            step="0.5"
            value={settings.tempLow}
            onChange={e => handleChange('tempLow', parseFloat(e.target.value))}
          />
          {settings.tempLow}°C
        </label>
        
        <label>
          Temperatura Máxima (°C)
          <Slider
            type="range"
            min="15"
            max="30"
            step="0.5"
            value={settings.tempHigh}
            onChange={e => handleChange('tempHigh', parseFloat(e.target.value))}
          />
          {settings.tempHigh}°C
        </label>
      </Section>

      <Section>
        <h3>Opciones de Visualización</h3>
        <label>
          <Checkbox
            type="checkbox"
            checked={settings.showHeatMap}
            onChange={e => handleChange('showHeatMap', e.target.checked)}
          />
          Mostrar Mapa de Calor
        </label>
      </Section>

      <Section>
        <h3>Marco Temporal</h3>
        <Select
          value={settings.timeframe}
          onChange={e => handleChange('timeframe', e.target.value)}
        >
          <option value="5min">5 minutos</option>
          <option value="15min">15 minutos</option>
          <option value="30min">30 minutos</option>
          <option value="1hora">1 hora</option>
        </Select>
      </Section>

      <Section>
        <h3>Configuración de Alertas</h3>
        <label>
          <Checkbox
            type="checkbox"
            checked={settings.enableAlerts}
            onChange={e => handleChange('enableAlerts', e.target.checked)}
          />
          Activar Alertas
        </label>
      </Section>
    </SidebarContainer>
  );
}

export default Sidebar;
