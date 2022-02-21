const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
        apikey: 'TbvC03Zl4T821duvVFbqN7dY6uIzHmo_u9zcehfSdNQD',
    }),
    url: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/cb9f6a0a-5d31-44ac-a9f9-bb68091c0d44',
});

module.exports = {
    translateArray: async (array, language, modelId) => {
        // let identifyLanguage = await languageTranslator.identify({ text: array });
        // if (identifyLanguage.status == 200 && identifyLanguage.result.languages[0].language == language) {
        let translations = await languageTranslator.translate({ text: array, modelId: modelId });
        if (translations.status == 200) {
            return translations.result;
        } else {
            return null;
        }
        // } else {
        //     return false;
        // }
    }
};