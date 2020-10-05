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

const copyDefault = {
  color: `lightgray`,
  optTolerance: 0.4,
  turdSize: 100,
  turnPolicy: "TURNPOLICY_BLACK",
};

const API_URL = "http://localhost:8005/";

function App() {
  const [state, setState] = React.useState({
    file: null,
    imagePath: null,
    imageName: "",
    selectValue: "",
    background: { background: "" },
    params: { key: "turnPolicy", value: "", name: "" },
    paramsList: {
      color: `lightgray`,
      optTolerance: 0.4,
      turdSize: 100,
      turnPolicy: "black",
    },
    copyList: {
      color: `lightgray`,
      optTolerance: 0.4,
      turdSize: 100,
      turnPolicy: "TURNPOLICY_BLACK",
    },
  });

  // 이미지 파일 업로드
  const getImgFile = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    let options = { method: "POST", body: formData };
    setState({
      ...state,
      file: file,
      imageName: file.name,
    });
    ApiCall(`${API_URL}sendImage`, options)
      .then((data) => imageHandlingSubmit(settingDefault))
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
        }))
      )
      .catch((err) => console.log(err.message));
  };

  // 콤보박스 & 인풋 값 온체인지 이벤트
  const getValue = (e, keyVal) => {
    // 인풋 값이 빈값이면 deleteParam을 리턴
    let index = e.target.selectedIndex;
    let getValue = e.target.value;
    if (getValue === "") {
      return deleteParam(keyVal);
    }
    setState({
      ...state,
      params: { ...state.params, value: getValue },
    });
    // 인풋 값 boolean / number 체크
    let typeCheck = isNaN(getValue)
      ? getValue === "true" || getValue === "false"
        ? JSON.parse(getValue)
        : getValue
      : parseFloat(getValue);

    let key = keyVal;
    let parsingJson = {
      [key]: typeCheck,
    };
    let textValue = index === undefined ? typeCheck : e.target[index].text;
    let changedObject = Object.assign(state.paramsList, parsingJson);
    let changedCopyList = Object.assign(state.copyList, {
      [key]: textValue,
    });
    setState({
      ...state,
      paramsList: changedObject,
      copyList: changedCopyList,
    });
    imageHandlingSubmit(changedObject);
  };
  // 설정 된 이미지 설정 값 삭제
  const deleteParam = (key) => {
    delete state.paramsList[key.toString()];
    delete state.copyList[key.toString()];
    setState({
      ...state,
      paramsList: state.paramsList,
      copyList: state.copyList,
    });
    imageHandlingSubmit(state.paramsList);
  };
  // 설정 되돌리기
  const goBackSetting = (e) => {
    let changedObject = Object.assign(settingDefault);
    setState({
      ...state,
      paramsList: changedObject,
      params: { key: "turnPolicy", value: "" },
      selectValue: "",
      copyList: copyDefault,
    });
    imageHandlingSubmit(settingDefault);
  };

  // tip hide and show
  const isTip = (val) => {
    setState({
      ...state,
      selectValue: state.selectValue === val ? "" : val,
    });
  };
  const getBackgroundColor = (e) => {
    setState({
      ...state,
      background: { background: e.target.value },
    });
  };
  const showClass = state.imagePath ? "show" : "hide";
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
      </div>
      <div className={`background_container ${state.imagePath ? "" : "hide"}`}>
        배경색 넣기 :
        <input
          className={`background_input `}
          type="text"
          onChange={(e) => getBackgroundColor(e)}
        />
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
          2. 해당 공간에 이미지 미리보기가 생성됩니다.
          3. 미리보기 생성 후, 우측의 콤보박스를 이용해 원하는 파라미터를 선택 또는 입력 해주세요. 
          `}
          </div>
          <div
            className={`image_size ${showClass}`}
            style={state.background}
            dangerouslySetInnerHTML={{ __html: state.imagePath }}
          />
          <div className={`params_items ${showClass}`}>
            {Object.keys(state.copyList).map((key) => (
              <div key={`${key}_params`}>
                {`${key} :  ${
                  key === "color" || key === "background"
                    ? `"${state.copyList[key]}"`
                    : state.copyList[key]
                }`}
              </div>
            ))}
          </div>
        </div>
        {/* 콤보박스 */}
        <div className="parameter_contents_container">
          <div className={`combo_title ${showClass}`}>
            * 선택 또는 입력된 파라미터의 값에 따라 이미지가 변경됩니다. 빈 값일
            경우 potrace default값으로 자동 적용됩니다. Gatsby기본값으로 변경을
            원하시면 하단의 설정되돌리기 버튼을 클릭해 주세요.
          </div>
          <div className={`parameters_list ${showClass}`}>
            {Object.keys(description).map((item) => (
              <div className={`parameter_container ${showClass}`} key={item}>
                <div className="default_container">
                  {description[item].default ?? ""}
                </div>
                <div className="select_container">
                  <div className="select_title">{item} :</div>
                  <div className="select_container">
                    {description[item].input ? (
                      <input
                        type="text"
                        onChange={(e) => getValue(e, item)}
                      ></input>
                    ) : (
                      <select onChange={(e) => getValue(e, item)}>
                        {description[item].options.map((val) => (
                          <option
                            value={val.value}
                            name={val.name}
                            key={`${val.name}_value`}
                          >
                            {val.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <button className="tips" onClick={() => isTip(item)}>
                      {state.selectValue === item.toString()
                        ? "팁 닫기"
                        : "팁 보기"}
                    </button>
                  </div>
                </div>
                <div className="description_container">
                  <div
                    className={`hide ${
                      state.selectValue === item.toString()
                        ? "show tooltips"
                        : ""
                    } `}
                  >
                    <span role="img" aria-label="light">
                      &#128161; tip :
                    </span>
                    {description[item].description}
                  </div>
                  <div className="range_container">
                    {description[item].range ?? ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 선택 된 parameters list */}
          <div className={` ${showClass}`}>
            <p>* 초기값은 gatsby기본값입니다.</p>
            <button onClick={(e) => goBackSetting(e)}>설정 되돌리기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
