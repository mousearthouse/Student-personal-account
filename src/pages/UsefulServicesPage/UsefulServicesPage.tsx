import { getUsefulServices } from '@/utils/api/requests/getUsefulServices';
import './usefulServicesPage.scss';
import { useState, useEffect, useTransition } from 'react';
import { API_URL } from '@/utils/constants/constants';
import Pagination from '@/components/Pagination/Pagination';
import ServiceBtn from '@/components/UsefulServiceBtn/ServiceBtn';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';
import { useTranslation } from 'react-i18next';

const UsefulServicesPage = () => {
    const [servicesData, setServicesData] = useState({} as UsefulServiceDtoPagedListWithMetadata);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const pageSize = 3;

    const navigate = useNavigate();

    const { t } = useTranslation();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const categories = new Set<UsefulServiceCategory>(['ForAll' as UsefulServiceCategory]);
                if (localStorage.getItem('is_student') == 'true') categories.add('Students' as UsefulServiceCategory);
                if (localStorage.getItem('is_employee') == 'true') categories.add('Employees' as UsefulServiceCategory);

                const response = await getUsefulServices(
                    {
                        params: {
                            categories: Array.from(categories),
                            page: pageNumber,
                            pageSize: pageSize,
                        }
                    },
                );
            
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
            <div className='usefulServicesPage'>
                <div>
                    <h1>{t('usefulServices.pageName')}</h1>
                </div>
                <div>
                    <span className='page-link' onClick={() => navigate('/')}>Главная / </span>
                    <span className='page-link-blue'>Полезные сервисы</span>
                </div>
                <div className="servicesContainer">
                    {(servicesData.results ?? []).map((serviceData, id) => (
                        <ServiceCard key={id} service={serviceData} />
                    ))}
                </div>
                <Pagination
                    currentPage={pageNumber}
                    pageCount={pageCount}
                    onPageChange={setPageNumber}
                />
            </div>
        </main>
    );
};

const ServiceCard = ({ service }: { service: UsefulServicesDto }) => {
    const getImageUrl = () => {
        return `${API_URL}Files/${service.logo.id}`;
    };

    const { t } = useTranslation();

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
                    <span>{t('usefulServices.termsOfDistribution')}</span>
                    <p>{service.termsOfDisctribution}</p>
                </div>
            </div>
        </div>
    );
};


export default UsefulServicesPage;
