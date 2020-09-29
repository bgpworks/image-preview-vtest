import React from "react";
import "./App.css";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

async function ApiCall(url, options) {
  let response = await fetch(url, {
    ...options,
  });
  let result = await response;
  return result;
}

function App() {
  const [state, setState] = React.useState({
    file: null,
    image: null,
    json: {},
    id: 0,
  });

  // 이미지 파일 업로드
  const getImgFile = (e) => {
    e.preventDefault();
    setState({
      ...state,
      image: null,
      file: e.target.files[0],
    });
  };

  // 이미지 파일 전송
  const uploadImgFile = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", state.file);
    let options = { method: "POST", body: formData };
    ApiCall("http://localhost:8005/sendImage", options)
      .then((data) => alert("업로드가 완료되었습니다."))
      .catch((err) => console.log(err.message));
  };

  // 이미지 미리보기
  const showPreview = (format) => {
    let options = { method: "GET" };
    ApiCall(`http://localhost:8005?format=${format ?? "png"}`, options)
      .then((data) => setState({ ...state, image: data.url }))
      .catch((err) => console.log(err.message));
  };

  // 이미지 핸들링에 전달 될 속성을 받아 상태에 저장한다.
  const imageHandling = (e) => {
    console.log(e);
    setState({ ...state, json: e });
  };

  // 이미지 파라미터값 전송
  const imageHandlingSubmit = (e) => {
    e.preventDefault();
    let options = {
      method: "POST",
      body: JSON.stringify(state.json),
      headers: { "Content-Type": "application/json" },
    };
    // 미리보기 태그만 렌더링 하기 위해 state.image에 미리보기 주소 새로 할당.
    setState({ ...state, image: "http://localhost:8005/" });
    ApiCall("http://localhost:8005/getAttr", options)
      .then((data) => showPreview("svg"))
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="container">
      {/* 페이지 제목 */}
      <h1>Image Preview Test</h1>

      <div>
        {/* 이미지 업로드 */}
        <label className="button">
          <input name="image" type="file" onChange={(e) => getImgFile(e)} />
        </label>

        {/* 이미지 업로드 전송 버튼 */}
        <button variant="outline" mr={2} onClick={(e) => uploadImgFile(e)}>
          이미지 업로드
        </button>
      </div>

      {/* 이미지 미리보기 창 */}
      <div className="imageSize">
        {` 
        1. 이미지 업로드 후 원본 이미지 보기를 누르면, 해당 영역에 이미지가 나타납니다. 
        2. json editor에 파라미터값을 입력 후 전송을 누르면, 해당 영역에 변경 값이 적용된 이미지가 나타납니다.
        3. 원본 이미지를 누르면 언제든 원본 이미지보기가 가능합니다.
        `}
        <img src={state.image} />
      </div>

      {/* preview button */}
      <button variant="outline" mr={2} onClick={() => showPreview("png")}>
        원본 이미지 보기
      </button>

      {/*  json editor library 사용*/}
      <div className="editor_container">
        <Editor
          value={state.json}
          onChange={imageHandling}
          ace={ace}
          theme="ace/theme/github"
        />
      </div>

      {/* 파라미터 전송 */}
      <button variant="outline" mr={2} onClick={(e) => imageHandlingSubmit(e)}>
        전송
      </button>
    </div>
  );
}

export default App;
