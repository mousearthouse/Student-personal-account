import { API_URL } from '@/utils/constants/constants';
import './adminPage.scss';
import { useNavigate } from "react-router-dom";
import image from '@/assets/icons/image-upload.svg';

import editIcon from '@/assets/icons/edit.svg';
import deleteIcon from '@/assets/icons/delete.svg';
import { useEffect, useState } from 'react';
import { getUsefulServices } from '@/utils/api/requests/getUsefulServices';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import { postUsefulService } from '@/utils/api/requests/admin/postUsefulService';
import { deleteUsefulServiceAdmin } from '@/utils/api/requests/admin/deleteUsefulServiceAdmin';
import { handleUpload } from '@/utils/api/requests/postFile';
import { editUsefulService } from '@/utils/api/requests/admin/editUsefulService';

const AdminUsefulServicesPage = () => {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const pageSize = 3;

    const [servicesData, setServicesData] = useState({} as UsefulServiceDtoPagedListWithMetadata);

    const [modalCreateOpen, setModalCreateOpen] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await getUsefulServices({
                    params: {
                        categories: ['ForAll', 'Students', 'Employees'],
                        page: pageNumber,
                        pageSize: pageSize,
                    },
                });
                setServicesData(response.data);
                console.log(response.data.metaData);
                setPageCount(response.data.metaData.pageCount);
                
                console.log(response.data);
            } catch (err) {
                console.log('Что-то пошло не так при получении списка сервисов :( ', err);
            }
        };

        fetchServices();
    }, [pageNumber]);
    return (
        <main>
            <div className='admin-page-content'>
                <div>
                    <h1>Администрирование</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>Главная / </span>
                <span className='page-link' onClick={() => navigate('/admin')}>Администрирование / </span>
                <span className='page-link-blue'>Полезные сервисы</span>
                
                <div>
                    <h2>Полезные сервисы</h2>
                    <button className="add-smth" onClick={() => setModalCreateOpen(true)}>Добавить сервис</button>
                    <div className='services'>
                        {(servicesData.results ?? []).map((serviceData, id) => (
                        <ServiceAdminCard key={id} service={serviceData} />
                    ))}
                    </div>
                </div>
                
            </div>
            <Pagination
                currentPage={pageNumber}
                pageCount={pageCount}
                onPageChange={setPageNumber}
            />
            <ModalCreate isOpen={modalCreateOpen} onClose={() => setModalCreateOpen(false)}/>
        </main>
    );
}

