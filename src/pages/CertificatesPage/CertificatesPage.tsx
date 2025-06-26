import { getCertificates } from '@/utils/api/requests/getCertificates';
import { getEmployee } from '@/utils/api/requests/getEmployee';
import { getStudent } from '@/utils/api/requests/getStudent';
import { postCertificate } from '@/utils/api/requests/postCertificate';
import { useEffect, useState } from 'react';
import './certificatesPage.scss';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { getImageUrl } from '@/utils/usefulFunctions';
import download_white from '@/assets/icons/download_white.svg'
import download_blue from '@/assets/icons/download_blue.svg'


const CertificatesPage = () => {
    const { t } = useTranslation();

    const [certificatesData, setCertificatesData] = useState<CertificateDto[]>();
    const [studentData, setStudentData] = useState<StudentDto>();
    const [employeeData, setEmployeeData] = useState<EmployeeDto>();

    const [selected, setSelected] = useState<'student' | 'employee' | null>(null);
    const [selectedEducationEntryId, setSelectedEducationEntryId] = useState<string | null>(null);
    const [selectedEmployeePostId, setSelectedEmployeePostId] = useState<string | null>(null);

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
            console.log(employee);
            if (student && student.educationEntries && student.educationEntries.length > 0) {
                setSelected('student');
                setSelectedEducationEntryId(student.educationEntries[0].id)
            } else if (employee && employee.experience?.length > 0) {
                setSelected('employee');
                setSelectedEmployeePostId(employee.posts[0].id)
            } else {
                console.warn('Нет ни студента, ни сотрудника');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const load = async () => {
            if (selected === 'student' && studentData && selectedEducationEntryId) {
                await fetchCertificates({ studentData, selectedEducationEntryId });
            } else if (selected === 'employee' && employeeData && selectedEmployeePostId) {
                await fetchCertificates({ employeeData, selectedEmployeePostId });
            }
        };

        load();
    }, [selected, studentData, employeeData, selectedEducationEntryId, selectedEmployeePostId]);

    const fetchCertificates = async ({
        studentData,
        employeeData,
        selectedEducationEntryId,
        selectedEmployeePostId,
    }: {
        studentData?: StudentDto;
        employeeData?: EmployeeDto;
        selectedEducationEntryId?: string;
        selectedEmployeePostId?: string;
    }) => {
        if (studentData && selectedEducationEntryId) {
            console.log('Запрашиваем справки для:', {
                selected,
                selectedEducationEntryId,
            });
            try {
                const response = await getCertificates({
                    params: {
                        userType: 'Student',
                        ownerId: selectedEducationEntryId,
                    },
                });
                setCertificatesData(response.data);
            } catch (err) {
                console.log('ошибка при получении справок студента', err);
            }
        }

        if (employeeData && selectedEmployeePostId) {
            console.log('Запрашиваем справки для:', {
                selected,
                selectedEmployeePostId,
            });
            try {
                const response = await getCertificates({
                    params: {
                        userType: 'Employee',
                        ownerId: selectedEmployeePostId,
                    },
                });
                setCertificatesData(response.data);
            } catch (err) {
                console.log('ошибка при получении справок сотрудника', err);
            }
        }
    };

    const downloadCertificate = (certificateId: string) => {
        const fileUrl = getImageUrl(certificateId); 
        
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `certificate-${certificateId}.pdf`;
        
        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
    };


    return (
        <main>
            <div className="certificates">
                <div className="menu">
                    <h2>Заказ справки</h2>
                    {studentData && employeeData && (
                        <div className="buttons-container">
                            <button
                                className={`menu-item ${selected === 'student' ? 'active' : ''}`}
                                onClick={() => setSelected('student')}
                            >
                                Студент
                            </button>
                            <hr />
                            <button
                                className={`menu-item ${selected === 'employee' ? 'active' : ''}`}
                                onClick={() => setSelected('employee')}
                            >
                                Сотрудник
                            </button>
                        </div>
                    )}
                </div>
                <div className="certificates-container">
                    {studentData?.educationEntries && selected == 'student' && (
                        <EducationTabs
                            educationEntries={studentData?.educationEntries || []}
                            selectedId={selectedEducationEntryId}
                            onSelect={setSelectedEducationEntryId}
                        />
                    )}
                    {employeeData?.posts && selected == 'employee' && (
                        <EmployeeTabs
                            employeeEntries={employeeData?.posts || []}
                            selectedId={selectedEmployeePostId}
                            onSelect={setSelectedEmployeePostId}
                        />
                    )}
                    <OrderForm
                        selected={selected}
                        educationEntryId={selectedEducationEntryId || undefined}
                        postId={selectedEmployeePostId || undefined}
                    />
                    <div className="certificates-box">
                        <div className="certificates-list">
                            {certificatesData?.map((certificate, id) => (
                                <>
                                    <div key={id} className="certificate-item">
                                        <div className='certs-info'>
                                            <p>
                                                Справка от{' '}
                                                {certificate.dateOfForming
                                                    ? new Date(certificate.dateOfForming).toLocaleString(
                                                        'ru-RU'
                                                    )
                                                    : t('certificate.noDate')}
                                            </p>
                                            {certificate.staffType &&
                                            <span>
                                                {t('certificate.type')}:{" "}
                                                {t(`certificate.types.${certificate.staffType}`)}{" "}
                                            </span>
                                            }
                                            {certificate.type &&
                                            <span>
                                                {t('certificate.type')}:{" "}
                                                {t(`certificate.types.${certificate.type}`)}{" "}
                                            </span>
                                            }
                                            <span>
                                                {t('certificate.dateTimeOfForming')}:{" "}
                                                {certificate.dateOfForming
                                                    ? new Date(certificate.dateOfForming).toLocaleString(
                                                        'ru-RU'
                                                    )
                                                    : t('certificate.noDate')}
                                            </span>
                                            <span>
                                                {t('certificate.form')}:{" "}
                                                {t(`certificate.receiveTypes.${certificate.receiveType}`)}
                                            </span>
                                        </div>
                                        <div className='certs-btns'>
                                            <div className={`certificate-status ${certificate.status}`}>
                                                {certificate.status}
                                            </div>
                                            {certificate.status == 'Finished' && 
                                                <>
                                                    <div className='download-certs certificate' onClick={() => downloadCertificate(certificate.certificateFile.id)}>
                                                        <img src={download_white} /> Справку
                                                    </div>
                                                    <div className='download-certs signature' onClick={() => downloadCertificate(certificate.signatureFile.id)}>
                                                        <img src={download_blue} /> Подпись
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        
                                    </div>
                                    <hr />
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

const OrderForm = ({
    selected,
    educationEntryId,
    postId,
}: {
    selected: 'student' | 'employee' | null;
    educationEntryId?: string;
    postId?: string;
}) => {
    const [certificateType, setCertificateType] = useState<CertificateType>('ForPlaceWhereNeeded');
    const [receiveType, setReceiveType] = useState<CertificateReceiveType>('Electronic');
    const [staffType, setStaffType] = useState<CertificateStaffType>('ForPlaceOfWork');

    const handleOrder = async () => {
        let certificateData: CertificateCreateDto | null = null;

        if (selected === 'student') {
            certificateData = {
                type: certificateType,
                userType: 'Student',
                educationEntryId: educationEntryId,
                receiveType: receiveType,
            };
        } else if (selected === 'employee') {
            certificateData = {
                staffType: staffType,
                userType: 'Employee',
                employeePostId: postId,
                receiveType: receiveType,
            };
        }

        if (!certificateData) {
            console.warn('Нет данных для отправки');
            return;
        }

        try {
            console.log(certificateData);
            await postCertificate(certificateData);
            console.log('Справка успешно заказана');
        } catch (error) {
            const err = error as AxiosError;
            console.error('Ошибка при заказе справки:', err);
        }
    };

    return (
        <div className="order">
            <h2>Заказать справку</h2>
            <div className="order-form">
                {selected === 'student' && (
                    <select
                        id="select-cert-type"
                        value={certificateType}
                        onChange={(e) => setCertificateType(e.target.value as CertificateType)}
                        className="dropdown"
                    >
                        <option value="ForPlaceWhereNeeded">По месту требования</option>
                        <option value="PensionForKazakhstan">В пенсионный фонд Казахстана</option>
                    </select>
                )}
                {selected === 'employee' && (
                    <select
                        id="select-staff-type"
                        value={staffType}
                        onChange={(e) => setStaffType(e.target.value as CertificateStaffType)}
                        className="dropdown"
                    >
                        <option value="ForPlaceOfWork">По месту работы</option>
                        <option value="ForOther">Для других целей</option>
                    </select>
                )}
                <select
                    id="select-receive-type"
                    value={receiveType}
                    onChange={(e) => setReceiveType(e.target.value as CertificateReceiveType)}
                    className="dropdown"
                >
                    <option value="Electronic">Электронная</option>
                    <option value="Paper">Бумажная</option>
                </select>

                <button className="order-button" onClick={handleOrder}>
                    Заказать
                </button>
            </div>
        </div>
    );
};

type EducationTabsProps = {
    educationEntries: EducationEntryDto[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

const EducationTabs = ({ educationEntries, selectedId, onSelect }: EducationTabsProps) => {
    const { t } = useTranslation();
    console.log(selectedId);
    const selectedEntry = educationEntries.find((entry) => entry.id === selectedId);

    if (!educationEntries?.length) return null;

    return (
        <div className="tabs">
            <div className="tab-buttons">
                {educationEntries.map((entry) => (
                    <button
                        key={entry.id}
                        className={`tab-button ${entry.id === selectedId ? 'active' : ''}`}
                        onClick={() => onSelect(entry.id)}
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
                            <span className="block-value">
                                {selectedEntry?.educationLevel.name}
                            </span>
                        </div>
                        <div className="block-education-row2">
                            <span className="block-label">{t('certificates.status')}</span>
                            <span className="block-value">
                                {selectedEntry?.educationStatus.name}
                            </span>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="tab-content">
                    <div className="row">
                        <div className="block-education-row1">
                            <span className="block-label">{t('certificates.faculty')}</span>
                            <span className="block-value">{selectedEntry?.faculty.name}</span>
                        </div>
                    </div>
                </div>
                <hr />

                <div className="tab-content">
                    <div className="row">
                        <div className="block-education-row1">
                            <span className="block-label">{t('certificates.direction')}</span>
                            <span className="block-value">
                                {selectedEntry?.educationDirection.name}
                            </span>
                        </div>
                        <div className="block-education-row2">
                            <span className="block-label">{t('certificates.group')}</span>
                            <span className="block-value">{selectedEntry?.group.name}</span>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
};

type EmployeeTabsProps = {
    employeeEntries: EmployeePostDto[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

const EmployeeTabs = ({ employeeEntries, selectedId, onSelect }: EmployeeTabsProps) => {
    const { t } = useTranslation();
    const selectedEntry = employeeEntries.find((entry) => entry.id === selectedId);
    console.log(selectedId);

    const employmentTypeMap = {
        MainPlace: t('employmentTypes.main'),
        PartTime: t('employmentTypes.partTime'),
        InnerPartTime: t('employmentTypes.innerPartTime'),
        Freelance: t('employmentTypes.freelance'),
    };

    if (!employeeEntries?.length) return <h3>Справок нет!</h3>;
    return (
        <div className="tabs">
            <div className="tab-buttons">
                {employeeEntries.map((entry) => (
                    <button
                        key={entry.id}
                        className={`tab-button ${entry.id === selectedId ? 'active' : ''}`}
                        onClick={() => onSelect(entry.id)}
                    >
                        <div className="tab-title">{entry.postName.name}</div>
                        <div className="tab-subtitle">
                            {employmentTypeMap[entry.employmentType]} <br />
                        </div>
                    </button>
                ))}
            </div>
            <div className="tab-content-wrapper">
                <div className="tab-content">
                    <div className="row">
                        <div className="block-education-row1">
                            <span className="block-label">{t('certificates.position')}</span>
                            <span className="block-value">
                                {selectedEntry?.postName.name}
                            </span>
                        </div>
                        <div className="block-education-row2">
                            <span className="block-label">{t('certificates.rate')}</span>
                            <span className="block-value">{selectedEntry?.rate}</span>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="tab-content">
                    <div className="row">
                        <div className="block-education-row1">
                            <span className="block-label">{t('certificates.workplace')}</span>
                            <span className="block-value">
                                {selectedEntry?.departments[0].name}
                            </span>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="tab-content">
                    <div className="row">
                        <div className="block-education-row1">
                            <span className="block-label">{t('certificates.jobType')}</span>
                            <span className="block-value">
                                {selectedEntry?.postType.name}
                            </span>
                        </div>
                        <div className="block-education-row2">
                            <span className="block-label">{t('certificates.employmentType')}</span>
                            <span className="block-value">
                                {selectedEntry?.employmentType ? employmentTypeMap[selectedEntry.employmentType] : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
};

export default CertificatesPage;
