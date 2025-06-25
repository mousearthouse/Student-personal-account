import { useEffect, useRef, useState } from "react";
import "./avatarUploader.scss";
import { getImageUrl } from "@/utils/usefulFunctions";
import { editProfilePhoto } from "@/utils/api/requests/editProfilePhoto";
import { handleUpload } from "@/utils/api/requests/postFile";
import { error } from "console";

interface AvatarUploaderProps {
  currentFileId: string;
}

const AvatarUploader = ({ currentFileId }: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileId, setFileId] = useState(currentFileId);

  useEffect (() => {
    setFileId(currentFileId);
  }, [currentFileId])

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file.name);
      try {
        const result = await handleUpload(file);
        if (result?.status === 200) {
            const newFileId = result.data.id;
            setFileId(newFileId);
            const response = await editProfilePhoto({ fileId: newFileId });
            console.log(response)
        }
        
      } catch (error) {
        console.error("чето не так!", error)
      }
    }
  };

  return (
    <div className="avatar-uploader" onClick={handleClick}>
        <img src={getImageUrl(fileId)} alt='avatar' />
      <div className="avatar-overlay">Изменить фото</div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="avatar-input"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default AvatarUploader;