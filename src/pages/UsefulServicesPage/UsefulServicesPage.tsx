import { getUsefulServices } from '@/utils/api/requests/getUsefulServices';
import './usefulServicesPage.scss';
import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '@/utils/constants/constants';
import Arrow from '@/assets/icons/arrow.svg';
import Pagination from '@/components/Pagination/Pagination';

const UsefulServicesPage = () => {
    const [servicesData, setServicesData] = useState({} as UsefulServiceDtoPagedListWithMetadata);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const pageSize = 5;

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
                //setPageCount(response.data.metadata.pageCount);
                console.log(response.data);
            } catch (err) {
                console.log('Что-то пошло не так при получении списка серверов :( ', err);
            }
        };

        fetchServices();
    }, [pageNumber]);

    return (
        <main>
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
        </main>
    );
};
const ServiceCard = ({ service }: { service: UsefulServicesDto }) => {
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
};

const ServiceBtn = ({ url }: { url: string }) => {
    const href = () => {
        window.location.href = url;
    };

    const svgArrow = Arrow;
    return (
        <button className="serviceCardBtn" onClick={href}>
            Перейти на сайт
            <img className="arrow" src={svgArrow} alt="Arrow Icon" />
        </button>
    );
};

export default UsefulServicesPage;
