import './profilePage.scss';
import { getProfile } from '@/utils/api/requests/getProfile';
import { getStudent } from '@/utils/api/requests/getStudent';
import { getEmployee } from '@/utils/api/requests/getEmployee';
import { API_URL } from '@/utils/constants/constants';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const ProfilePage = () => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<UserProfileDto>({} as UserProfileDto);
    const [studentData, setStudentData] = useState<StudentDto>({} as StudentDto);
    const [employeeData, setEmployeeData] = useState<EmployeeDto>({} as EmployeeDto);
    
    const [selected, setSelected] = useState<'student' | 'employee' | null>('student');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                console.log(response.data);
                setUserData(response.data);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('userAvatar', response.data.avatar.id);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };
        
        const fetchStudent = async () => {
            try {
                const response = await getStudent();
                console.log(response.data);
                setStudentData(response.data);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };

        const fetchWork = async () => {
            try {
                const response = await getEmployee();
                console.log(response.data);
                setEmployeeData(response.data);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };

        fetchProfile();
        fetchStudent();
        fetchWork();
    }, []);

    useEffect(() => {
        const load = async () => {
            if (selected === 'student' && studentData) {
            await setStudentData(studentData);
            } else if (selected === 'employee' && employeeData) {
                console.log(selected)
                await setEmployeeData(employeeData);
            }
        };

        if (selected) {
            load();
        }
    }, [selected, studentData, employeeData]);

    const getImageUrl = () => {
        return `${API_URL}Files/${userData.avatar.id}`;
    };

    return (
        <main>
            <div className='container'>
                <h1>{t('profile.title')}</h1>

                <div className='user-data-block'>
                    <div className='avatar-container'>
                    {userData.avatar && (
                        <img src={getImageUrl()} alt={t('profile.avatarAlt')} />
                    )}
                    </div>
                    <PersonalData userData={userData} />
                    <Contacts userData={userData} />
                </div>

                <div className='education-info-block'>
                    <h2>{userData.lastName} {userData.firstName} {userData.patronymic}</h2>

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
                    {selected === 'student' && studentData && (
                    <Education studentData={studentData} />
                    )}

                    {selected === 'employee' && employeeData && (
                    <Work employeeData={employeeData} />
                    )}
                </div>
            </div>
        </main>
    );
};

const PersonalData = ({ userData }: { userData: UserProfileDto }) => {
    const { t } = useTranslation();

    const validDate = (dateStr?: string) => {
        const date = dateStr ? new Date(dateStr) : null;
        return date ? format(date, 'dd.MM.yyyy') : t('common.noData');
    };

  return (
    <div className="block">
        <div className="block-row">
            <h3>{t('profile.personalData')}</h3>
        </div>
        <div className="block-content">
            {userData.contacts && (
            <div className="block-row">
                <span className="block-label">{t('profile.gender')}</span>
                <span className="block-value">{userData.gender}</span>
            </div>
            )}
            <hr />
            {userData.birthDate && (
            <div className="block-row">
                <span className="block-label">{t('profile.birthDate')}</span>
                <span className="block-value">{validDate(userData.birthDate)}</span>
            </div>
            )}
            <hr />
            {userData.citizenship && (
            <div className="block-row">
                <span className="block-label">{t('profile.citizenship')}</span>
                <span className="block-value">{userData.citizenship.name}</span>
            </div>
            )}
            <hr />
            {userData.email && (
            <div className="block-row">
                <span className="block-label">{t('profile.email')}</span>
                <span className="block-value">{userData.email}</span>
            </div>
            )}
            <hr />
        </div>
    </div>
  );
}

const Contacts = ({ userData }: { userData: UserProfileDto }) => {
    const { t } = useTranslation();
  
    return (
        <div className="block">
            <div className="block-row">
                <h3>{t('profile.contacts')}</h3>
                </div>
                <div className="block-content">
                {userData.contacts && (
                    <div className="block-row">
                    <span className="block-label">{t('profile.phone')}</span>
                    <span className="block-value">{}</span>
                    </div>
                )}
                <hr />
                {userData.email && (
                    <div className="block-row">
                    <span className="block-label">{t('profile.additionalEmail')}</span>
                    <span className="block-value">{userData.email}</span>
                    </div>
                )}
                <hr />
                {userData.address && (
                    <div className="block-row">
                    <span className="block-label">{t('profile.address')}</span>
                    <span className="block-value">{userData.address}</span>
                    </div>
                )}
                <hr />
            </div>
        </div>
    );
};

