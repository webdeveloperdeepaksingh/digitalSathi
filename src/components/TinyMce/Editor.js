'use client';
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

export default function TextEditor({handleEditorChange, initialValue}) {

  const editorRef = useRef(null);

  return (
    <>
    <Editor
      id='fixed_id'
      apiKey='f6vdi67pzdou3z6qb7ilstl75q6w2g864dnvtht05urju7zi'
      initialValue={initialValue}
      init={{
        height: 500,
        menubar: false,
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      }}
      onEditorChange={(newContent, editor) => {
        editorRef.current = editor;
        handleEditorChange(newContent);
      }}
    />
   </>
  );
}
  


    

