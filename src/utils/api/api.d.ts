type RequestParams<Params = undefined> = Params extends undefined
? { config?: RequestOptions }
: { params: Params; config?: RequestOptions };

interface UserLoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  loginSucceeded: true;
}

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


//////////////////////////////////////////////////////////////// Certificates


interface GetCertificatesParams {
  userType: 'Student' | 'Employee';
  ownerId: string;
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

interface CertificateCreateDto {
  type?: CertificateType;
  staffType?: CertificateStaffType;
  userType: CertificateUserType;
  educationEntryId?: string;
  employeePostId?: string;
  receiveType: CertificateReceiveType;
}


//////////////////////////////////////////////////////////////// Useful Services


type UsefulServiceCategory = 'ForAll' | 'Students' | 'Employees';

interface UsefulServicesParams {
  categories: UsefulServiceCategory;
  page: number;
  pageSize: number;
}

interface UsefulServicesDto {
  id: string;
  category: UsefulServiceCategory;
  title?: string;
  description?: string;
  link?: string;
  termsOfDisctribution: string;
  logo: FileDto;
}

interface PagedListMetaData {
  pageCount: number;
  totalItemCount: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstItemOnPage: number;
  lastItemOnPage: number;
}

interface UsefulServiceDtoPagedListWithMetadata {
  results: UsefulServicesDto[];
  metadata: PagedListMetaData;
}


//////////////////////////////////////////////////////////////// Events


interface GetEventsListParams {
  name?: string;
  eventDate?: Date;
  timezoneOffset?: number;
  page?: number;
  pageSize?: number;
}

type EventType = 'Open' | 'Close'

type EventFormat = 'Online' | 'Offline'

type EventAuditory = 'All' | 'Students' | 'Employees'

type EventStatus = 'Draft' | 'Actual' | 'Finished' | 'Archive'

interface EventShortDto {
  id: string;
  title?: string;
  description?: string;
  picture: FileDto;
  isTimeFromNeeded: boolean;
  dateTimeFrom?: string;
  isTimeToNeeded: boolean;
  dateTimeTo?: string;
  type: EventType;
  format: EventFormat;
  auditory: EventAuditory;
  status: EventStatus;

}

interface EventShortDtoPagedListWithMetadata {
  results?: EventShortDto[];
  metaData: PagedListMetaData;
}

interface UserShortDto {
  id: string;
  lastName?: string;
  firstName?: string;
  patronymic?: string;
  birthDate: string;
  gender: Gender;
  email?: string;
  avatar: FileDto;
}

type EventParticipantType = 'Inner' | 'External'

interface EventParticipantDto {
  id: string;
  user: UserShortDto;
  email?: string;
  name?: string;
  phone?: string;
  additionalInfo?: string;
  participantType: EventParticipantType;
}

interface EventDto {
  id: string;
  title?: string;
  description?: string;
  picture: FileDto;
  isTimeFromNeeded: boolean;
  dateTimeFrom?: string;
  isTimeToNeeded: boolean;
  dateTimeTo?: string;
  type: EventType;
  format: EventFormat;
  auditory: EventAuditory;
  status: EventStatus;
  link?: string;
  addressName?: string;
  latitude?: number;
  longitude?: number;
  isRegistrationRequired: boolean;
  registrationLastDate?: string;
  isDigestNeeded: boolean;
  notificationText?: string;
  digestNeeded?: string;
  author: UserShortDto;
  participants?: EventParticipantDto[]
}

interface GetEventDetailsParams {
  id: string;
}