const Education = ({ studentData }: { studentData: StudentDto }) => {
    const { t } = useTranslation();

    const educationLevelMap: Record<string, string> = {
        'Бакалавриат': 'bachelor',
        'Магистратура': 'master'
    };

    const educationStatusMap: Record<string, string> = {
        'Является студентом': 'student',
        'Выпускник': 'graduate'
    };

    return (
        <div className="block">

            {(studentData.educationEntries ?? []).map((educationEntry, id) => (
                
            <div key={id}>
                <div className="container-row">
                    <div className="block-row1">
                        <span className="block-value">{t(`profile.education.${educationLevelMap[educationEntry.educationLevel.name ?? '']}`)}</span>
                    </div>
                    <div className="block-row2">
                        <span className="block-value">{t(`profile.education.studentStatus.${educationStatusMap[educationEntry.educationStatus.name ?? '']}`)}</span>
                    </div>
                </div>
                <div className="container-row">
                    <div className="block-row1">
                        <span className="block-label">{t('profile.education.studyYears')}</span>
                        <span className="block-value">{educationEntry.educationYears.name}</span>
                    </div>
                    <div className="block-row2">
                        <span className="block-label">{t('profile.education.recordBookNumber')}</span>
                        <span className="block-value">{educationEntry.creditBooknumber}</span>
                </div>
            </div>
            <hr />
            <div className="container-row">
                <div className="block-row1">
                    <span className="block-label">{t('profile.education.studyForm')}</span>
                    <span className="block-value">{educationEntry.educationForm.name}</span>
                </div>
                <div className="block-row2">
                    <span className="block-label">{t('profile.education.base')}</span>
                    <span className="block-value">{educationEntry.educationBase.name}</span>
                </div>
            </div>
            <hr />
            <div className="container-row">
                <div className="block-row1">
                    <span className="block-label">{t('profile.education.faculty')}</span>
                    <span className="block-value">{educationEntry.faculty.name}</span>
                </div>
            </div>
            <hr />
            <div className="container-row">
                <div className="block-row1">
                    <span className="block-label">{t('profile.education.direction')}</span>
                    <span className="block-value">{educationEntry.educationDirection.name}</span>
                </div>
            </div>
            <hr />
            <div className="container-row">
                <div>
                    <span className="block-label">{t('profile.education.profile')}</span>
                    <span className="block-value">{educationEntry.educationProfile.name}</span>
                </div>
            </div>
            <hr />
            <div className="container-row">
                <div className="block-row1">
                    <span className="block-label">{t('profile.education.course')}</span>
                    <span className="block-value">{educationEntry.course}</span>
                </div>
                <div className="block-row2">
                    <span className="block-label">{t('profile.education.group')}</span>
                    <span className="block-value">{educationEntry.group.name}</span>
                </div>
            </div>
        </div>
    ))}  
    </div>
    );
};

const Work = ({ employeeData }: { employeeData: EmployeeDto }) => {
    const { t } = useTranslation();

    const commonExperience = employeeData.experience?.find((e) => e.type === 'Common');
    const pedagogicalExperience = employeeData.experience?.find((e) => e.type === 'Pedagogical');

    const validDate = (dateStr?: string) => {
        const date = dateStr ? new Date(dateStr) : null;
        return date ? format(date, 'dd.MM.yyyy') : t('common.noData');
    };

    return (
        <div className="block">
            <div className='block-row'>
                <h4>{t('profile.work.experience')}</h4>
            </div>
                <div className="container-row">
                    
                    <div className="block-erow1">
                        <span className="block-label">{t('profile.work.totalExperience')}</span>
                        {commonExperience ? `${commonExperience.years} ${t('profile.work.years')} ${commonExperience.months} ${t('profile.work.months')}` : t('common.noData')}
                    </div>
                    <div className="block-row2">
                        <span className="block-label">{t('profile.work.pedagogicalExperience')}</span>
                        {pedagogicalExperience ? `${pedagogicalExperience.years} ${t('profile.work.years')} ${pedagogicalExperience.months} ${t('profile.work.months')}` : t('common.noData')}
                    </div>
                </div>

                {(employeeData.posts ?? []).map((post, id) => (
                    <div key={id}>
                        <div className="container-row">
                            <h3>{post.postName.name}</h3>
                            <div className="block-row1">
                                <span className="block-label">{t('profile.work.employmentType')}</span>
                                <span className="block-value">{t(`profile.work.employmentTypes.${post.employmentType ?? ''}`)}</span>
                            </div>
                            <div className="block-row2">
                                <span className="block-label">{t('profile.work.rate')}</span>
                                <span className="block-value">{post.rate}</span>
                            </div>
                        </div>
                        <hr/>
                        <div className="container-row">
                            <div className="block-row1">
                                <span className="block-label">{t('profile.work.workplace')}</span>
                                <span className="block-value">{post.departments[0].name}</span>
                            </div>
                        </div>
                        <hr/>
                        <div className="container-row">
                            <div className="block-row1">
                                <span className="block-label">{t('profile.work.jobType')}</span>
                                <span className="block-value">{post.postType.name}</span>
                            </div>
                        </div>
                        <hr/>
                        <div className="container-row">
                            <div className="block-row1">
                                <span className="block-label">{t('profile.work.hireDate')}</span>
                                <span className="block-value">{validDate(post.dateStart)}</span>
                            </div>
                            <div className="block-row2">
                                <span className="block-label">{t('profile.work.dismissalDate')}</span>
                                <span className="block-value">{validDate(post.dateEnd)}</span>
                            </div>
                        </div>
                        <hr/>
                        {/* где-то тут должна быть строчка с направлением для пед работников */}
                    </div>
                ))}
        </div>
    )
};

export default ProfilePage;