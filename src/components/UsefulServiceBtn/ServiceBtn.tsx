import Arrow from '@/assets/icons/arrow.svg';
import './ServiceBtn.scss';
import { useTranslation } from 'react-i18next';

const ServiceBtn = ({ url }: { url: string }) => {

    const { t } = useTranslation();

    const href = () => {
        window.location.href = url;
    };

    const svgArrow = Arrow;
    return (
        <button className="serviceCardBtn" onClick={href}>
            {t('usefulServices.goToTheSite')}
            <img className="arrow" src={svgArrow} alt="Arrow Icon" />
        </button>
    );
};

export default ServiceBtn;