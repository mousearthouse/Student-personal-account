import { API_URL } from '@/utils/constants/constants';
import './adminPage.scss';
import { useNavigate } from "react-router-dom";
import ServiceBtn from '@/components/UsefulServiceBtn/ServiceBtn';

import editIcon from '@/assets/icons/edit.svg';
import deleteIcon from '@/assets/icons/delete.svg';
import { useEffect, useState } from 'react';
import { getUsefulServices } from '@/utils/api/requests/getUsefulServices';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import { postUsefulService } from '@/utils/api/requests/admin/postUsefulService';
import { deleteUsefulServiceAdmin } from '@/utils/api/requests/admin/deleteUsefulServiceAdmin';

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
                        categories: 'ForAll',
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
                    <button onClick={() => setModalCreateOpen(true)}>Добавить сервис</button>
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
    const [logo, setLogo] = useState<string | null>("");

    const [serviceData, setServiceData] = useState<UsefulServiceEditCreateDto>();

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
                logoId: logo || undefined,
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
                <button onClick={handleCreate}>Создать</button>
            </div>
        </Modal>
    );
}
// const ModalEdit = ({eventData, isOpen, onClose}: ModalEditProps) => {
//     console.log("ко мне пришла такая дата", eventData)

//     const dateFormat = (date?: string) => {
//         if (date == null || date == undefined) return undefined;
//         return new Date(date).toISOString().split('T')[0] 
//     };

//     useEffect(() => {
//         
//     }, [eventData]);


//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         try {
//             if (e.target.files && e.target.files.length > 0) {
//                 const file = e.target.files[0];
//                 setSelectedFile(file);
//                 const result = await handleUpload(file);
//                 if (result?.status === 200) {
//                     setFileId(result.data.id);
//                     console.log('Файл успешно загружен:', result.data.id);
//                 }
//             }
//         } catch (error) {
//             console.error('Ошибка при загрузке файла:', error);
//         }
//     };
    
//     const handleEdit = async () => {
//         console.log('Создание мероприятия с данными:')

//         console.log({eventName,descValue,digest,dateTimeFrom: eventStartDate ? new Date(eventStartDate).toISOString() : "",
//             dateTimeTo: eventEndDate ? new Date(eventEndDate).toISOString() : "",type,status,format,linkValue,
//             notification,fileId,registration,auditory});
//         try {
//             if (!type) {
//                 console.log("выбрать тип меро")
//                 return;
//             }
//             const eventEditData = {
//                 id: eventData.id,
//                 auditory: auditory,
//             };

//             const response = await editEventAdmin(eventEditData);
//             if (response.status === 200) {
//                 onClose();
//             }

//             console.log('Данные мероприятия:', eventEditData);
//         } catch (error) {
//             console.error('Ошибка при редактировании мероприятия:', error);
//         }
//     }

//     return (
//         <Modal isOpen={isOpen} onClose={onClose}>
//             <div className='modal-window'>
//                 <h2>Редактирование мероприятия</h2>
//                 <p>Вы точно-точно уверены?</p>
//             </div>
//             <div className='admin-page-content'>
//                 <div className='admin-create-event'>
//                     <div className="input-form-w-label">
//                         <label className="label-form" htmlFor="name">
//                             Название мероприятия
//                         </label>
//                         <input
//                             id="name"
//                             placeholder=""
//                             value={eventName}
//                             onChange={(e) => setEventName(e.target.value)}
//                             className="form-input admin name"
//                         />
//                     </div>
//                     <h4>Описание мероприятия</h4>
//                     <TextEditor value={descValue ?? ''} setValue={setDescValue}/>

