const express = require("express")
const resize = require("./resize")
const fs = require("fs");
const server = express()


server.post("/sendImage", (req, res) => {
    // Extract the query-parameter
    const widthString = req.query.width
    const heightString = req.query.height
    const format = req.query.format

    // Parse to integer if possible
    let width, height
    if (widthString) {
        width = parseInt(widthString)
    }
    if (heightString) {
        height = parseInt(heightString)
    }
    // Set the content-type of the response
    res.type(`image/${format || "png"}`)

    // Get the resized image
    resize("./download.png", format, width, height).pipe(res)

    console.log(req)
})

server.get("/", (req, res) => {
   
})

server.listen(8000, () => {
    console.log("Server started!")
})

// 유저 story
// 사용자는 인풋에 자신의 이미지 path를 입력 하고 확인 버튼을 누른다.
// 사용자가 가진 사진이 화면에 그대로 보여진다 ( 이미지 원본 실제 크기로 )
// 화면에 보여진 사진 옆에 여러가지 콤보박스가 있고 콤보박스에서 원하는 스타일을 고를수 있다.
// 원하는 스타일을 고른 뒤, 원하는 만큼의 값을 사용자는 직접 입력 할 수 있다.
// 전송 버튼을 누르면 원하는 값의 쿼리가 쿼리 코드 미리보기 창에 보여진다.


// 서버 스토리
// 사용자가 보내온 이미지 패쓰를 가져온다.
// 사용자가 보내온 이미지 패쓰를 화면에 뿌려준다.
// 콤보박스에서 선택된 인자는 노드 스트림을 통해 전송 버튼 없이 실시간으로 받아온다.
// 받아온 인자를 가지고 해당되는 라이브러리 인수에 대입해 준다.
// 원하는 값이 적용된 이미지가 리사이징 되어 화면에 보여준다.

// 최종 -  nodeStream을 통해 interactive한 라이브러리를 만드는 것 


