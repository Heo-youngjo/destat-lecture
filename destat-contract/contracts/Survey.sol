// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
//
struct Question {
    string question;
    string[] options;
} //structure는 사이즈가 고정되어있다. type이 아무리 복합적이어도 고정이다.

struct Answer {
    address respondent;
    uint8[] answers;
}

contract Survey {
    //Key-Value storage
    //key range
    //0x000000000000000000000000000000000000000000000000000:0
    //0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF : 2^256 -1
    string public title; //0번슬롯 
    string public description; //1번슬롯 32바이트보다 긴 문자열
    uint256 public targetNumber; //2번슬롯 2-3번은 primitive type 그 슬롯에다가 그 값을 저장하는 타입
    uint256 public rewardAmount; //3번슬롯 1ether가 나온다.
    Question[] public questions; //4번슬롯 하지만 여기서는 array이기때문에 4번슬롯에 array의 사이즈만 들어간다.
    Answer[] public answers; // 5번슬롯
    //Question firstQuestion; 이런식으로 선언하면 슬롯을 두개 차지한다.
    mapping (address => uint) testMap;
    //primitive : (u)int(8~256), bool ,address
    // memory , storage , calldata
    constructor(
        string memory _title,
        string memory _description,
        uint256 _targetNumber,
        Question[] memory _questions
    ) payable {
        require(_targetNumber > 0, "targetNumber must be > 0");

        title = _title;
        description = _description;
        targetNumber = _targetNumber;

        // 1인당 지급할 보상금 계산
        rewardAmount = msg.value / _targetNumber;
        testMap[0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266] = 1000;
        // memory -> storage 복사 (중첩 동적배열 안전하게 수동 복사)
        for (uint256 i = 0; i < _questions.length; i++) {
            questions.push();
            Question storage q = questions[questions.length - 1];
            q.question = _questions[i].question;

            for (uint256 j = 0; j < _questions[i].options.length; j++) {
                q.options.push(_questions[i].options[j]);
            }
        }
    }

    function submitAnswer(Answer calldata _answer) external {
        // 질문 개수와 답변 개수가 일치하는지 확인
        require(
            _answer.answers.length == questions.length,
            "Mismatched answers length"
        );

        // 목표 인원 미만일 때만 응답 허용
        require(answers.length < targetNumber, "This survey has been ended");

        // 실제 제출자와 응답자 주소 일치 확인
        require(
            _answer.respondent == msg.sender,
            "respondent must be msg.sender"
        );

        answers.push(
            Answer({
                respondent: msg.sender,
                answers: _answer.answers
            })
        );

        // 응답자에게 보상금 지급
        payable(msg.sender).transfer(rewardAmount);
    }

    function getQuestions() external view returns (Question[] memory) {
        return questions;
    }

    function getAnswers() external view returns (Answer[] memory) {
        return answers;
    }

    function getAnswersCount() external view returns (uint256) {
        return answers.length;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}