import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    welcome: 'Welcome to SafeChara',
    dashboard: 'Dashboard',
    test_feed: 'Test Feed',
    test_silage: 'Test Silage',
    next: 'Next',
    edit: 'Edit',
    start_test: 'Start Test',
    feed_flow_step: 'Step %{step} of 3',
    cattle_type_title: 'What type of cattle?',
    cattle_type_subtitle: 'This helps us give accurate feed recommendations',
    cattle_type_cow: 'Cow',
    cattle_type_buffalo: 'Buffalo',
    cattle_condition_title: 'What is the current condition?',
    cattle_condition_subtitle: "We'll tailor the nutritional advisory to this stage",
    cattle_condition_lactating: 'Lactating',
    cattle_condition_pregnant: 'Pregnant',
    cattle_condition_normal: 'Normal',
    selected_summary: '%{value} selected',
    sample_upload_title: 'Upload your feed sample',
    sample_upload_subtitle: 'Take a photo or upload an image of the feed sample',
    upload_zone_text: 'Drag & drop your feed image here, or tap to upload',
    retake_change: 'Retake/Change',
    take_photo: 'Take Photo',
    choose_gallery: 'Choose from Gallery',
    permission_required: 'Permission required',
    camera_permission_message: 'Camera permission is required to take a feed sample photo.',
    gallery_permission_message: 'Photo library permission is required to choose a feed sample image.',
  },
  hi: {
    welcome: 'सेफचारा में आपका स्वागत है',
    dashboard: 'डैशबोर्ड',
    test_feed: 'चारा टेस्ट करें',
    test_silage: 'साइलेज टेस्ट करें',
    next: 'आगे',
    edit: 'बदलें',
    start_test: 'टेस्ट शुरू करें',
    feed_flow_step: 'चरण %{step} / 3',
    cattle_type_title: 'मवेशी का प्रकार क्या है?',
    cattle_type_subtitle: 'इससे हमें सही चारा सुझाव देने में मदद मिलती है',
    cattle_type_cow: 'गाय',
    cattle_type_buffalo: 'भैंस',
    cattle_condition_title: 'अभी स्थिति क्या है?',
    cattle_condition_subtitle: 'हम इस अवस्था के अनुसार पोषण सलाह देंगे',
    cattle_condition_lactating: 'दूध दे रही',
    cattle_condition_pregnant: 'गर्भवती',
    cattle_condition_normal: 'सामान्य',
    selected_summary: '%{value} चुना गया',
    sample_upload_title: 'चारे का नमूना अपलोड करें',
    sample_upload_subtitle: 'चारे के नमूने की फोटो लें या इमेज अपलोड करें',
    upload_zone_text: 'चारे की इमेज यहां डालें, या अपलोड करने के लिए टैप करें',
    retake_change: 'फिर लें/बदलें',
    take_photo: 'फोटो लें',
    choose_gallery: 'गैलरी से चुनें',
    permission_required: 'अनुमति जरूरी है',
    camera_permission_message: 'चारे के नमूने की फोटो लेने के लिए कैमरा अनुमति जरूरी है।',
    gallery_permission_message: 'चारे की इमेज चुनने के लिए फोटो लाइब्रेरी अनुमति जरूरी है।',
  },
};

const i18n = new I18n(translations);
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;

export default i18n;
