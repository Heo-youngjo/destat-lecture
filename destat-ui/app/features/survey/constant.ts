export const SURVEY_FACTORY = '0x631F14ABB32367fe533D2f28bC688bC5692D172C';
export const SURVEY_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_min_pool_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_min_reward_amount',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'surveyAddress',
        type: 'address',
      },
    ],
    name: 'SurveyCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'title',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'targetNumber',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'question',
                type: 'string',
              },
              {
                internalType: 'string[]',
                name: 'options',
                type: 'string[]',
              },
            ],
            internalType: 'struct Question[]',
            name: 'questions',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct SurveySchema',
        name: '_survey',
        type: 'tuple',
      },
    ],
    name: 'createSurvey',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSurveys',
    outputs: [
      {
        internalType: 'contract Survey[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSurveysCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'min_pool_amount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'min_reward_amount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'surveys',
    outputs: [
      {
        internalType: 'contract Survey',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
export const SURVEY_ABI = [
  {
    inputs: [],
    name: 'title',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'targetNumber',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'description',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAnswers',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'respondent', type: 'address' },
          { internalType: 'uint8[]', name: 'answers', type: 'uint8[]' },
        ],
        internalType: 'struct Answer[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAnswersCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getQuestions',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'question', type: 'string' },
          { internalType: 'string[]', name: 'options', type: 'string[]' },
        ],
        internalType: 'struct Question[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'respondent', type: 'address' },
          { internalType: 'uint8[]', name: 'answers', type: 'uint8[]' },
        ],
        internalType: 'struct Answer',
        name: '_answer',
        type: 'tuple',
      },
    ],
    name: 'submitAnswer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
