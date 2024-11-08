import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import SystemGauge from './SystemGauge';
import MetricsChart from './MetricsChart';
// import AlertSystem from './AlertSystem';
import 'react-grid-layout/css/styles.css';
import {fetchCpu } from '../../../redux/slices/utilsSlice';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: 'cpu', x: 0, y: 0, w: 6, h: 4 },
    { i: 'memory', x: 6, y: 0, w: 3, h: 4 },
    { i: 'disk', x: 9, y: 0, w: 3, h: 4 },
    { i: 'uptime', x: 0, y: 4, w: 12, h: 2 },
    { i: 'cpuChart', x: 0, y: 6, w: 6, h: 4 },
    { i: 'memoryChart', x: 6, y: 6, w: 6, h: 4 }
  ]
};

export function Dashboard() {
  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem('dashboardLayouts');
    return saved ? JSON.parse(saved) : defaultLayouts;
  });
  
  const dispatch = useDispatch();
  const metrics = useSelector(state => state.utils.cpu);
  const [latestMetrics, setLatestMetrics] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCpu());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (metrics) {
      setLatestMetrics(metrics[metrics.length - 1]); // Actualiza latestMetrics cuando metrics cambia
    }
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('dashboardLayouts', JSON.stringify(layouts));
  }, [layouts]);
  
  const onLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
  };

  
  if (!metrics) {
    console.log("Cargando métricas...");
    return <div className="loading">Cargando métricas...</div>;
  }
  return (
    <div className="dashboard">
      <header>
        <h1>System Metrics Dashboard</h1>
        <div className="system-info">
          <div>{latestMetrics?.os.hostname}</div>
          <div>{`${latestMetrics?.os.type} ${latestMetrics?.os.release} (${latestMetrics?.os.arch})`}</div>
        </div>
      </header>
      
      {/* <AlertSystem alerts={latestMetrics} /> */}
      
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isDraggable
        isResizable
      >
        <div className="cpu-gauges">
          {[1, 2, 3, 4].map(core => {
            const coreValue = parseFloat(latestMetrics?.[`cpu${core}`]) || 0;
            return (
              <SystemGauge
                key={core}
                value={coreValue}
                label={`Core ${core}`}
              />
            );
          })}
        </div>
        
        <div key="memory" className="metric-card">
          <h3><i className="fas fa-memory"></i> Memory Usage</h3>
          <SystemGauge value={parseFloat(latestMetrics?.memoria)} label="memory" />
          <div className="metric-details">
            <div className="value">{latestMetrics?.memoria}%</div>
            <div className="stats">Used: {(parseFloat(latestMetrics?.memoria) * 16 / 100).toFixed(1)} GB / 16 GB</div>
          </div>
        </div>
        
        <div key="disk" className="metric-card">
          <h3><i className="fas fa-hdd"></i> Disk Usage</h3>
          <SystemGauge value={parseFloat(latestMetrics?.disco)} label="disck" />
          <div className="metric-details">
            <div className="value">{latestMetrics?.disco}%</div>
            <div className="stats">Used: {(parseFloat(latestMetrics?.disco) * 500 / 100).toFixed(1)} GB / 500 GB</div>
          </div>
        </div>
        
        <div key="uptime" className="metric-card">
          <h3><i className="fas fa-clock"></i> System Uptime</h3>
          <div className="uptime">{metrics?.tiempo}</div>
        </div>
        
        <div key="cpuChart" className="metric-card">
          <h3><i className="fas fa-chart-line"></i> CPU History</h3>
          <MetricsChart type="cpu" value={metrics} />
        </div>
        
        <div key="memoryChart" className="metric-card">
          <h3><i className="fas fa-chart-line"></i> Memory History</h3>
          <MetricsChart type="memoria"  value={metrics}/>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
