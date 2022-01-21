import { RecognitionData } from '@machinat/core/base/IntentRecognizer';

const recognitionData: RecognitionData<'en'> = {
  defaultLanguage: 'en',
  languages: ['en'],
  intents: {
    greeting: {
      trainingPhrases: {
        en: [
          'just going to say hi',
          'heya',
          'hello hi',
          'howdy',
          'hey there',
          'hi there',
          'greetings',
          'hey',
          'long time no see',
          'hello',
          "lovely day isn't it",
          'hello again',
          'hi',
          'hello there',
          'a good day',
        ],
      },
    },

    introduce: {
      trainingPhrases: {
        en: [
          'how can you help me?',
          'what the fuck?',
          'how to start?',
          'what can you do?',
          'who are you?',
          'introduce',
          "what's this?",
        ],
      },
    },

    no: {
      trainingPhrases: {
        en: [
          "please don't",
          "I don't want to",
          'probably not',
          'nah',
          'nope',
          "don't do that",
          'sounds bad',
          "I don't like it",
          'bad',
          'not good',
          'false',
          'maybe not',
          'no, thanks',
          'no',
          'not this time',
          'tomorrow',
          'not now',
          'not interested',
          'skip',
          'next time',
        ],
      },
    },

    ok: {
      trainingPhrases: {
        en: [
          'please',
          'alright',
          'sure',
          'ok',
          'yes',
          'true',
          'sounds good',
          'terrific',
          'good',
          'no problem',
          'super',
          'cool',
          "that's what I need",
          'I like it',
          'ok, thanks',
          "I'd Like to",
          'of course',
          'yes, please',
        ],
      },
    },

    open: {
      trainingPhrases: {
        en: [
          'ok, open notes',
          'open my notes',
          'write',
          'write a note',
          'take a note',
          'open webview',
          'show app',
          'open app',
          'note space',
          'my space',
          'open',
        ],
      },
    },

    share: {
      trainingPhrases: {
        en: [
          'use with friends',
          'take note in group',
          'share to others',
          'share to friend',
          'take notes with friends',
          'share app',
          'share',
        ],
      },
    },
  },
};

export default recognitionData;
