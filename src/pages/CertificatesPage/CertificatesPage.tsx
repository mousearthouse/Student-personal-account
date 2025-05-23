import { getCertificates } from "@/utils/api/requests/getCertificates";
import { getEmployee } from "@/utils/api/requests/getEmployee";
import { getStudent } from "@/utils/api/requests/getStudent";
import { useEffect, useState } from "react";
import "./certificatesPage.scss"
import { useTranslation } from "react-i18next";
import { AxiosError } from 'axios';

const CertificatesPage = () => {
    const { t } = useTranslation();
    
    const [certificatesData, setCertificatesData] = useState<CertificateDto[]>();
    const [studentData, setStudentData] = useState<StudentDto>();
    const [employeeData, setEmployeeData] = useState<EmployeeDto>();

    const [selected, setSelected] = useState<'student' | 'employee' | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            let student = null;
            let employee = null;

            try {
                const studentResponse = await getStudent();
                student = studentResponse.data;
                setStudentData(student);
                } catch (error) {
                    const err = error as AxiosError;

                    if (err.response?.status !== 404) {
                        console.error('Ошибка при получении студента', err);
                    } else {
                        console.log('Студент не найден — это нормально');
                    }
            }

        try {
            const employeeResponse = await getEmployee();
            employee = employeeResponse.data;
            setEmployeeData(employee);
            } catch (error) {
                const err = error as AxiosError;

                if (err.response?.status !== 404) {
                    console.error('Ошибка при получении студента', err);
                } else {
                    console.log('Студент не найден — это норм');
                }
            }

            if (student && student.educationEntries && student.educationEntries.length > 0) {
                setSelected('student');
            } else if (employee && employee.experience?.length > 0) {
                setSelected('employee');
            } else {
                console.warn('Нет ни студента, ни сотрудника');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const load = async () => {
            if (selected === 'student' && studentData) {
            await fetchCertificates({ studentData });
            } else if (selected === 'employee' && employeeData) {
                console.log(selected)
                await fetchCertificates({ employeeData });
            }
        };

        if (selected) {
            load();
        }
    }, [selected, studentData, employeeData]);

    
    const fetchCertificates = async ({ studentData, employeeData }: { studentData?: StudentDto; employeeData?: EmployeeDto }): Promise<void> => {
        console.log('ая запустился');
    
        if (studentData && selected == "student") {
            console.log('щас получим студент дату');
            try {
                console.log(studentData?.educationEntries?.[0]?.id);
                const response = await getCertificates({
                params: {
                    userType: 'Student',
                    ownerId: studentData?.educationEntries?.[0]?.id || '',
                }
                });
                console.log(response.data);
                setCertificatesData(response.data);
            } catch (err) {
                console.log('сломалось получение студент даты!', err);
            }
        }
    
        if (employeeData && selected == "employee") {
            console.log('щас получим емплоуии дату');
            try {
                console.log(employeeData.id);
                const response = await getCertificates({
                params: {
                    userType: 'Employee',
                    ownerId: employeeData.id,
                }
                });
                console.log(response.data);
                setCertificatesData(response.data);
            } catch (err) {
                console.log('сломалось получение ЕМПЛОУИИ даты!', err);
            }
        }
    };

    console.log(certificatesData)
        
    return (
        <main>
            <div className="certificates">
                <div className="menu">
                    <h2>Заказ справки</h2>
                {studentData && employeeData && (
                    <div className="buttons-container">
                        <button
                        className={`menu-item ${selected === 'student' ? 'active' : ''}`}
                        onClick={() => setSelected('student')}>
                            Студент
                        </button>
                        <hr/>
                        <button
                        className={`menu-item ${selected === 'employee' ? 'active' : ''}`}
                        onClick={() => setSelected('employee')}>
                            Сотрудник
                        </button>
                    </div>
                )}

                </div>
                <div className="certificates-container">
                    {studentData?.educationEntries && selected == "student" &&
                        <EducationTabs educationEntries={studentData?.educationEntries || []} />
                    }
                    {employeeData?.posts && selected == "employee" &&
                        <EmployeeTabs employeeEntries={employeeData?.posts || []} />
                    }
                    <OrderForm />
                    <div className="certificates-box">
                        <div className="certificates-list">
                            {certificatesData?.map((certificate, id) => (
                                <div key={id} className="certificate-item">
                                    <span>Справка от {certificate.dateOfForming ? (new Date(certificate.dateOfForming)).toLocaleString('ru-RU') : t('certificate.noDate')}</span>
                                    <p>{t('certificate.type')}: {t(`certificate.types.${certificate.type}`)}
                                    </p>
                                    <p>{t('certificate.form')}: {t(`certificate.receiveTypes.${certificate.receiveType}`)}</p>
                                <hr/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

const OrderForm = () => {
    const [certificateType, setCertificateType] = useState<string>('ForPlaceWhereNeeded');
    const [receiveType, setReceiveType] = useState<string>('Electronic');
    return (
        <div className="order-form">
            <h2>Заказать справку</h2>
            <select
                id="select-cert-type"
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
                className="dropdown"
            >
                <option value="ForPlaceWhereNeeded">По требованию</option>
                <option value="PensionForKazakhstan">КАЗАХСТАН</option>
            </select>
            <select
                id="select-receive-type"
                value={receiveType}
                onChange={(e) => setReceiveType(e.target.value)}
                className="dropdown"
            >
                <option value="Electronic">Электронный</option>
                <option value="Paper">Бумажный</option>
            </select>
        </div>
    )
}

const EducationTabs = ({ educationEntries }: { educationEntries: EducationEntryDto[] }) => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState(0);
  
    if (!educationEntries?.length) return null;
  
    return (
        <div className="education-tabs">
            <div className="tab-buttons">
                {educationEntries.map((entry, index) => (
                    <button
                    key={entry.id}
                    className={`tab-button ${index === selectedTab ? 'active' : ''}`}
                    onClick={() => setSelectedTab(index)}
                    >
                    <div className="tab-title">{entry.faculty.name}</div>
                    <div className="tab-subtitle">
                        {t('certificates.educationLevel')}: {entry.educationLevel.name} <br />
                        {t('certificates.status')}: {entry.educationStatus.name}
                    </div>
                    </button>
                ))}
            </div>
  
            <div className="tab-content-wrapper">
                <div className="tab-content">
                    <div className="row">
                        <div className="block-education-row1">
                            <span className="block-label">{t('certificates.educationLevel')}</span>
                            <span className="block-value">{educationEntries[selectedTab].educationLevel.name}</span>
                        </div>
                        <div className="block-education-row2">
                            <span className="block-label">{t('certificates.status')}</span>
                            <span className="block-value">{educationEntries[selectedTab].educationStatus.name}</span>
                        </div>
                    </div>
                
                        
                </div>
                <hr />
                <div className="tab-content">
                <div className="row">
                    <div className="block-education-row1">
                        <span className="block-label">{t('certificates.faculty')}</span>
                        <span className="block-value">{educationEntries[selectedTab].faculty.name}</span>
                    </div>
                </div>
                </div>
                <hr/>

                <div className="tab-content">
                    <div className="row">
                        <div className="block-education-row1">
                            <span className="block-label">{t('certificates.direction')}</span>
                            <span className="block-value">{educationEntries[selectedTab].educationDirection.name}</span>
                        </div>
                        <div className="block-education-row2">
                            <span className="block-label">{t('certificates.group')}</span>
                            <span className="block-value">{educationEntries[selectedTab].group.name}</span>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
};

const EmployeeTabs = ({ employeeEntries }: {employeeEntries: EmployeePostDto[] }) => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState(0);
  
    if (!employeeEntries?.length) return (
        <h3>Справок нет!</h3>
    );
    return (
        <div className="education-tabs">
            <div className="tab-buttons">
                {employeeEntries.map((entry, index) => (
                    <button
                    key={entry.id}
                    className={`tab-button ${index === selectedTab ? 'active' : ''}`}
                    onClick={() => setSelectedTab(index)}
                    >

                    </button>
                ))}
            </div>
        </div>
    )

}

export default CertificatesPage;