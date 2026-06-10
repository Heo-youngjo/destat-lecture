// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Survey.sol";

struct SurveySchema {
    string title;
    string description;
    uint256 targetNumber;
    Question[] questions;
}

contract SurveyFactory {
    event SurveyCreated(address surveyAddress);

    uint256 public min_pool_amount;
    uint256 public min_reward_amount;
    Survey[] public surveys;

    constructor(
        uint256 _min_pool_amount,
        uint256 _min_reward_amount
    ) payable {
        min_pool_amount = _min_pool_amount;
        min_reward_amount = _min_reward_amount;
    }

    function createSurvey(SurveySchema calldata _survey) external payable {
        require(_survey.targetNumber > 0, "targetNumber must be > 0");
        require(msg.value >= min_pool_amount, "Insufficient pool amount");
        require(
            msg.value / _survey.targetNumber >= min_reward_amount,
            "Insufficient reward amount"
        );

        Survey survey = new Survey{value: msg.value}(
            _survey.title,
            _survey.description,
            _survey.targetNumber,
            _survey.questions
        );

        surveys.push(survey);
        emit SurveyCreated(address(survey));
    }

    function getSurveys() external view returns (Survey[] memory) {
        return surveys;
    }

    function getSurveysCount() external view returns (uint256) {
        return surveys.length;
    }
}