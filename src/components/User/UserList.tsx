import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../redux/slices/userSlice';
import './User.css';

const UserList: React.FC = () => {
    const dispatch = useDispatch<any>();
    const users = useSelector((state: any) => state.users.users);
    const userStatus = useSelector((state: any) => state.users.status);
    const error = useSelector((state: any) => state.users.error);

    const [formData, setFormData] = useState({ username: '', password: '', level: '', role: 'lector' });
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        if (userStatus === 'idle') {
            dispatch(fetchUsers());
        }
    }, [userStatus, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData = { ...formData };

        if (editIndex !== null) {
            const updatedUser = { ...users[editIndex], ...userData };
            dispatch(updateUser(updatedUser));
            setEditIndex(null);
        } else {
            dispatch(addUser(userData));
        }

        setFormData({ username: '', password: '', level: '', role: 'lector' });
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setFormData(users[index]);
    };

    const handleDelete = (index: number) => {
        dispatch(deleteUser(users[index].id));
    };

    let content;
    if (userStatus === 'loading') {
        content = <div>Loading...</div>;
    } else if (userStatus === 'succeeded') {
        content = users.map((user: any, index: number) => (
            <tr key={user.id} className="bg-white border-b">
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.level}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleEdit(index)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Editar
                    </button>
                    <button onClick={() => handleDelete(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Eliminar
                    </button>
                </td>
            </tr>
        ));
    } else if (userStatus === 'failed') {
        content = <div>{error}</div>;
    }

    return (
        <div className="container-user">
            <div className="form-container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Generar Nuevo Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                            Level
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="level"
                            type="number"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="educar">Educar</option>
                            <option value="cliente">Cliente</option>
                            <option value="911">911</option>
                            <option value="Tecnico">Tecnico</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            {editIndex !== null ? 'Actualizar Usuario' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-container">
                <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Username</th>
                                <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Level</th>
                                <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
                                <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {content}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;