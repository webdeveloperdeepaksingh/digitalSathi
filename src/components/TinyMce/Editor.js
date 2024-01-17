'use client';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';


export default function TextEditor({handleEditorChange, value}) {

  const editorRef = useRef(null);
  //  const log = () => {
  //    if (editorRef.current) {
  //      console.log(editorRef.current.getContent());
  //    }
  //  };

  return (
    <>
    <Editor
      id='fixed_id'
      apiKey='f6vdi67pzdou3z6qb7ilstl75q6w2g864dnvtht05urju7zi'
      initialValue="<p>Heelo</p>"
      init={{
        height: 500,
        menubar: false,
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      }}
      value={value}
      onEditorChange={(newContent, editor) => {
        editorRef.current = editor;
        handleEditorChange(newContent);
      }}
    />
   </>
  );
}

// export default function TinyMce() {

//   const [content, setContent] = useState('');
//   const [desc, setDesc] = useState('');

//   const handleEditorChange = (newContent, editor) => {
//       setDesc(newContent);
//       setContent(editor.getContent('<p>Initial Content<p>'));
//   };

//   return (
//     <div>
//       <Editor
//         id='fixed_id'
//         apiKey='f6vdi67pzdou3z6qb7ilstl75q6w2g864dnvtht05urju7zi'
//         initialValue={content}
//         init={{
//         menubar: false,
//         plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
//         toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
//         }}
//         value={desc}
//         name='courseDesc'
//         onEditorChange={(newContent, editor) => handleEditorChange(newContent, editor)}
//         onInit={(evt, editor) => setContent(editor.getContent({ format: "text" }))}
//     />
//     </div>
//   )
// }

// onEditorChange={(newContent, editor) => handleEditorChange(newContent, editor)}
//                         onInit={(evt, editor) => setContent(editor.getContent({ format: "text" }))}




