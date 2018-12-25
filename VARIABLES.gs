var ID_PROFILE_FOLDER        = '1qHogROhRBOxUZOWTB7_4mZTSBg0ntJQK';
var ID_PROFILE_FOLDER_ALL    = '1Ovu2R4O-FghEQTFaGC8hxSFUuWmONnms';
var ID_PROFILE_FOLDER_CLOSED = '1ydVJ5kl5z6uae6X-4W2OhplZy5ODEtjq';
var ID_PROFILE_FOLDER_LOYAL  = '1D3oyZMQdwEgSRfLO4l5pMh1ixsM6ni_C';
var ID_PROFILE_FOLDER_BANNED = '17ucR54mW-SQn71V3MubXHpV9DGG2muGY';
var ID_PROFILE_FOLDER_HIRED  = '1B0UKfd5M8YB6KTwREzR1rYTILKiEUhjn';
var ID_PROFILE_FOLDER_FIRED  = '1qdK_wyFWprWEW2mc0KT_3G4GJGt-9mnh';


var ID_RESUME_FOLDER  = '1L124hWoMDbpse9zmTQospWoGE6ea0AVQ';

var ID_PROFILE_TEMPLATE = '18mx-omQFvXAswelYaB1ziNZRvIeUmVZKwkG75_yZQ8g';

var ADDR_RESUME_F_NAME  = ['bio', 1, 1];
var ADDR_RESUME_S_NAME  = ['bio', 2, 1];
var ADDR_RESUME_EMAIL   = ['bio', 3, 1];
var ADDR_RESUME_PHONE   = ['bio', 4, 1];
var ADDR_RESUME_LETTER  = ['bio', 5, 1];
var ADDR_RESUME_RESUME  = ['bio', 6, 1];
var ADDR_RESUME_PASWRD  = ['bio', 7, 1];
var ADDR_RESUME_ANKETA  = ['bio', 8, 1];



var VAC_STATUSES = ["newstat",                    // 0
                    "asked2why",              // 1
                    "remind2why",             // 2
                    "answered2why",           // 3 
                    "asked4test",             // 4
                    "remind4test",            // 5
                    "answeredtest",           // 6 
                    "invited",                // 7
                    "remindinvited",          // 8
                    "invitationread",         // 9
                    "meetinghappened",        // 10
                    "hired",                  // 11
                    "declinedByCompany",      // 12
                    "declinedByEmployee"      // 13
                   ];
var VAC_STATUSES_JSON = {
  "newstat":            { "value": "newstat",            "index": 0  },
  "asked2why":          { "value": "asked2why",          "index": 1  },
  "remind2why":         { "value": "remind2why",         "index": 2  },
  "answered2why":       { "value": "answered2why",       "index": 3  },
  "asked4test":         { "value": "asked4test",         "index": 4  },
  "remind4test":        { "value": "remind4test",        "index": 5  },
  "answeredtest":       { "value": "answeredtest",       "index": 6  },
  "invited":            { "value": "invited",            "index": 7  },
  "remindinvited":      { "value": "remindinvited",      "index": 8  },
  "invitationread":     { "value": "invitationread",     "index": 9  },
  "meetinghappened":    { "value": "meetinghappened",    "index": 10 },
  "hired":              { "value": "hired",              "index": 11 },
  "declinedByCompany":  { "value": "declinedByCompany",  "index": 12 },
  "declinedByEmployee": { "value": "declinedByEmployee", "index": 13 }
};

var EMAILS = {
  "welcome":[
    "Здравствуйте{#name}!\nСпасибо за отклик на нашу Вакансию. Скоро мы пришлём Вам инструкцию, что нужно сделать на следующем шаге"
  ],
  "ask2why":[
    "Здравствуйте{#name}!\nНам Важно, чтобы Вы ответили всего на два вопроса. Вопросы и формы для ответа вы найдете по ссылке "  
  ],
  "remind2why":[
    "Здравствуйте{#name}!\nМы предложили Вам ответить на 2 вопроса, но до сих пор не получили от Вас ответа. Чтобы ответить на эти вопросы, пройдите пожалуйста по ссылке "  
  ],
  "answer2why": [
    "Здравствуйте{#name}!\nЯ вижу, что Вы ответили на два наших вопроса. Дайте мне несколько времени, я обработаю Вашт ответы и сообщу, что нужно сделать на следующем шаге."  
  ],
  "ask4test":[
    "Здравствуйте{#name}!\nЯ посмотрел Ваши ответы. \n\nТеперь я попрошу Вас заполнить анкету. Это не займет много времени. Чтобы ответить на вопросы анкеты, перейдите ао ссылке "
  ],
  "remind4test":[
    "Здравствуйте{#name}!\nМы предложили Вам заполнить анкету, но до сих пор не получили результат. Если Вакансия для Вас еще интересна, заполните анкету по ссылке "
  ],
  "answered4test":[
    "Здравствуйте{#name}!\nМы видим, что уже Вы заполнили анкету. Спасибо. Мы рассмотрим результаты анкетирования и сообщим Вам. что делать дальше."
  ],
  "invited":[
    "Здравствуйте{#name}!\nМы предлагаем Вам прийти к нам на собеседование. Если Вы готовы прийти, подтвердите свою готовность, перейдя по ссылке "  
  ],
  "remindinvated":[
    "Здравствуйте{#name}!\nМы предложили Вам прийти к нам на собеседование, но до сих пор не получили ответ. Если Вы готовы прийти, подтвердите свою готовность, перейдя по ссылке "  
  ],
  "invitationread":[
    "Здравствуйте{#name}!\nСпасибо, что решили прийти к нам на собеседование. \nДля того, чтобы согласовать нашу встречу, позвоните по телефону 8 701 559 44 05. Подробнее о месте проведения встречи, вы можете узнать по ссылке http://ains.kz/hr"  
  ],
  "decline":"\n\n Чтобы отклонить данное предложение и исключить свою кандидатуру из конкурса на данную вакансию, перейдите по ссылке https://script.google.com/macros/s/AKfycbxDUonJnZcJGRQTP1t-JUHvoZZYy5Veri4rP6eTKcX9yw6EcRI/exec?decline=employee&id1={#id1}&id2={#id2} \n\n",
  "sing":"\n\n\nС уважением \nОтдел заботы о сотрудниках и кандидатах\nТОО ИНСТИТУТ АВТОМАТИЗАЦИИ\n\nКонтакты:\ne-mail: hr@ains.kz\nТел.: +7 /717-2/ 91-40-91\nг. Астана"
};