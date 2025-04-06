type RequestParams<Params = undefined> = Params extends undefined
? { config?: RequestOptions }
: { params: Params; config?: RequestOptions };

type Gender = 'NotDefined' | 'Male' | 'Female';
type FileExtension =  'NotDefined' | 'Doc' | 'Docx' | 'Bmp' | 'Gif' | 'Jpeg' | 'Jpg' | 'Png' | 'Pdf' | 'Rar' | 'Xls' | 'Xlsx' | 'Zip' | 'Txt' | 'Heic' | 'Heif' | 'Sig';

interface FileDto {
  id: string;
  name?: string;
  extension: FileExtension;
  size: number;
}

interface CountryDto {
  id: string;
  name: string;
  code: string;
}

type ContactTypes = 'Phone' | 'Email' | 'SocialMedia';

interface ContactDto {
  value: string;
  type: ContactTypes;
}

type UserType = 'Student' | 'Employee';

interface UserProfileDto {
  id: string;
  email?: string;
  lastName?: string;
  firstName?: string;
  patronymic?: string;
  birthDate: string;
  gender: Gender;
  avatar: FileDto;
  citizenship: CountryDto;
  address?: string;
  contacts?: ContactDto[];
  userTypes?: UserType[];
}

interface BaseDictionaryDto {
  id: string;
  name?: string;
}

interface EducationEntryDto {
  id: string;
  faculty: BaseDictionaryDto;
  group: BaseDictionaryDto;
  educationStatus: BaseDictionaryDto;
  educationBase: BaseDictionaryDto;
  educationDirection: BaseDictionaryDto;
  educationProfile: BaseDictionaryDto;
  educationQualification: BaseDictionaryDto;
  educationLevel: BaseDictionaryDto;
  educationForm: BaseDictionaryDto;
  educationYears: BaseDictionaryDto;
  creditBooknumber?: string;
  course: number;
  admissionYear: number;
}

interface StudentDto {
  id: string;
  educationEntries?: EducationEntryDto[];
}

interface ExperienceDto {
  id: string;
  years: number;
  months: number;
  type?: string;
}

interface DepartmentDto {
  id: string;
  name?: string;
  parentId?: string;
  email?: string;
}

type EmploymentTypes = 'MainPlace' | 'PartTime' | 'InnerPartTime' | 'Freelance';

interface EmployeePostDto {
  id: string;
  rate: number;
  departments: DepartmentDto[];
  postType: BaseDictionaryDto;
  postName: BaseDictionaryDto;
  dateStart?: string;
  dateEnd?: string;
  employmentType: EmploymentTypes;
}

interface EmployeeDto {
  id: string;
  experience: ExperienceDto[];
  posts: EmployeePostDto[];
}

type CertificateStatus = 'Created' | 'InProgress' | 'Finished';

interface EnumDto {
  value: number;
  name?: string;
  displayName?: string;
}

type CertificateType = 'ForPlaceWhereNeeded' | 'PensionForKazakhstan';

type CertificateStaffType = 'ForPlaceOfWork' | 'ForExperience' | 'ForVisa' | 'ForWorkBookCopy';

type CertificateUserType = 'Student' | 'Employee';

type CertificateReceiveType = 'Electronic' | 'Paper';

interface CertificateDto {
  id: string;
  statusEnumDto: EnumDto;
  type: CertificateType;
  staffType: CertificateStaffType;
  typeEnumDto: EnumDto;
  staffTypeEnumDto: EnumDto;
  userType: CertificateUserType;
  userTypeEnumDto: EnumDto;
  certificateFi;e: FileDto;
  signatureFile: FileDto;
  dateOfForming?: string;
  receiveType: CertificateReceiveType;
  receiveTypeEnumDto: EnumDto;
}