const ServiceAdminCard = ({ service }: { service: UsefulServicesDto }) => {
    const navigate = useNavigate();
    const getImageUrl = () => {
        if (!service.logo) return undefined;
        return `${API_URL}Files/${service.logo.id}`;
    };

    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

    const deleteService = async () => {
        try {
            const response = await deleteUsefulServiceAdmin({ params: { usefulServiceId: service.id } });
            navigate('/admin/usefulservices');
        } catch (error) {
            console.error("oh NOOOOOO")
        }
    }

    return (
        <div className="service-card admin">
            <div className="service-card-title admin">
                <h4>{service.title}</h4>
                <img src={getImageUrl()} alt="logo"/>
            </div>
            <div className='service-card-admin-details'>
                <div className="container-row">
                    <div className="block-row1">
                        <span className="block-label">
                            Ссылка
                        </span>
                        <span className="block-value">{service.link}</span>
                    </div>
                    <div className="block-row2">
                        <span className="block-label">
                            Тип
                        </span>
                        <span className="block-value">{service.category}</span>
                    </div>
                </div>
                <hr/>
                <div className='container-row-single'>
                    <span className="block-label">
                        Описание
                    </span>
                    <span className="block-value">{service.description}</span>
                </div>
                <hr/>
                <div className='container-row-single'>
                    <span className="block-label">
                        Условия предоставления
                    </span>
                    <span className="block-value">{service.termsOfDisctribution}</span>
                </div>
            </div>
            <div className='admin-icons'>
                <img src={editIcon} onClick={() => setModalEditOpen(true)} className="icon" alt="Edit" />
                <img src={deleteIcon} onClick={() => setModalDeleteOpen(true)}
                className="icon" alt="Delete" />
            </div>
            <ModalEdit serviceData={service} isOpen={modalEditOpen} onClose={() => setModalEditOpen(false)}/>
            <Modal isOpen={modalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
                <div className='modal-window'>
                    <h2>Вы точно хотите удалить данный сервис?</h2>
                    <p>Вы точно-точно уверены?</p>
                    <button onClick={deleteService}>Да, удалить</button>
                </div>
            </Modal>
        </div>
    );
}

interface ModalCreateProps {
    isOpen: boolean;
    onClose: () => void;
}


const ModalCreate = ({isOpen, onClose}: ModalCreateProps) => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState<UsefulServiceCategory>("ForAll");
    const [description, setDescription] = useState("");
    const [disctribution, setDisctribution] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState("");

    const handleCreate = async () => {
        console.log('Создание мероприятия с данными:')

        try {
            if (!category) {
                console.log("выбрать тип ")
                return;
            }
            const serviceCreateData = {
                category: category,
                title: title,
                description: description,
                link: link,
                termsOfDisctribution: disctribution,
                logoId: fileId || undefined,
            };

            const response = await postUsefulService(serviceCreateData);
            if (response.status === 200) {
                onClose();
            }

            console.log('Данные мероприятия:', serviceCreateData);
        } catch (error) {
            console.error('Ошибка при редактировании мероприятия:', error);
        }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                setSelectedFile(file);
                const result = await handleUpload(file);
                if (result?.status === 200) {
                    setFileId(result.data.id);
                    console.log('Файл успешно загружен:', result.data.id);
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='modal-window'>
                <h2>Создание сервиса</h2>
                <div className='admin-page-content'>
                    <div className='admin-create-service'>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                Название сервиса
                            </label>
                            <input
                                id="name"
                                placeholder=""
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="link">
                                Ссылка
                            </label>
                            <input
                                id="link"
                                placeholder=""
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="type">
                                Тип
                            </label>
                            <select
                                id="type"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as UsefulServiceCategory)}
                                className="form-input admin"
                            >
                                <option value="ForAll">Общий</option>
                                <option value="Students">Студенты</option>
                                <option value="Employees">Сотрудники</option>
                            </select>
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="desc">
                                Описание
                            </label>
                            <input
                                id="desc"
                                placeholder=""
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="link">
                                Условия предоставления
                            </label>
                            <input
                                id="link"
                                placeholder=""
                                value={disctribution}
                                onChange={(e) => setDisctribution(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                    </div>
                </div>
                <label className="image-upload">
                    <img src={image} alt="Загрузить картинку" />
                    <span>Загрузить картинку</span>
                    <input type="file" accept="image/*" onChange={handleFileChange}/>
                </label>
                {selectedFile && (
                    <p className="uploaded-file-name">Вы выбрали: {selectedFile.name}</p>
                )}
                <div className="btns">
                    <button onClick={handleCreate}>Создать</button>
                </div>
            </div>
        </Modal>
    );
}

interface ModalEditProps {
    serviceData: UsefulServicesDto;
    isOpen: boolean;
    onClose: () => void;
}

const ModalEdit = ({serviceData, isOpen, onClose}: ModalEditProps) => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState<UsefulServiceCategory>("ForAll");
    const [description, setDescription] = useState("");
    const [disctribution, setDisctribution] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState("");

    const getImageUrl = () => {
        if (!serviceData.logo) return undefined;
        return `${API_URL}Files/${serviceData.logo.id}`;
    };

    useEffect(() => {
        setTitle(serviceData.title || "");
        setLink(serviceData.link || "");
        setCategory(serviceData.category);
        setDescription(serviceData.description || "");
        setDisctribution(serviceData.termsOfDisctribution);

        if (serviceData.logo) {
            setFileId(serviceData.logo.id);

            const imageUrl = getImageUrl();
            if (imageUrl) {
                fetch(imageUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], serviceData.logo.name || "image.png", { type: blob.type });
                        setSelectedFile(file);
                    })
                    .catch(err => {
                        console.error('Не удалось загрузить файл с сервера:', err);
                        setSelectedFile(null);
                    });
            }
        } else {
            setFileId("");
            setSelectedFile(null);
        }
        setFileId(serviceData.logo ? serviceData.logo.id : "");
    }, [serviceData]);

    const handleEdit = async () => {
        console.log('Создание мероприятия с данными:')

        try {
            if (!category) {
                console.log("выбрать тип ")
                return;
            }
            const serviceEditData = {
                category: category,
                title: title,
                description: description,
                link: link,
                termsOfDisctribution: disctribution,
                logoId: fileId || undefined,
            };

            const response = await editUsefulService(serviceData.id, serviceEditData);
            if (response.status === 200) {
                onClose();
            }

            console.log('Данные мероприятия:', serviceEditData);
        } catch (error) {
            console.error('Ошибка при редактировании мероприятия:', error);
        }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                setSelectedFile(file);
                const result = await handleUpload(file);
                if (result?.status === 200) {
                    setFileId(result.data.id);
                    console.log('Файл успешно загружен:', result.data.id);
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='modal-window'>
                <h2>Создание сервиса</h2>
                <div className='admin-page-content'>
                    <div className='admin-create-service'>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                Название сервиса
                            </label>
                            <input
                                id="name"
                                placeholder=""
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="link">
                                Ссылка
                            </label>
                            <input
                                id="link"
                                placeholder=""
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="type">
                                Тип
                            </label>
                            <select
                                id="type"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as UsefulServiceCategory)}
                                className="form-input admin"
                            >
                                <option value="ForAll">Общий</option>
                                <option value="Students">Студенты</option>
                                <option value="Employees">Сотрудники</option>
                            </select>
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="desc">
                                Описание
                            </label>
                            <input
                                id="desc"
                                placeholder=""
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="link">
                                Условия предоставления
                            </label>
                            <input
                                id="link"
                                placeholder=""
                                value={disctribution}
                                onChange={(e) => setDisctribution(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                    </div>
                </div>
                <label className="image-upload">
                    <img src={image} alt="Загрузить картинку" />
                    <span>Загрузить картинку</span>
                    <input type="file" accept="image/*" onChange={handleFileChange}/>
                </label>
                {selectedFile && (
                    <p className="uploaded-file-name">Вы выбрали: {selectedFile.name}</p>
                )}
                <div className="btns">
                    <button onClick={handleEdit}>Сохранить</button>
                </div>
            </div>
        </Modal>
    );
}

export default AdminUsefulServicesPage;
