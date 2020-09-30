import React from "react";
import "./App.css";
import { description } from "./description";

async function ApiCall(url, options) {
  let response = await fetch(url, {
    ...options,
  });
  let result = await response.json();
  return result;
}

const settingDefault = {
  color: `lightgray`,
  optTolerance: 0.4,
  turdSize: 100,
  turnPolicy: "black",
};

const API_URL = "http://localhost:8005/";

function App() {
  const [state, setState] = React.useState({
    file: null,
    imagePath: null,
    imageName: "",
    disabledBox: true,
    selectValue: "turnPolicy",
    params: { key: "turnPolicy", value: "" },
    paramsList: {
      color: `lightgray`,
      optTolerance: 0.4,
      turdSize: 100,
      turnPolicy: "black",
    },
  });

  // 이미지 파일 업로드
  const getImgFile = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    let options = { method: "POST", body: formData };
    ApiCall(`${API_URL}sendImage`, options)
      .then(
        (data) => (
          imageHandlingSubmit(settingDefault),
          setState({
            ...state,
            file: file,
            imageName: file.name,
          })
        ),
      )
      .catch((err) => console.log(err.message));
  };
  // 이미지 파라미터값 전송
  const imageHandlingSubmit = (params) => {
    let options = {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json" },
    };

    ApiCall(`${API_URL}getAttr`, options)
      .then((data) =>
        setState((state) => ({
          ...state,
          disabledBox: false,
          imagePath: data.image,
        })),
      )
      .catch((err) => console.log(err.message));
  };

  // 이미지 파라미터 콤보 박스
  const changeSelect = (e) => {
    setState({
      ...state,
      selectValue: e.target.value,
      params: { ...state.params, key: e.target.value },
    });
  };
  // 콤보박스 & 인풋 값 온체인지 이벤트
  const getValue = (e) => {
    setState({
      ...state,
      params: { ...state.params, value: e.target.value },
    });
    // 인풋 값 boolean / number 체크
    let typeCheck = isNaN(e.target.value)
      ? e.target.value === "true" || e.target.value === "false"
        ? JSON.parse(e.target.value)
        : e.target.value
      : parseInt(e.target.value);

    let key = state.params.key;
    let parsingJson = {
      [key]: typeCheck,
    };
    let changedObject = Object.assign(state.paramsList, parsingJson);
    setState({ ...state, paramsList: changedObject });
    imageHandlingSubmit(changedObject);
  };
  // 설정 된 이미지 설정 값 삭제
  const deleteParam = (e, key) => {
    e.preventDefault();
    delete state.paramsList[key.toString()];
    setState({ ...state, paramsList: state.paramsList });
    imageHandlingSubmit(state.paramsList);
  };
  // 설정 되돌리기
  const goBackSetting = (e) => {
    let changedObject = Object.assign(settingDefault);
    setState({
      ...state,
      paramsList: changedObject,
      params: { key: "turnPolicy", value: "" },
      selectValue: "turnPolicy",
    });
    imageHandlingSubmit(settingDefault);
  };
  //  복사
  const copy = (e) => {
    const el = document.createElement("textarea");
    el.value = JSON.stringify(state.paramsList);
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 9999);
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  return (
    <div className="container">
      {/* 페이지 제목 */}
      <h1> Image Preview Test </h1>
      <div className="file_container">
        {/* 이미지 업로드 */}
        <div className="filebox bs3-primary">
          <input
            className="upload-name"
            value={state.imageName}
            disabled={true}
          />
          <label htmlFor="filename">파일 찾기</label>
          <input
            type="file"
            id="filename"
            className="upload-hidden"
            onChange={(e) => getImgFile(e)}
          />
        </div>
        <button onClick={(e) => goBackSetting(e)}>설정 되돌리기</button>
      </div>
      {/* 이미지 미리보기 */}
      <div className="preview_container">
        <div className="image_preview">
          <div
            className={`image_preview_description ${
              state.imagePath ? "hide" : "show"
            }`}
          >
            {` 
          1. 파일 찾기를 눌러 파일을 선택해 주세요. 
          2. 우측의 콤보박스를 이용해 원하는 파라미터를 선택 또는 입력 해주세요. 
          3. 모든 선택이 끝나면 해당 공간에 이미지 미리보기가 생성됩니다.
          `}
          </div>
          <div
            className="image_size"
            dangerouslySetInnerHTML={{ __html: state.imagePath }}
          />
        </div>
        {/* 콤보박스 */}
        <div className="parameter_contents_container">
          <div className="combo_title">
            * 선택 또는 입력된 파라미터의 값에 따라 이미지가 변경됩니다.
          </div>
          <div className="select_container">
            <select
              onChange={(e) => changeSelect(e)}
              value={state.selectValue}
              disabled={state.disabledBox}
            >
              {Object.keys(description).map((item) => (
                <option value={item} key={`${item}_key`}>
                  {item}
                </option>
              ))}
            </select>
            {description[state.selectValue].input ? (
              <input
                type="text"
                onChange={(e) => getValue(e)}
                disabled={state.disabledBox}
              ></input>
            ) : (
              <select
                onChange={(e) => getValue(e)}
                disabled={state.disabledBox}
              >
                {description[state.selectValue].options.map((item) => (
                  <option value={item} key={`${item}_value`}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* potrace parameters 설명 */}
          <div className="description_container">
            <span role="img" aria-label="light">
              &#128161;
            </span>
            tip :{description[state.selectValue].description}
          </div>
          {/* 선택 된 parameters list */}
          <div className={`${state.imagePath ? "show" : "hide"}`}>
            <div className="title_copy_container">
              <h2>설정된 파라미터 리스트</h2>
              <div className="copy" onClick={(e) => copy(e)}>
                <span role="img" aria-label="clipboard">
                  📋
                </span>
                copy
              </div>
            </div>
            <p>* 초기값은 gatsby기본값입니다.</p>
            <div className="params_container">
              {Object.keys(state.paramsList).map((key) => (
                <div className="params_items" key={`${key}_params`}>
                  {`${key} :  ${state.paramsList[key]}`}
                  <button onClick={(e) => deleteParam(e, key)}> 삭제 </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
