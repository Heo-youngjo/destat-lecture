import { expect } from "chai";
import hre from "hardhat";

describe("SurveyFactory Contract", () => {
  let ethers: any;
  let factory: any;
  let owner: any;
  let respondent1: any;
  let respondent2: any;

  beforeEach(async () => {
    ({ ethers } = await hre.network.connect());

    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"), // min_pool_amount
      ethers.parseEther("0.1"), // min_reward_amount
    ]);

    await factory.waitForDeployment();
  });

  it("should deploy with correct minimum amounts", async () => {
    // TODO: check min_pool_amount and min_reward_amount
    expect(await factory.min_pool_amount()).to.equal(ethers.parseEther("50"));
    expect(await factory.min_reward_amount()).to.equal(
      ethers.parseEther("0.1")
    );
  });

  it("should create a new survey when valid values are provided", async () => {
    // TODO: prepare SurveySchema and call createSurvey with msg.value
    const surveySchema = {
      title: "First Survey",
      description: "This is the first survey",
      targetNumber: 100,
      questions: [
        {
          question: "What is your favorite food?",
          options: ["Pizza", "Burger", "Pasta"],
        },
      ],
    };

    // TODO: check event SurveyCreated emitted
    await expect(
      factory.createSurvey(surveySchema, {
        value: ethers.parseEther("100"),
      })
    ).to.emit(factory, "SurveyCreated");

    // TODO: check surveys array length increased
    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(1);
  });

  it("should revert if pool amount is too small", async () => {
    // TODO: expect revert when msg.value < min_pool_amount
    const surveySchema = {
      title: "Small Pool Survey",
      description: "Pool too small",
      targetNumber: 100,
      questions: [
        {
          question: "Q1",
          options: ["A", "B"],
        },
      ],
    };

    await expect(
      factory.createSurvey(surveySchema, {
        value: ethers.parseEther("10"),
      })
    ).to.be.revertedWith("Insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount
    const surveySchema = {
      title: "Low Reward Survey",
      description: "Reward too small",
      targetNumber: 1000,
      questions: [
        {
          question: "Q1",
          options: ["A", "B"],
        },
      ],
    };

    await expect(
      factory.createSurvey(surveySchema, {
        value: ethers.parseEther("50"),
      })
    ).to.be.revertedWith("Insufficient reward amount");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    // TODO: create multiple surveys and check getSurveys output
    const surveySchema1 = {
      title: "Survey 1",
      description: "First survey",
      targetNumber: 100,
      questions: [
        {
          question: "Q1",
          options: ["A", "B"],
        },
      ],
    };

    const surveySchema2 = {
      title: "Survey 2",
      description: "Second survey",
      targetNumber: 200,
      questions: [
        {
          question: "Q2",
          options: ["Yes", "No"],
        },
      ],
    };

    await factory.createSurvey(surveySchema1, {
      value: ethers.parseEther("100"),
    });

    await factory.createSurvey(surveySchema2, {
      value: ethers.parseEther("200"),
    });

    const surveys = await factory.getSurveys();

    expect(surveys.length).to.equal(2);
    expect(surveys[0]).to.not.equal(ethers.ZeroAddress);
    expect(surveys[1]).to.not.equal(ethers.ZeroAddress);

    const survey1 = await ethers.getContractAt("Survey", surveys[0]);
    const survey2 = await ethers.getContractAt("Survey", surveys[1]);

    expect(await survey1.title()).to.equal("Survey 1");
    expect(await survey2.title()).to.equal("Survey 2");
  });
});