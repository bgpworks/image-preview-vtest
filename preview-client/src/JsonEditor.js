import React from "react";
import Ajv from "ajv";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";

// import "./styles.css";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

// const ajv = new Ajv({ allErrors: true, verbose: true });

const json = {
};


export default function EditorJson(props) {
    const json = {
    };
    const handleChange = v => {
        props.imageHandling(v)
      };
  return (
    <div>
      <Editor
        value={json}
        onChange={handleChange}
        ace={ace}
        theme="ace/theme/github"
      />
    </div>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
