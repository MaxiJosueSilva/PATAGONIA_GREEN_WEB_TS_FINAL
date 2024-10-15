import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnus, rebootOnu } from '../../redux/slices/oltSlice';
import { Table, Form, Row, Container, InputGroup, Button } from 'react-bootstrap';
import Loader from '../UI/Loader';
import './FormOnus.css';
//import { FaSearch } from 'react-icons/fa';
import PasswordModal from '../UI/PasswordModal';
import { AppDispatch, RootState } from '../../redux/store';
import { decodeToken } from '../../services/authService'; // Importación de decodeToken

const FormOnus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const onus = useSelector((state: RootState) => state.olt.onus);
  const status = useSelector((state: RootState) => state.olt.status);
  const error = useSelector((state: RootState) => state.olt.error);
  const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [loading, setLoading] = useState(false);

    // Estado para el modal
    const [selectedOnu, setSelectedOnu] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(fetchOnus());
            setLoading(false);
        };

        fetchData();

        const intervalId = setInterval(fetchData, 30000);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // Abre el modal al hacer clic en "Reiniciar"
    const handleOpenModal = (onu: any) => {
        setSelectedOnu(onu);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOnu(null);  // Limpia la ONU seleccionada
    };

    const handleReboot = async (password: string) => {
		let username = decodeToken() ? decodeToken().username : null; 
        if (password === 'admin' && username) {
            await dispatch(rebootOnu({ onu: selectedOnu, username: username}));
			
            console.log(`Reiniciando la ONU ${selectedOnu.serial_number} en el OLT ${selectedOnu.olt}. por el Usuario ${username}`);
        } else {
            console.log('Contraseña incorrecta o usuario no identificado.');
        }
        handleCloseModal();  // Cierra el modal después de intentar el reinicio
    };


    const filteredOnus = onus.filter((onu) =>
        Object.values(onu).some((value) =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    let content;
    if (status === 'loading' || loading) {
        content = (
            <tr key="loading">
                <td colSpan="10">
				<div style={{ 
					display: 'flex', 
					justifyContent: 'center', 
					alignItems: 'center',
					height: '100vh', // Ajusta la altura si es necesario
					width: '100vw'
					}}>
				<Loader /> 
				</div>
                </td>
            </tr>
        );
    } else if (status === 'succeeded') {
        const sortedOnus = filteredOnus.sort((a, b) => {
            if (sortField) {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (aValue < bValue) {
                    return sortOrder === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortOrder === 'asc' ? 1 : -1;
                }
                return 0;
            }
            return 0;
        });

        content = sortedOnus.map((onu, index) => (
            <OnuRow key={`${onu.serial_number}-${index}`} onu={onu} handleOpenModal={handleOpenModal} />
        ));
    } else if (status === 'failed') {
        content = (
            <tr key="error">
                <td colSpan="10">Error: {error}</td>
            </tr>
        );
    }

    return (
        <Container fluid className="mt-3">
            <Row>
                <div className="container-user">
                    <div className="table-container">
                        <h1>ONUs</h1>
                        <InputGroup className="mb-3" style={{ maxWidth: '500px', margin: '0 auto', alignItems: 'center' }}>
							<InputGroup.Text style={{ width: '100px', backgroundColor: 'transparent', color: 'gray', border: 'none', paddingRight: '10px', fontSize: '1.2em' }}>
								Buscador:
							</InputGroup.Text>
							<Form.Control
								style={{ height: '38px', width: 'calc(100% - 110px)' }} // Ajusta la altura y el ancho
								placeholder="Buscar ONUs..."
								value={searchTerm}
								onChange={handleSearch}
							/>
						</InputGroup>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('serial_number')}>
                                            Número de Serie {sortField === 'serial_number' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('name')}>
                                            Nombre {sortField === 'name' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('olt')}>
                                            Olt {sortField === 'olt' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('mac_address')}>
                                            Dirección MAC {sortField === 'mac_address' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('firmware_version')}>
                                            Versión de Firmware {sortField === 'firmware_version' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('connection_time')}>
                                            Tiempo Conexion {sortField === 'connection_time' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('online')}>
                                            En línea {sortField === 'online' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('optics?.tx_power_onu')}>
                                            Tx {sortField === 'optics?.tx_power_onu' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('optics?.rx_power_onu')}>
                                            Rx {sortField === 'optics?.rx_power_onu' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th onClick={() => handleSort('distance')}>
                                            Distancia {sortField === 'distance' && sortOrder === 'asc' ? '⬆' : '⬇'}
                                        </th>
                                        <th>Puertos</th>
                                        <th>Reiniciar</th>
                                    </tr>
                                </thead>
                                <tbody>{content}</tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </Row>

            {/* Modal para reiniciar la ONU */}
            {selectedOnu && (
                <PasswordModal
                    onu={selectedOnu}
                    onConfirm={handleReboot}
                    show={showModal}
                    handleClose={handleCloseModal}
                />
            )}
        </Container>
    );
};

const OnuRow = React.memo(({ onu, handleOpenModal }) => {
    return (
        <tr className="loaded" key={onu.serial_number}>
            <td>{onu.serial_number}</td>
            <td>{onu.name}</td>
            <td>{onu.olt}</td>
            <td>{onu.mac_address}</td>
            <td>{onu.firmware_version}</td>
            <td>
                {(() => {
                    const seconds = parseInt(onu.connection_time);
                    const days = Math.floor(seconds / 86400);
                    const hours = Math.floor((seconds % 86400) / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    return `${days}d ${hours}h ${minutes}m`;
                })()}
            </td>
            <td>{onu.online}</td>
            <td>{onu.optics?.tx_power_onu}</td>
            <td>{onu.optics?.rx_power_onu}</td>
            <td>{onu.distance}</td>
            <td>
				<table>
					<tbody>
						<tr>
							{onu.port &&
							Object.entries(onu.port).map(([portNumber, details]) => (
							<td key={portNumber}>
								<div
									style={{
									width: '20px',
									height: '20px',
									borderRadius: '50%',
									backgroundColor: (() => {
									switch (details.speed) {
									case '1000-full-duplex':
									return 'green';
									case '100-full-duplex':
									return 'orange';
									case '5-full-duplex':
									return 'blue';
									case 'unknown':
									default:
									return 'grey';
									}
									})(),
									}}
								></div>
							</td>
							))}
						</tr>
					</tbody>
				</table>
				</td>
            <td>
                <Button
                    variant="danger"
                    onClick={() => handleOpenModal(onu)}
                    style={{ backgroundColor: '#FF4136', borderColor: '#FF4136' }}
                >
                    Reiniciar
                </Button>
            </td>
        </tr>
    );
});

export default FormOnus;