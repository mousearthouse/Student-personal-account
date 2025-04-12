import { getUsefulServices } from '@/utils/api/requests/getUsefulServices';
import './usefulServicesPage.scss';
import { useState, useEffect, useCallback } from "react";
import { API_URL } from '@/utils/constants';
import Arrow from '@/assets/icons/arrow.svg'

const UsefulServicesPage = () => {
    const [servicesData, setServicesData] = useState({} as UsefulServiceDtoPagedListWithMetadata);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUsefulServices({
                    params: { "categories": "ForAll", "page": 1, "pageSize": 5 }
                });
                setServicesData(response.data);
                console.log(response.data);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };

        fetchProfile();
    }, []);

    return (
        <main>
            <div className='servicesContainer'>
            {(servicesData.results ?? []).map((serviceData, id) => (
                <ServiceCard key={id} service={serviceData} />
            ))}
            </div>
        </main>
    );
};
const ServiceCard = ({ service }: { service: UsefulServicesDto }) => {

    const getImageUrl = () => {
        return `${API_URL}Files/${service.logo.id}`;
    };

    return (
        <div className='serviceCard'>
            <div className='serviceCardTitle'>
                <h4>{service.title}</h4>
                {service.link &&
                <ServiceBtn url={service.link} />
                }
            </div>
            
            <div className='serviceCardDetails'>
                <img src={getImageUrl()} alt="Аватар" />
                <div>
                    <p>{service.description}</p>
                    <span>Условия предоставления</span>
                    <p>{service.termsOfDisctribution}</p>                    
                </div>


            </div>
        </div>
    )
}

const ServiceBtn = ({ url }: { url: string }) => {
    const href = () => {
        window.location.href = url;
    }

    const svgArrow = Arrow;
    return (
        <button className='serviceCardBtn' onClick={href}>
            Перейти на сайт
            <img className='arrow' src={svgArrow} alt="Arrow Icon" />
        </button>
        
    )
}

export default UsefulServicesPage;