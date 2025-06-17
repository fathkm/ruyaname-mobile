// Yorumcu sabitleri
export const YORUMCU_ISIMLERI = {
  HZ_YUSUF: "Hz. Yusuf",
  IBN_ARABI: "İbn Arabi",
  MEVLANA: "Mevlânâ",
  SEMS: "Şems-i Tebrîzî",
  JUNG: "Carl Jung",
  GAZALI: "İmam Gazali",
  RUYACI_DEDE: "Rüyacı Dede",
};

// Yorumcu tarzları
export const YORUMCU_TARZLARI = {
  DINI: "dini",
  FELSEFI_BILIMSEL: "felsefi-bilimsel",
  KLASIK: "klasik",
};

// Import statements
import {
  HzYusufPrompt,
  HzYusufSecondQuestion,
  HzYusufSecondAnswer,
} from "./HzYusufPrompt";
import {
  IbnArabiPrompt,
  IbnArabiSecondQuestion,
  IbnArabiSecondAnswer,
} from "./IbnArabiPrompt";
import {
  MevlanaPrompt,
  MevlanaSecondQuestion,
  MevlanaSecondAnswer,
} from "./MevlanaPrompt";
import { SemsPrompt, SemsSecondQuestion, SemsSecondAnswer } from "./SemsPrompt";
import { JungPrompt, JungSecondQuestion, JungSecondAnswer } from "./JungPrompt";
import {
  GazaliPrompt,
  GazaliSecondQuestion,
  GazaliSecondAnswer,
} from "./GazaliPrompt";
import {
  RuyaciDedePrompt,
  RuyaciDedeSecondQuestion,
  RuyaciDedeSecondAnswer,
} from "./RuyaciDedePrompt";

// Yorumcu konfigürasyonları
export const yorumcuKonfig = {
  [YORUMCU_ISIMLERI.HZ_YUSUF]: {
    tarzlar: [YORUMCU_TARZLARI.DINI],
    img: "/hzyusuf.png",
  },
  [YORUMCU_ISIMLERI.IBN_ARABI]: {
    tarzlar: [YORUMCU_TARZLARI.KLASIK, YORUMCU_TARZLARI.FELSEFI_BILIMSEL],
    img: "/ibnarabi.png",
  },
  [YORUMCU_ISIMLERI.MEVLANA]: {
    tarzlar: [YORUMCU_TARZLARI.KLASIK, YORUMCU_TARZLARI.DINI],
    img: "/mevlana.png",
  },
  [YORUMCU_ISIMLERI.SEMS]: {
    tarzlar: [YORUMCU_TARZLARI.KLASIK, YORUMCU_TARZLARI.DINI],
    img: "/sems.png",
  },
  [YORUMCU_ISIMLERI.JUNG]: {
    tarzlar: [YORUMCU_TARZLARI.FELSEFI_BILIMSEL],
    img: "/jung.png",
  },
  [YORUMCU_ISIMLERI.GAZALI]: {
    tarzlar: [YORUMCU_TARZLARI.DINI, YORUMCU_TARZLARI.FELSEFI_BILIMSEL],
    img: "/gazali.png",
  },
  [YORUMCU_ISIMLERI.RUYACI_DEDE]: {
    tarzlar: [YORUMCU_TARZLARI.KLASIK],
    img: "/ruyacidede.png",
  },
};

// Ana yorumcu promptları objesi
export const yorumcuPromptlari = {
  [YORUMCU_ISIMLERI.HZ_YUSUF]: {
    first: HzYusufPrompt,
    secondQuestion: HzYusufSecondQuestion,
    secondAnswer: HzYusufSecondAnswer,
    ...yorumcuKonfig[YORUMCU_ISIMLERI.HZ_YUSUF],
  },
  [YORUMCU_ISIMLERI.IBN_ARABI]: {
    first: IbnArabiPrompt,
    secondQuestion: IbnArabiSecondQuestion,
    secondAnswer: IbnArabiSecondAnswer,
    ...yorumcuKonfig[YORUMCU_ISIMLERI.IBN_ARABI],
  },
  [YORUMCU_ISIMLERI.MEVLANA]: {
    first: MevlanaPrompt,
    secondQuestion: MevlanaSecondQuestion,
    secondAnswer: MevlanaSecondAnswer,
    ...yorumcuKonfig[YORUMCU_ISIMLERI.MEVLANA],
  },
  [YORUMCU_ISIMLERI.SEMS]: {
    first: SemsPrompt,
    secondQuestion: SemsSecondQuestion,
    secondAnswer: SemsSecondAnswer,
    ...yorumcuKonfig[YORUMCU_ISIMLERI.SEMS],
  },
  [YORUMCU_ISIMLERI.JUNG]: {
    first: JungPrompt,
    secondQuestion: JungSecondQuestion,
    secondAnswer: JungSecondAnswer,
    ...yorumcuKonfig[YORUMCU_ISIMLERI.JUNG],
  },
  [YORUMCU_ISIMLERI.GAZALI]: {
    first: GazaliPrompt,
    secondQuestion: GazaliSecondQuestion,
    secondAnswer: GazaliSecondAnswer,
    ...yorumcuKonfig[YORUMCU_ISIMLERI.GAZALI],
  },
  [YORUMCU_ISIMLERI.RUYACI_DEDE]: {
    first: RuyaciDedePrompt,
    secondQuestion: RuyaciDedeSecondQuestion,
    secondAnswer: RuyaciDedeSecondAnswer,
    ...yorumcuKonfig[YORUMCU_ISIMLERI.RUYACI_DEDE],
  },
};

// Yardımcı fonksiyonlar
export const getYorumcuPrompt = (yorumcuAdi) => {
  const prompt = yorumcuPromptlari[yorumcuAdi];
  if (!prompt) {
    throw new Error(`Yorumcu bulunamadı: ${yorumcuAdi}`);
  }
  return prompt;
};

export const getYorumcuByTarz = (tarz) => {
  return Object.entries(yorumcuPromptlari)
    .filter(([_, yorumcu]) => yorumcu.tarzlar.includes(tarz))
    .map(([isim]) => isim);
};

// Tip kontrolleri için yardımcı fonksiyonlar
export const isValidYorumcu = (yorumcuAdi) => {
  return yorumcuAdi in yorumcuPromptlari;
};

export const isValidTarz = (tarz) => {
  return Object.values(YORUMCU_TARZLARI).includes(tarz);
};
