import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert, removeAlert, setActiveAlert, removeActiveAlert } from '../store/alertSlice';

const ALERT_THRESHOLDS = {
  ethernet: {
    warning: 80,
    critical: 90
  },
  energia: {
    entrada: {
      low: 95,
      high: 115
    },
    salida: {
      low: 55,
      high: 65
    },
    nebula: {
      low: 45,
      high: 55
    }
  }
};

function AlertSystem({ socket }) {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.alerts.notifications);
  const activeAlerts = useSelector(state => state.alerts.activeAlerts);

  const showNotification = (message, type = 'warning') => {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    dispatch(addAlert({ id: alertId, message, type }));

    setTimeout(() => {
      dispatch(removeAlert(alertId));
    }, 10000);
  };

  useEffect(() => {
    if (!socket) return;

    const checkThresholds = (data) => {
      const nodeId = data.node_id;

      // Check ethernet
      if (data.ethernet >= ALERT_THRESHOLDS.ethernet.critical) {
        const alertKey = `${nodeId}-ethernet-critical`;
        if (!activeAlerts.includes(alertKey)) {
          showNotification(`Critical: ${nodeId} ethernet usage at ${data.ethernet}%`, 'danger');
          dispatch(setActiveAlert(alertKey));
        }
      } else if (data.ethernet >= ALERT_THRESHOLDS.ethernet.warning) {
        const alertKey = `${nodeId}-ethernet-warning`;
        if (!activeAlerts.includes(alertKey)) {
          showNotification(`Warning: ${nodeId} ethernet usage at ${data.ethernet}%`, 'warning');
          dispatch(setActiveAlert(alertKey));
        }
      }

      // Check energia values
      const energiaChecks = [
        { key: 'entrada', value: data.energia.entrada },
        { key: 'salida', value: data.energia.salida },
        { key: 'nebula', value: data.energia.nebula }
      ];

      energiaChecks.forEach(({ key, value }) => {
        const thresholds = ALERT_THRESHOLDS.energia[key];
        const alertKey = `${nodeId}-${key}`;

        if (value < thresholds.low) {
          if (!activeAlerts.includes(`${alertKey}-low`)) {
            showNotification(`Warning: ${nodeId} ${key} energy level low at ${value}`, 'warning');
            dispatch(setActiveAlert(`${alertKey}-low`));
          }
        } else if (value > thresholds.high) {
          if (!activeAlerts.includes(`${alertKey}-high`)) {
            showNotification(`Warning: ${nodeId} ${key} energy level high at ${value}`, 'warning');
            dispatch(setActiveAlert(`${alertKey}-high`));
          }
        } else {
          // Clear alerts if values return to normal
          if (activeAlerts.includes(`${alertKey}-low`)) {
            dispatch(removeActiveAlert(`${alertKey}-low`));
          }
          if (activeAlerts.includes(`${alertKey}-high`)) {
            dispatch(removeActiveAlert(`${alertKey}-high`));
          }
        }
      });
    };

    socket.on('real_time_update', checkThresholds);
    return () => socket.off('real_time_update', checkThresholds);
  }, [socket, dispatch, activeAlerts]);

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100, maxWidth: '400px' }}>
      {notifications.map(alert => (
        <div
          key={alert.id}
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role="alert"
        >
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch(removeAlert(alert.id))}
          />
        </div>
      ))}
    </div>
  );
}

export default AlertSystem;
