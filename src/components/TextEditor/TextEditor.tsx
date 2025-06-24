import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export const TextEditor = ({ value, setValue }: { value: string; setValue: (value: string) => void }) => {
    
    const modules = {
        toolbar: [
        [{ 'font': ['Roboto'] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['code-block'],
        ['clean']
        ],
    };
    
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
        />
    );
}