const express = require("express");
const resize = require("./resize");
const server = express();
const cors = require("cors");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const potrace = require("potrace");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

server.use(cors(corsOptions));

server.use(express.static(`${__dirname}/public/tmp`));

server.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// express fileupload 라이브러리를 사용
// 사용자가 보낸 이미지를 임시 디렉토리에 저장한다.
server.post("/sendImage", (req, res) => {
  // 파일이 없으면 status 400을 리턴한다.
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400);
  }
  let uploadImg = req.files;
  let uploadImgName = req.files.image.name;
  let len = uploadImgName.length;

  // mv method를 이용하여 이미지 파일을 임시 저장한당.
  uploadImg.image.mv(
    `${__dirname}/tmp/megamiSoh.${uploadImgName.substr(len - 3)}`,
    function (err) {
      if (err) return res.status(500).send(err);
      res.send({ msg: "업로드가 완료 되었습니다." });
    }
  );
});

// 스트림에 업로드한 이미지 주소를 전달 받는다.
function imageTransform(path) {
  const readStream = fs.createReadStream(path);
  return readStream;
}

// 이미지의 파라미터 값을 받는다.
server.post("/getAttr", (req, res) => {
  // 파라미터값을 potrace에 전달하여 이미지를 변경한다.
  var trace = new potrace.Potrace(req.body);
  trace.loadImage(`${__dirname}/tmp/megamiSoh.png`, function (err) {
    if (err) throw err;
    var check = trace.getSVG();
    res.type("image/svg+xml");
    // 변경된 이미지를 저장
    fs.writeFile(`${__dirname}/tmp/megamiSoh.svg`, check, (err) => {
      if (err) console.log(" fileSync : " + err);
      imageTransform(`${__dirname}/tmp/megamiSoh.svg`).pipe(res);
    });
  });
});

// 이미지 미리보기
server.get("/", (req, res) => {
  const format = req.query.format;
  if (format === "svg") {
    res.type("image/svg+xml");
  } else {
    res.type(`image/${format || "png"}`);
  }
  imageTransform(`${__dirname}/tmp/megamiSoh.${format || "png"}`).pipe(res);
});

server.listen(8005, () => {
  console.log("Server started!");
});

// 클라이언트에서 사용자가 이미지 파일을 업로드
// 서버에서 tmp로 이미지 임시 저장

// 클라이언트에서 이미지 파라미터 값을 보내옴
// 서버에 임시 저장된 이미지를 사용자 정의에 따라 변환함
