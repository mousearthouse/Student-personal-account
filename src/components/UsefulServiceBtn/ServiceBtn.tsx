import Arrow from '@/assets/icons/arrow.svg';
import './ServiceBtn.scss';

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

export default ServiceBtn;