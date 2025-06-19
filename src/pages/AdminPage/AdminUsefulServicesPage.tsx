import { API_URL } from '@/utils/constants/constants';
import './adminPage.scss';
import { useNavigate } from "react-router-dom";
import ServiceBtn from '@/components/UsefulServiceBtn/ServiceBtn';
import { useEffect, useState } from 'react';
import { getUsefulServices } from '@/utils/api/requests/getUsefulServices';
import Pagination from '@/components/Pagination/Pagination';

const AdminUsefulServicesPage = () => {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const pageSize = 3;

    const [servicesData, setServicesData] = useState({} as UsefulServiceDtoPagedListWithMetadata);

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
                    <button>Добавить сервис</button>
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
        </main>
    );
}

const ServiceAdminCard = ({ service }: { service: UsefulServicesDto }) => {
    const getImageUrl = () => {
        return `${API_URL}Files/${service.logo.id}`;
    };

    return (
        <div className="serviceCard">
            <div className="serviceCardTitle">
                <h4>{service.title}</h4>
                {service.link && <ServiceBtn url={service.link} />}
            </div>

            <div className="serviceCardDetails">
                {service.logo?.id && <img src={getImageUrl()} alt="Аватар" />}
                <div>
                    <p>{service.description}</p>
                    <span>Условия предоставления</span>
                    <p>{service.termsOfDisctribution}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminUsefulServicesPage;
