import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { fetch_Cliente_Onus } from '../../redux/slices/oltSlice';
import { RootState, AppDispatch } from '../../redux/store';
import MapLegend from './MapLegend';
import CameraArc from './CameraArc';
import DashboardStats from '../Dashboard/DashboardStats';
import AlertBanner from '../UI/AlertBanner';
import ONUData from '../ONUData';
import Video from '../Video';
import HistorialCamaraChart from '../HistorialCamaraChart';
import MarkerClusterGroup from 'react-leaflet-cluster';
import HeatmapLayer from './HeatmapLayer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaInfoCircle } from 'react-icons/fa';
import './InteractiveMap.css';

// Importar los datos estáticos de las fibras
import { FO96h, FO24h, FO12h } from './fibra_optica.js';

interface Camara {
  idCamara?: string;
  idComisaria?: string;
  idCliente?: string;
  idPredio?: string;
  lat: number;
  lon: number;
  icon: string;
  name: string;
  tipo: string;
  sector: string;
  ip: string;
  capa: string;
  onu?: {
    connection_time?: string;
    system?: {
      temps?: {
        cpu?: string;
      };
    };
    optics?: {
      rx_power_onu?: string;
    };
  };
  energia?: boolean;
  iconColor?: string;
}

const InteractiveMap: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [visualization, setVisualization] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<Camara | null>(null);
  const [mapType, setMapType] = useState("street");
  const [filterType, setFilterType] = useState<string>('');
  const [filterCapa, setFilterCapa] = useState<string>('');
  const staticCamaras = useSelector((state: RootState) => state.olt.onus as Camara[]);
  const status = useSelector((state: RootState) => state.olt.status);
  const error = useSelector((state: RootState) => state.olt.error);
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef<any>(null);
  const [showFibra96h, setShowFibra96h] = useState(true);
  const [showFibra24h, setShowFibra24h] = useState(true);
  const [showFibra12h, setShowFibra12h] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showMarkerCluster, setShowMarkerCluster] = useState(false);

  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    return null;
  };

  const getMapUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setSelectedCamera(null);
    }, 20000);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTermStr = searchTerm.toString().toLowerCase();
    const foundCamera = filteredCamaras.find(
      (camera) => {
        if (camera.name) {
          const cameraName = camera.name.toString().toLowerCase();
          return cameraName.includes(searchTermStr);
        }
        return false;
      }
    );

    if (foundCamera && foundCamera.lat !== undefined && foundCamera.lon !== undefined) {
      if (mapRef.current) {
        mapRef.current.setView([foundCamera.lat, foundCamera.lon], 18);
        setSelectedCamera(foundCamera);
      }
    } else {
      alert('Cámara no encontrada o sin coordenadas válidas');
    }
  };

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetch_Cliente_Onus());
    };

    fetchData();
    const intervalo = setInterval(fetchData, 30000);
    return () => {
      clearInterval(intervalo);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedCamera) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [selectedCamera]);

  const handleCameraClick = (camera: Camara) => {
    setSelectedCamera(camera);
    startTimer();
  };

  const handlePanelInteraction = () => {
    startTimer();
  };

  const getMarkerIcon = (icon: string, color: string) => {
    return L.divIcon({
      className: 'custom-icon',
      html: `<i class="fas ${icon}" style="color: ${color};"></i>`,
      iconSize: [32, 32],
    });
  };

  const getMarkerColor = (camara: Camara) => {
    if (visualization === 'temp_cpu') {
      const temp = parseInt(camara.onu?.system?.temps?.cpu || '0');
      if (temp > 70) return 'red';
      if (temp > 50) return 'yellow';
      return 'green';
    }
    if (visualization === 'rx') {
      const rx = parseFloat(camara.onu?.optics?.rx_power_onu?.replace('dBm', '') || '0');
      if (rx < -28) return 'red';
      if (rx < -25) return 'yellow';
      return 'green';
    }
    if (visualization === 'energia') {
      return camara.energia ? 'green' : 'red';
    }
    if (visualization === 'reinicio') {
      const tiempoConexion = parseInt(camara.onu?.connection_time || '0');
      if (tiempoConexion < 3600) return 'red';
      if (tiempoConexion < 86400) return 'yellow';
      return 'green';
    }
    return camara.iconColor || 'blue';
  };

  const getHeatmapPoints = () => {
    try {
      return staticCamaras.map(camara => {
        if (!camara.lat || !camara.lon) {
          console.error(`Cámara sin coordenadas válidas: ${camara.idCamara || camara.idComisaria || camara.idCliente || camara.idPredio}`);
          return null;
        }
        const tempCPU = parseInt(camara.onu?.system?.temps?.cpu || '0');
        return [camara.lat, camara.lon, tempCPU];
      }).filter((point): point is [number, number, number] => point !== null);
    } catch (error) {
      console.error('Error al obtener puntos del mapa de calor:', error);
      return [];
    }
  };

  const filteredCamaras = staticCamaras.filter(camara =>
    (!filterType || camara.tipo === filterType) &&
    (!filterCapa || camara.capa === filterCapa)
  );

  const uniqueTipos = Array.from(new Set(staticCamaras.map(c => c.tipo)));
  const uniqueCapas = Array.from(new Set(staticCamaras.map(c => c.capa)));

  const renderFibras = () => {
    return (
      <>
        {showFibra96h && FO96h.map((fibra: any) => (
          <Polyline key={fibra.name} positions={fibra.coordinates} pathOptions={{ color: fibra.color, weight: parseFloat(fibra.weight) }} />
        ))}
        {showFibra24h && FO24h.map((fibra: any) => (
          <Polyline key={fibra.name} positions={fibra.coordinates} pathOptions={{ color: fibra.color, weight: parseFloat(fibra.weight) }} />
        ))}
        {showFibra12h && FO12h.map((fibra: any) => (
          <Polyline key={fibra.name} positions={fibra.coordinates} pathOptions={{ color: fibra.color, weight: parseFloat(fibra.weight) }} />
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(110vh - 100px - 100px)' }}>
      <AlertBanner camaras={staticCamaras} />
      <div className="flex flex-1 relative">
        <div className="w-1/6 p-4 bg-gray-800 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-white">Filtros y Visualización</h2>

          <div className="mb-4">
            <label className="block mb-2 text-white">Buscar Cámara:</label>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre de la cámara..."
                className="w-full p-2 border rounded-l bg-gray-700 text-white"
              />
              <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
                Buscar
              </button>
            </form>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-white">Tipo de Mapa:</label>
            <select
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
            >
              <option value="street">Callejero</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-white">Visualización:</label>
            <select
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={visualization}
              onChange={(e) => setVisualization(e.target.value)}
            >
              <option value="">Normal</option>
              <option value="temp_cpu">Temperatura CPU</option>
              <option value="rx">Potencia RX</option>
              <option value="energia">Energía</option>
              <option value="reinicio">Reinicios</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-white">Filtrar por Tipo:</label>
            <select
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Todos</option>
              {uniqueTipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-white">Filtrar por Capa:</label>
            <select
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={filterCapa}
              onChange={(e) => setFilterCapa(e.target.value)}
            >
              <option value="">Todas</option>
              {uniqueCapas.map(capa => (
                <option key={capa} value={capa}>{capa}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-white">Mostrar Fibras:</label>
            <div className="flex">
              <div className="mr-4">
                <input
                  type="checkbox"
                  id="fibra96h"
                  checked={showFibra96h}
                  onChange={() => setShowFibra96h(!showFibra96h)}
                />
                <label htmlFor="fibra96h" className="ml-2 text-white">F.O. 96 H</label>
              </div>
              <div className="mr-4">
                <input
                  type="checkbox"
                  id="fibra24h"
                  checked={showFibra24h}
                  onChange={() => setShowFibra24h(!showFibra24h)}
                />
                <label htmlFor="fibra24h" className="ml-2 text-white">F.O. 24 H</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="fibra12h"
                  checked={showFibra12h}
                  onChange={() => setShowFibra12h(!showFibra12h)}
                />
                <label htmlFor="fibra12h" className="ml-2 text-white">F.O. 12 H</label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            {/* <label className="block mb-2 text-white">Agrupación de Marcadores:</label> */}
            <div className="flex">
              <input
                type="checkbox"
                id="showMarkerCluster"
                checked={showMarkerCluster}
                onChange={() => setShowMarkerCluster(!showMarkerCluster)}
              />
              <label htmlFor="showMarkerCluster" className="ml-2 text-white">Agrupar</label>
            </div>
          </div>

          <DashboardStats camaras={filteredCamaras} />
        </div>

        <div className="w-5/6 relative">
          <MapContainer center={[-31.7333, -60.5233]} zoom={13} className="map-container">
            <MapController />
            <TileLayer
              url={getMapUrl()}
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {showMarkerCluster ? (
              <MarkerClusterGroup
                chunkedLoading
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                zoomToBoundsOnClick={true}
                maxClusterRadius={40}
                spiderfyDistanceMultiplier={2}
                iconCreateFunction={(cluster) => {
                  const childCount = cluster.getChildCount();
                  let c = ' marker-cluster-';
                  if (childCount < 10) c += 'small';
                  else if (childCount < 100) c += 'medium';
                  else c += 'large';

                  return L.divIcon({
                    html: '<div><span>' + childCount + '</span></div>',
                    className: 'marker-cluster' + c,
                    iconSize: new L.Point(40, 40)
                  });
                }}
              >
                {filteredCamaras.map((camara) => {
                  const hasValidCoords = camara.lat != null && camara.lon != null;
                  const keyPrefix = camara.idCamara
                    ? 'camara-'
                    : camara.idComisaria
                      ? 'comisaria-'
                      : camara.idCliente
                        ? 'cliente-'
                        : camara.idPredio
                          ? 'predio-'
                          : 'unknown-';
                  const uniqueKey = `${keyPrefix}${camara.idCamara || camara.idComisaria || camara.idCliente || camara.idPredio}`;

                  return (
                    hasValidCoords && (
                      <React.Fragment key={uniqueKey}>
                        <Marker
                          position={[camara.lat, camara.lon]}
                          icon={getMarkerIcon(camara.icon, getMarkerColor(camara))}
                          eventHandlers={{
                            click: () => handleCameraClick(camara),
                          }}
                        >
                          <Popup>
                            <h3>{camara.name ?? 'Sin nombre'}</h3>
                            <p>Tipo: {camara.tipo ?? 'Desconocido'}</p>
                            <p>Sector: {camara.sector ?? 'No especificado'}</p>
                            <p>Capa: {camara.capa ?? 'No especificada'}</p>
                          </Popup>
                        </Marker>
                        <CameraArc camera={camara} />
                      </React.Fragment>
                    )
                  );
                })}
              </MarkerClusterGroup>
            ) : (
              filteredCamaras.map((camara) => {
                const hasValidCoords = camara.lat != null && camara.lon != null;
                const keyPrefix = camara.idCamara
                  ? 'camara-'
                  : camara.idComisaria
                    ? 'comisaria-'
                    : camara.idCliente
                      ? 'cliente-'
                      : camara.idPredio
                        ? 'predio-'
                        : 'unknown-';
                const uniqueKey = `${keyPrefix}${camara.idCamara || camara.idComisaria || camara.idCliente || camara.idPredio}`;

                return (
                  hasValidCoords && (
                    <React.Fragment key={uniqueKey}>
                      <Marker
                        position={[camara.lat, camara.lon]}
                        icon={getMarkerIcon(camara.icon, getMarkerColor(camara))}
                        eventHandlers={{
                          click: () => handleCameraClick(camara),
                        }}
                      >
                        <Popup>
                          <h3>{camara.name ?? 'Sin nombre'}</h3>
                          <p>Tipo: {camara.tipo ?? 'Desconocido'}</p>
                          <p>Sector: {camara.sector ?? 'No especificado'}</p>
                          <p>Capa: {camara.capa ?? 'No especificada'}</p>
                        </Popup>
                      </Marker>
                      <CameraArc camera={camara} />
                    </React.Fragment>
                  )
                );
              })
            )}

            {visualization === 'temp_cpu' && (
              <HeatmapLayer
                points={getHeatmapPoints()}
                options={{ radius: 25, blur: 15, maxZoom: 17 }}
              />
            )}

            {renderFibras()}

            <MapLegend visualization={visualization} />
          </MapContainer>

          {selectedCamera && (
            <div
              className="right-panel show"
              onMouseMove={handlePanelInteraction}
              onTouchStart={handlePanelInteraction}
            >
              <div className="panel-content">
                <button
                  className="close-button"
                  onClick={() => setSelectedCamera(null)}
                >
                  ×
                </button>
                {selectedCamera.capa === "CAMARAS" && <Video key={`video-${selectedCamera.ip}`} camaraip={selectedCamera.ip} />}
                {selectedCamera.onu && selectedCamera.onu.online === 'true' && (
                  <ONUData
                    key={`onu-${selectedCamera.idCamara || selectedCamera.idComisaria || selectedCamera.idCliente || selectedCamera.idPredio}`}
                    data={selectedCamera.onu}
                  />
                )}
                <div key={`details-${selectedCamera.idCamara || selectedCamera.idComisaria || selectedCamera.idCliente || selectedCamera.idPredio}`}>
                  <div className="flex items-center justify-center">
                    <FaInfoCircle size={30} className="mr-2" />
                    <h3 className="text-xl font-bold mb-2">DETALLE</h3>
                  </div>
                  <p>Nombre: {selectedCamera.name}</p>
                  <p>Tipo: {selectedCamera.tipo}</p>
                  <p>Sector: {selectedCamera.sector}</p>
                  <p>IP: {selectedCamera.ip}</p>
                  <p>Capa: {selectedCamera.capa}</p>
                </div>
              </div>
            </div>
          )}

          {selectedCamera && (
            <div
              className="bottom-panel show"
              onMouseMove={handlePanelInteraction}
              onTouchStart={handlePanelInteraction}
            >
              <div className="panel-content">
                <HistorialCamaraChart
                  key={`chart-${selectedCamera.idCamara || selectedCamera.idComisaria || selectedCamera.idCliente || selectedCamera.idPredio}`}
                  camaraId={selectedCamera.idCamara || selectedCamera.idComisaria || selectedCamera.idCliente || selectedCamera.idPredio || ''}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;