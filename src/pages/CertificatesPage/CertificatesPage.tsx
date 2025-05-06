import { getCertificates } from "@/utils/api/requests/getCertificates";
import { getEmployee } from "@/utils/api/requests/getEmployee";
import { getStudent } from "@/utils/api/requests/getStudent";
import { useEffect, useState } from "react";
import "./certificatesPage.scss"

const CertificatesPage = () => {

    const [certificatesData, setCertificatesData] = useState<CertificateDto[]>();
    const [studentData, setStudentData] = useState<StudentDto>();
    const [employeeData, setEmployeeData] = useState<EmployeeDto>();
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await getStudent();
                console.log(response.data)
                setStudentData(response.data);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };

        const fetchEmployee = async () => {
            try {
                const response = await getEmployee();
                console.log(response.data)
                setEmployeeData(response.data);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };

        fetchStudent();
        fetchEmployee();

        const fetchCertificates = async () => {
            if (studentData) {
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

            if (employeeData) {
                console.log('щас получим емплоуии дату');
                try {
                console.log(employeeData!.id);
                const response = await getCertificates({
                    params: {
                        userType: 'Employee',
                        ownerId: employeeData?.id!,
                    }
                });
                console.log(response.data);
                } catch (err) {
                    console.log('сломалось получение ЕМПЛОУИИ даты!', err);
                }
            }
        };
    
        fetchCertificates();
    }, []);

    console.log(certificatesData)
        
    return (
        <div className="certificates-container">
            <h1>Заказ справки</h1>
            <div className="certificates-box">
                <h2>Справки</h2>
                <div className="certificates-list">
                    {certificatesData?.map((certificate, id) => (
                        <div key={id} className="certificate-item">
                            <h3>Справка от</h3> <span>{certificate.dateOfForming}</span>
                            <p>Тип справки: {certificate.type}</p>
                            <p>Вид справки:{certificate.receiveType}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CertificatesPage;