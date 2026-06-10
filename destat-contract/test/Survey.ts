import { expect } from "chai";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

describe("Survey init", () => {
  const title = "막무가내 설문조사라면";
  const description =
    "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
      options: [
        "구글폼 운영자",
        "탈중앙화된 블록체인 (관리주체 없으며 모든 데이터 공개)",
        "상관없음",
      ],
    },
  ];

  const getSurveyContractAndEthers = async (survey: {
    title: string;
    description: string;
    targetNumber: number;
    questions: Question[];
  }) => {
    const { ethers } = await network.connect();
    const cSurvey = await ethers.deployContract(
      "Survey",
      [survey.title, survey.description, survey.targetNumber, survey.questions],
      {
        value: ethers.parseEther("10"),
      }
    );

    await cSurvey.waitForDeployment();

    return { ethers, cSurvey };
  };

  describe("Deployment", () => {
    it("should store survey info correctly", async () => {
      const targetNumber = 10;
      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
      });

      expect(await cSurvey.title()).to.equal(title);
      expect(await cSurvey.description()).to.equal(description);
      expect(await cSurvey.targetNumber()).to.equal(targetNumber);
    });

    it("should calculate rewardAmount correctly", async () => {
      const targetNumber = 4;
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber,
        questions,
      });

      expect(await cSurvey.rewardAmount()).to.equal(
        ethers.parseEther("10") / 4n
      );
    });
  });

  describe("Questions and Answers", () => {
    it("should return questions correctly", async () => {
      const surveyQuestions: Question[] = [
        ...questions,
        {
          question: "테스트용 두번째 질문",
          options: ["예", "아니오"],
        },
      ];

      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 10,
        questions: surveyQuestions,
      });

      expect(await cSurvey.getQuestions()).to.deep.equal(
        surveyQuestions.map((question) => [question.question, question.options])
      );
    });

    it("should allow valid answer submission", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 2,
        questions,
      });
      const [, respondent] = await ethers.getSigners();
      const initialBalance = await cSurvey.getBalance();

      const tx = await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [1],
      });
      await tx.wait();

      expect(await cSurvey.getAnswersCount()).to.equal(1);
      expect(await cSurvey.getBalance()).to.equal(
        initialBalance - (await cSurvey.rewardAmount())
      );
    });

    it("should revert if answer length mismatch", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 10,
        questions,
      });
      const [, respondent] = await ethers.getSigners();

      await expect(
        cSurvey.connect(respondent).submitAnswer({
          respondent: respondent.address,
          answers: [0, 1],
        })
      ).to.be.revertedWith("Mismatched answers length");
    });

    it("should revert if target reached", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 1,
        questions,
      });
      const [, respondent1, respondent2] = await ethers.getSigners();

      await cSurvey.connect(respondent1).submitAnswer({
        respondent: respondent1.address,
        answers: [0],
      });

      await expect(
        cSurvey.connect(respondent2).submitAnswer({
          respondent: respondent2.address,
          answers: [1],
        })
      ).to.be.revertedWith("This survey has been ended");
    });
  });

  describe("Rewards", () => {
    it("should pay correct reward to respondent", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 5,
        questions,
      });
      const [, respondent] = await ethers.getSigners();
      const rewardAmount = await cSurvey.rewardAmount();
      const balanceBefore = await ethers.provider.getBalance(
        respondent.address
      );

      const tx = await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [2],
      });
      const receipt = await tx.wait();
      const balanceAfter = await ethers.provider.getBalance(respondent.address);
      const gasCost = receipt!.gasUsed * receipt!.gasPrice;

      expect(balanceAfter - balanceBefore + gasCost).to.equal(rewardAmount);
      expect(await cSurvey.getBalance()).to.equal(
        ethers.parseEther("10") - rewardAmount
      );
    });
  });
});
