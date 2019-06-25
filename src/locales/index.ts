import i18n from "i18n-js"
import * as Localization from "expo-localization"
import fr from "./fr"
import en from "./en"

i18n.fallbacks = true
i18n.translations = { fr, en }
i18n.locale = Localization.locale

export default i18n