//                     <div className="input-forms-other">
//                         <div className="input-form-w-label">
//                             <label className="label-form" htmlFor="name">
//                                 Дата начала
//                             </label>
//                             <input
//                                 type="date"
//                                 id="name"
//                                 placeholder=""
//                                 value={eventStartDate}
//                                 onChange={(e) => setEventStartDate(e.target.value)}
//                                 className="form-input admin date"
//                             />
//                         </div>
//                         <div className="input-form-w-label">
//                             <label className="label-form" htmlFor="name">
//                                 Дата окончания
//                             </label>
//                             <input
//                                 type="date"
//                                 id="name"
//                                 placeholder=""
//                                 value={eventEndDate}
//                                 onChange={(e) => setEventEndDate(e.target.value)}
//                                 className="form-input admin date"
//                             />
//                         </div>
//                         <div className="input-form-w-label">
//                             <select
//                                 id="type"
//                                 value={type}
//                                 onChange={(e) => setType(e.target.value as EventType)}
//                                 className="form-input admin"
//                             >
//                                 <option value="">Выберите тип</option>
//                                 <option value="Open">Открытое</option>
//                                 <option value="Close">Закрытое</option>
//                             </select>
//                         </div>
//                         <div className="input-form-w-label">
//                             <label className="label-form" htmlFor="status">
//                                 Целевая аудитория
//                             </label>
//                             <select
//                                 id="status"
//                                 value={auditory}
//                                 onChange={(e) => setAuditory(e.target.value as EventAuditory)}
//                                 className="form-input admin"
//                             >
//                                 <option value="">Все</option>
//                                 <option value="Students">Студенты</option>
//                                 <option value="Employees">Сотрудники</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-switch">
//                         <label className="toggle-switch">
//                             <input
//                                 type="checkbox"
//                                 checked={registration}
//                                 onChange={() => setRegistration(!registration)}
//                                 className="checkbox"
//                             />
//                             <span className="slider"></span>
//                         </label>
//                         <label className='switch-label'>
//                             Необходима регистрация
//                         </label>
//                     </div>
//                     {registration &&
//                         <div className="input-form-w-label">
//                             <label className="label-form" htmlFor="name">
//                                 Дата окончания регистрации
//                             </label>
//                             <input
//                                 type="date"
//                                 id="name"
//                                 placeholder=""
//                                 value={registrationLastDate}
//                                 onChange={(e) => setRegistrationLastDate(e.target.value)}
//                                 className="form-input admin date"
//                             />
//                         </div>
//                     }
//                     <div className="input-form-w-label">
//                         <label className="label-form" htmlFor="format">
//                             Формат мероприятия
//                         </label>
//                         <select
//                             id="format"
//                             value={format}
//                             onChange={(e) => setFormat(e.target.value as EventFormat)}
//                             className="form-input admin"
//                         >
//                             <option value="">Все</option>
//                             <option value="Online">Онлайн</option>
//                             <option value="Offline">Офлайн</option>
//                         </select>
//                     </div>
//                     {format == 'Online' && 
//                     <div className="input-form-w-label">
//                         <label className="label-form" htmlFor="name">
//                             Ссылка
//                         </label>
//                         <input
//                             id="name"
//                             placeholder=""
//                             value={linkValue}
//                             onChange={(e) => setLinkValue(e.target.value)}
//                             className="form-input admin name"
//                         />
//                     </div>
//                     }
//                     {format == 'Offline' && 
//                     <div className="input-form-w-label">
//                         <label className="label-form" htmlFor="link">
//                             Адрес
//                         </label>
//                         <input
//                             id="link"
//                             placeholder=""
//                             value={address}
//                             onChange={(e) => setAddressValue(e.target.value)}
//                             className="form-input admin"
//                         />
//                     </div>
//                     }
//                     <h4>Уведомление о мероприятии</h4>
//                     <TextEditor value={notification ?? ''} setValue={setNotification}/>
//                     <div>
//                         <h4>Включать мероприятие в дайджест</h4>
//                         <label className="toggle-switch">
//                             <input
//                                 type="checkbox"
//                                 checked={digestNeeded}
//                                 onChange={() => setDigestNeeded(!digestNeeded)}
//                                 className="checkbox"
//                             />
//                             <span className="slider"></span>
//                         </label>
//                     </div>
//                     {digestNeeded && 
//                         <TextEditor value={digest ?? ''} setValue={setDigest}/>
//                     }

//                     <label className="image-upload">
//                         <img src={image} alt="Загрузить картинку" />
//                         <span>Загрузить картинку</span>
//                         <input type="file" accept="image/*" onChange={handleFileChange}/>
//                     </label>
//                     {selectedFile && (
//                         <p className="uploaded-file-name">Вы выбрали: {selectedFile.name}</p>
//                     )}
//                     <div className="btns">
//                         <button onClick={handleEdit}>СОХРАНИТЬ</button>
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// }

export default AdminUsefulServicesPage;
