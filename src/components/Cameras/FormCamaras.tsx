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
        <Container fluid className="mt-3">
            <Card className="mb-4">
                <Card.Header as="h5" className="bg-primary text-white">
                    {editIndex !== null ? 'Editar Cámara' : 'Agregar Nueva Cámara'}
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ID Cámara</Form.Label>
                                    <Form.Control type="number" name="idCamara" value={formData.idCamara} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sector</Form.Label>
                                    <Form.Control type="text" name="sector" value={formData.sector} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Control type="text" name="tipo" value={formData.tipo} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control type="number" name="cantidad" value={formData.cantidad} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Layer</Form.Label>
                                    <Form.Control type="text" name="layer" value={formData.layer} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Capa</Form.Label>
                                    <Form.Control type="text" name="capa" value={formData.capa} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cont</Form.Label>
                                    <Form.Control type="number" name="cont" value={formData.cont} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3 mt-4">
                                    <Form.Check 
                                        type="checkbox"
                                        label="Activo"
                                        name="activo"
                                        checked={formData.activo}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3 mt-4">
                                    <Form.Check 
                                        type="checkbox"
                                        label="Alarma"
                                        name="alarma"
                                        checked={formData.alarma}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3 mt-4">
                                    <Form.Check 
                                        type="checkbox"
                                        label="Energía"
                                        name="energia"
                                        checked={formData.energia}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Icono</Form.Label>
                                    <Form.Control type="text" name="icon" value={formData.icon} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Color Icono</Form.Label>
                                    <Form.Control type="text" name="iconColor" value={formData.iconColor} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ángulo</Form.Label>
                                    <Form.Control type="number" name="angulo" value={formData.angulo} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Latitud</Form.Label>
                                    <Form.Control type="number" step="any" name="lat" value={formData.lat} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Longitud</Form.Label>
                                    <Form.Control type="number" step="any" name="lon" value={formData.lon} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ONU</Form.Label>
                                    <Form.Control type="text" name="onu" value={formData.onu} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>UPS</Form.Label>
                                    <Form.Control type="text" name="ups" value={formData.ups} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>IP</Form.Label>
                                    <Form.Control type="text" name="ip" value={formData.ip} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Modelo</Form.Label>
                                    <Form.Control type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número de Serie</Form.Label>
                                    <Form.Control type="text" name="numSerie" value={formData.numSerie} onChange={handleInputChange} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Button type="submit" className="mt-4 w-100 bg-primary">
                                    {editIndex !== null ? 'Actualizar' : 'Agregar'} Cámara
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

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
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                    <div className="table-responsive">
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
                                            <Button variant="info" size="sm" onClick={() => handleEdit(camara)} className="mr-2">
                                                Editar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(camara.idCamara)}>
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
        </Container>
    );
};

export default FormCamaras;