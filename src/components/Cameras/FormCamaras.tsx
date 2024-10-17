import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamaras, deleteCamara, addCamara, updateCamara } from '../../redux/slices/camarasSlice';
import { Table, Button, Form, Row, Col, Container, InputGroup, Card } from 'react-bootstrap';
import { Search } from 'lucide-react';
import './FormCamaras.css';

const FormCamaras: React.FC = () => {
    const dispatch = useDispatch<any>();
    const camaras = useSelector((state: any) => state.camaras.camaras);
    const camaraStatus = useSelector((state: any) => state.camaras.status);
    const error = useSelector((state: any) => state.camaras.error);

    const [formData, setFormData] = useState({
        idCamara: '',
        sector: '',
        name: '',
        tipo: '',
        cantidad: '',
        descripcion: '',
        layer: '',
        capa: '',
        cont: '',
        activo: false,
        alarma: false,
        icon: '',
        iconColor: '',
        angulo: '',
        lat: '',
        lon: '',
        onu: '',
        ups: '',
        modelo: '',
        numSerie: '',
        ip: '',
        energia: false
    });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (camaraStatus === 'idle') {
            dispatch(fetchCamaras());
        }
    }, [camaraStatus, dispatch]);

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta cámara?')) {
            dispatch(deleteCamara(id));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editIndex !== null) {
            dispatch(updateCamara({ ...formData, id: editIndex }));
            setEditIndex(null);
        } else {
            dispatch(addCamara(formData));
        }
        setFormData({
            idCamara: '',
            sector: '',
            name: '',
            tipo: '',
            cantidad: '',
            descripcion: '',
            layer: '',
            capa: '',
            cont: '',
            activo: false,
            alarma: false,
            icon: '',
            iconColor: '',
            angulo: '',
            lat: '',
            lon: '',
            onu: '',
            ups: '',
            modelo: '',
            numSerie: '',
            ip: '',
            energia: false
        });
    };

    const handleEdit = (camara: any) => {
        setFormData(camara);
        setEditIndex(camara.idCamara);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredCamaras = camaras.filter((camara: any) =>
        Object.values(camara).some((value: any) =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Container fluid className="mt-3 camara-container">
            {/* Form Container */}
            <div className="camara-form-container">
                <Card>
                <Card.Header as="h5" className="bg-primary text-white">
                    {editIndex !== null ? 'Editar Cámara' : 'Agregar Nueva Cámara'}
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">ID Cámara</Form.Label>
                            <Form.Control
                            type="number"
                            name="idCamara"
                            className="camara-input"
                            value={formData.idCamara}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Sector</Form.Label>
                            <Form.Control
                            type="text"
                            name="sector"
                            className="camara-input"
                            value={formData.sector}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Tipo</Form.Label>
                            <Form.Control
                            type="text"
                            name="tipo"
                            className="camara-input"
                            value={formData.tipo}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Cantidad</Form.Label>
                            <Form.Control
                            type="number"
                            name="cantidad"
                            className="camara-input"
                            value={formData.cantidad}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Nombre</Form.Label>
                            <Form.Control
                            type="text"
                            name="name"
                            className="camara-input"
                            value={formData.name}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Layer</Form.Label>
                            <Form.Control
                            type="text"
                            name="layer"
                            className="camara-input"
                            value={formData.layer}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Capa</Form.Label>
                            <Form.Control
                            type="text"
                            name="capa"
                            className="camara-input"
                            value={formData.capa}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Cont</Form.Label>
                            <Form.Control
                            type="number"
                            name="cont"
                            className="camara-input"
                            value={formData.cont}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Icono</Form.Label>
                            <Form.Control
                            type="text"
                            name="icon"
                            className="camara-input"
                            value={formData.icon}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Color Icono</Form.Label>
                            <Form.Control
                            type="text"
                            name="iconColor"
                            className="camara-input"
                            value={formData.iconColor}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Ángulo</Form.Label>
                            <Form.Control
                            type="number"
                            name="angulo"
                            className="camara-input"
                            value={formData.angulo}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Latitud</Form.Label>
                            <Form.Control
                            type="number"
                            step="any"
                            name="lat"
                            className="camara-input"
                            value={formData.lat}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Longitud</Form.Label>
                            <Form.Control
                            type="number"
                            step="any"
                            name="lon"
                            className="camara-input"
                            value={formData.lon}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">ONU</Form.Label>
                            <Form.Control
                            type="text"
                            name="onu"
                            className="camara-input"
                            value={formData.onu}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">UPS</Form.Label>
                            <Form.Control
                            type="text"
                            name="ups"
                            className="camara-input"
                            value={formData.ups}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">IP</Form.Label>
                            <Form.Control
                            type="text"
                            name="ip"
                            className="camara-input"
                            value={formData.ip}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">Modelo</Form.Label>
                            <Form.Control
                            type="text"
                            name="modelo"
                            className="camara-input"
                            value={formData.modelo}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">
                            Número de Serie
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name="numSerie"
                            className="camara-input"
                            value={formData.numSerie}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="camara-label">
                            Descripción
                            </Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion"
                            className="camara-textarea"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Check
                            type="checkbox"
                            label="Activo"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Check
                            type="checkbox"
                            label="Alarma"
                            name="alarma"
                            checked={formData.alarma}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Check
                            type="checkbox"
                            label="Energía"
                            name="energia"
                            checked={formData.energia}
                            onChange={handleInputChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
        
                    <Row>
                        <Col md={12}>
                        <Button type="submit" className="mt-4 w-100 bg-primary">
                            {editIndex !== null ? 'Actualizar' : 'Agregar'} Cámara
                        </Button>
                        </Col>
                    </Row>
                    </Form>
                </Card.Body>
                </Card>
            </div>
        
            {/* Table Container */}
            <div className="camara-table-container">
                <Card>
                <Card.Header as="h5" className="bg-secondary text-white">
                    Lista de Cámaras
                </Card.Header>
                <Card.Body>
                    <InputGroup className="mb-3">
                    <InputGroup.Text>
                        <Search size={18} />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar cámaras..."
                        className="camara-input"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    </InputGroup>
                    <div className="camara-table-responsive">
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sector</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Activo</th>
                            <th>Alarma</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCamaras.map((camara: any) => (
                            <tr key={camara.idCamara}>
                            <td>{camara.idCamara}</td>
                            <td>{camara.sector}</td>
                            <td>{camara.name}</td>
                            <td>{camara.tipo}</td>
                            <td>{camara.activo ? 'Sí' : 'No'}</td>
                            <td>{camara.alarma ? 'Sí' : 'No'}</td>
                            <td>
                                <Button
                                variant="info"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleEdit(camara)}
                                >
                                Editar
                                </Button>
                                <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(camara.idCamara)}
                                >
                                Eliminar
                                </Button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    </div>
                </Card.Body>
                </Card>
            </div>
            </Container>
        );
};

export default FormCamaras;