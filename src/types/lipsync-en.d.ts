declare module "../../vendor/talkinghead/lipsync-en.mjs" {
  export class LipsyncEn {
    preProcessText(s: string): string;
    wordsToVisemes(word: string): {
      visemes: string[];
      times: number[];
      durations: number[];
    };
  }
}

declare module "*/lipsync-en.mjs" {
  export class LipsyncEn {
    preProcessText(s: string): string;
    wordsToVisemes(word: string): {
      visemes: string[];
      times: number[];
      durations: number[];
    };
  }
}
