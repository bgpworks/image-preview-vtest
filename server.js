const express = require("express");
const resize = require("./resize");
const server = express();
const cors = require("cors");
const db = require("node-localdb");
const user = db("data/user.json");
const fs = require("fs");
const potrace = require("potrace");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(`${__dirname}/client/public/assets/images/`));
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

server.use(cors(corsOptions));

// 사용자가 보내온 이미지 패쓰를 가져온다.
server.post("/sendImage", (req, res) => {
  // 이미지는  하나씩만 유지할 것이므로 기존에 가지고 있는 디비 삭제
  user.remove({}).then(function (u) {
    console.log(u);
  });

  // 입력된 이미지 주소를 로컬 디비에 저장
  user.insert({ img: req.body.imgPath }).then(function (x) {
    console.log(x);
  });

  // 일단 성공 리스판스 보냄
  // 아직 에러 케이스 anmandum
  res.send("success");
});

//potrace test api
server.post("/test", (req, res) => {
  // var params = {
  //   background: "#49ffd2",
  //   color: "blue",
  //   threshold: 120,
  // };
  var trace = new potrace.Potrace(req.body.params);

  user.find({}).then(function (x) {
    trace.loadImage(`./client/public/assets/images/${x[0].img}`, function (
      err
    ) {
      if (err) throw err;
      user.insert({ path: trace.getSVG() }).then(function (x) {
        console.log(x);
      });
      res.end();
    });
  });
});

// 변경 된 이미지를 보여주   주소
server.get("/", (req, res) => {
  // 로컬 디비에 저장된 이미지 패스를 찾는다.
  user.find({}).then(function (x) {
    res.send(x[1].path);
  });
});

server.listen(8005, () => {
  console.log("Server started!");
});

// 서버 스토리
// 사용자가 보내온 이미지 패쓰를 가져온다.
// 사용자가 보내온 이미지 패쓰를 화면에 뿌려준다.

// 콤보박스에서 선택된 인자는 노드 스트림을 통해 전송 버튼 없이 실시간으로 받아온다. (option stream)
// 받아온 인자를 가지고 해당되는 라이브러리 인수에 대입해 준다.
// 원하는 값이 적용된 이미지가 리사이징 되어 화면에 보여준다.

// 최종 -  nodeStream을 통해 interactive한 라이브러리를 만드는 것
