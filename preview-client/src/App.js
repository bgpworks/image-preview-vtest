import React from 'react';
import {
  Heading,
  Button
} from 'rebass';
import './App.css';
import { ThemeProvider } from 'emotion-theming'
import preset from '@rebass/preset'
import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import LazyLoad from 'react-lazyload';


async function JsonMethod(url, data) {
  let response = await fetch(url, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: data
  })
  let result = await response.json();
  return result;
}
async function PostMethod(url, data) {
  let response = await fetch(url, {
    method: "POST",
    body: data
  })
  let result = await response.json();
  return result;
}

async function GetMethod(url) {
  let response = await fetch(url, {
    method: "GET",
  })
  let result = await response;
  return result;
}



function App() {
  const [state, setState] = React.useState({ file: null, image: null, json: {}, format: "png", inputs: [], valueArr: [], inputVal: { key: null, value: null }, id: 0 })

  // 이미지 파일 업로드
  const getImgFile = (e) => {
    e.preventDefault();
    let fileName = e.target.files[0].name;
    let len = fileName.length
    let format = fileName.substr(len - 3);

    setState({ ...state, image: null, file: e.target.files[0], format: format });
  }

  // 이미지 파일 전송
  const uploadImgFile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", state.file);

    PostMethod("http://localhost:8005/sendImage", formData)
      .then(data => alert(JSON.stringify(data.msg)))
      .catch(err => console.log(err.message));
  }

  // 이미지 미리보기
  const showPreview = (e, format) => {
    // e.preventDefault();

    console.log(format)
    GetMethod(`http://localhost:8005?format=${format ?? "png"}`)
      .then(data =>
        setState({ ...state, image: data.url })
      ).catch(err => console.log(err.message));
  }

  // 이미지 핸들링에 전달 될 속성을 받아 상태에 저장한다.
  const imageHandling = (e) => {
    console.log(e)
    setState({ ...state, json: e });
  }


  // 이미지 파라미터값 전송
  const imageHandlingSubmit = (e) => {
    e.preventDefault();
    setState({ ...state, image: "http://localhost:8005/?format=png" })
    JsonMethod("http://localhost:8005/getAttr", JSON.stringify(state.json))
      .then(data =>
        console.log("전송완료"),
        showPreview(e, "svg")
      ).catch(err => console.log(err.message));
  }


  return (
    <ThemeProvider theme={preset}>
      {/* 페이지 제목 */}
      <Heading
        fontSize={[5, 6, 7]}
        color='purple'>
        Image Preview Test
      </Heading>

      {/* 이미지 업로드 */}
      <input name="image" type="file" onChange={e => getImgFile(e)} />

      {/* 이미지 미리보기 창 */}
      <LazyLoad>
        <div><img src={state.image} /></div>
      </LazyLoad>
      {/* 이미지 업로드 전송 버튼 */}
      <Button variant='outline' mr={2} onClick={e => uploadImgFile(e)}>이미지 업로드</Button>

      {/* preview button */}
      <Button variant='outline' mr={2} onClick={e => showPreview(e)}>원본 이미지 보기</Button>

      {/*  json editor library 사용*/}
      <Editor
        value={state.json}
        onChange={imageHandling}
        ace={ace}
        theme="ace/theme/github"
      />

      {/* 파라미터 전송 */}
      <Button variant='outline' mr={2} onClick={e => imageHandlingSubmit(e)}>전송</Button>



    </ThemeProvider>
  );
}




export default App;



