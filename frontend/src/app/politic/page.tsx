import React from 'react';
import type { Metadata } from "next";
import style from './politic.module.css'

import { getPageMeta } from "@/api";


export async function generateMetadata(): Promise<Metadata> {
  const response = await getPageMeta('politic')
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}


export default function PoliticCompoennt() {
  return(
    <section className={style.politicBlock}>
      <div className="container">
        <div className={style.politicContent}>
          <div className={style.blockHeader}>
            <h3>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h3>
            <div className={style.blockDate}>
              <p>По состоянию на 01 июня 2025 года</p>
            </div>
            <p>
              Настоящая Политика конфиденциальности персональных данных 
              (далее – «Политика конфиденциальности») разработана на основании Федерального закона от 
              27 июня 2006 года №149-ФЗ «Об информации, информационных технологиях и о защите информации» и 
              действует в отношении всей информации, который сайт https://сам-себе-юрист.рф , может получить 
              о потребителе
            </p>
          </div>
          <div className={style.blockContent}>
            <div className={style.contentItem}>
              <h4>1. ОПРЕДЕЛЕНИЕ ТЕРМИНОВ</h4>
              <p>1.1. В настоящей политике конфиденциальности используются следующие значения:</p>
              <p>информация – сведения (сообщения, данные) независимо от формы их представления;</p>
              <p>информационные технологии – процессы, методы поиска, сбора, хранения, обработки, предоставления, распространения информации и способы осуществления таких процессов и методов;</p>
              <p>информационная система – совокупность содержащейся в базах данных информации и обеспечивающих ее обработку информационных технологий и технических средств;</p>
              <p>информационно-телекоммуникационная сеть – технологическая система, предназначенная для передачи по линиям связи информации, доступ к которой осуществляется с использованием средств вычислительной техники;</p>
              <p>обладатель информации – лицо, самостоятельно создавшее информацию либо получившее на основании закона или договора право разрешать или ограничивать доступ к информации, определяемой по каким-либо признакам;</p>
              <p>доступ к информации – возможность получения информации и ее использования;</p>
              <p>конфиденциальность информации – обязательное для выполнения лицом, получившим доступ к определенной информации, требование не передавать такую информацию третьим лицам без согласия ее обладателя;</p>
              <p>предоставление информации – действия, направленные на получение информации определенным кругом лиц или передачу информации определенному кругу лиц;</p>
              <p>распространение информации – действия, направленные на получение информации неопределенным кругом лиц или передачу информации неопределенному кругу лиц;</p>
              <p>электронное сообщение – информация, переданная или полученная пользователем информационно-телекоммуникационной сети;</p>
              <p>документированная информация – зафиксированная на материальном носителе путем документирования информация с реквизитами, позволяющими определить такую информацию или в установленных законодательством Российской Федерации случаях ее материальный носитель;</p>
              <p>электронный документ – документированная информация, представленная в электронной форме, то есть в виде, пригодном для восприятия человеком с использованием электронных вычислительных машин, а также для передачи по информационно-телекоммуникационным сетям или обработки в информационных системах;</p>
              <p>оператор информационной системы – гражданин или юридическое лицо, осуществляющие деятельность по эксплуатации информационной системы, в том числе по обработке информации, содержащейся в ее базах данных;</p>
              <p>сайт в сети Интернет – совокупность программ для электронных вычислительных машин и иной информации, содержащейся в информационной системе, доступ к которой обеспечивается посредством информационно-телекоммуникационной сети Интернет (далее - сеть Интернет) по доменным именам и (или) по сетевым адресам, позволяющим идентифицировать сайты в сети Интернет;</p>
              <p>страница сайта в сети Интернет (далее – Интернет-страница) – часть сайта в сети Интернет, доступ к которой осуществляется по указателю, состоящему из доменного имени и символов, определенных владельцем сайта в сети Интернет;</p>
              <p>доменное имя – обозначение символами, предназначенное для адресации сайтов в сети Интернет в целях обеспечения доступа к информации, размещенной в сети Интернет;</p>
              <p>сетевой адрес – идентификатор в сети передачи данных, определяющий при оказании телематических услуг связи абонентский терминал или иные средства связи, входящие в информационную систему;</p>
              <p>владелец сайта в сети Интернет – лицо, самостоятельно и по своему усмотрению определяющее порядок использования сайта в сети Интернет, в том числе порядок размещения информации на таком сайте;</p>
              <p>провайдер хостинга – лицо, осуществляющее деятельность по предоставлению вычислительной мощности для размещения информации в информационной системе, постоянно подключенной к сети Интернет;</p>
              <p>поисковая система – информационная система, осуществляющая по запросу пользователя поиск в сети Интернет информации определенного содержания и предоставляющая пользователю сведения об указателе страницы сайта в сети Интернет для доступа к запрашиваемой информации, расположенной на сайтах в сети Интернет, принадлежащих иным лицам, за исключением информационных систем, используемых для осуществления государственных и муниципальных функций, оказания государственных и муниципальных услуг, а также для осуществления иных публичных полномочий, установленных федеральными законами;</p>
            </div>
            <div className={style.contentItem}>
              <h4>2. ОБЩИЕ ПОЛОЖЕНИЯ </h4>
              <p>2.1. Пользование потребителем сайтом означает его согласие с настоящей политикой конфиденциальности и условиями обработки персональных данных потребителя.</p>
              <p>2.2. В случае несогласия с условиями политики конфиденциальности потребитель должен прекратить использования ресурсов сайта.</p>
              <p>2.3. Настоящая политика конфиденциальности применяется только по отношению к сайту. Администратор сайта не контролирует и не несет ответственности за веб-сайты третьих лиц, на которые потребитель может перейти по ссылкам, доступным на сайте. Администратор призывает пользователей перед представлением своей информации на сторонних веб-сайтах внимательно ознакомится с их политикой конфиденциальности.</p>
              <p>2.4. Потребитель удостоверяет, что вводимые им персональные данные достоверны и не нарушают законных прав и интересов третьих лиц.</p>
              <p>2.5. Администратор не проверяет достоверность персональных данных, предоставляемым пользователями.</p>
            </div>
            <div className={style.contentItem}>
              <h4>3. ПРЕДМЕТ ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ</h4>
              <p>3.1. Настоящая политика конфиденциальности устанавливает обязательства администратора сайта по неразглашению и обеспечению режима защиты конфиденциальности персональных данных, которые потребитель предоставляет при использовании сайта.</p>
              <p>3.2. Администратор сайта предпринимает соответствующие меры для обеспечения безопасности персональной информации потребителя, однако метод передачи информации и метод её хранения в сети Интернет не может быть полностью безопасным, поэтому администратор сайта не гарантирует абсолютную безопасность персональной информации.</p>
            </div>
            <div className={style.contentItem}>
              <h4>4. ЦЕЛИ СБОРА ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ ПОТРЕБИТЕЛЯ</h4>
              <p>4.1. Администратор сайта может использовать персональные данные пользователя исключительно в целях оформления оказания услуг, а также:</p>
              <ul>
                <li>- для установления с потребителем обратной связи;</li>
                <li>- подтверждения (в случае необходимости) достоверности и полноты персональных данных, предоставленных пользователем</li>
                <li>- определения места нахождения потребителя в целях, определенных пользовательским Соглашением;</li>
                <li>- осуществления рекламной деятельности, деятельности по информированию потребителей об акциях сайта</li>
                <li>- обработки и получения оплаты. </li>
              </ul>
              <p>4.2. В целях заключения гражданско-правовых договоров или оформления иных правоотношений, в которых участвуют лица, обменивающиеся электронными сообщениями, обмен электронными сообщениями, каждое из которых подписано электронной подписью или иным аналогом собственноручной подписи отправителя такого сообщения, в порядке, установленном федеральными законами, иными нормативными правовыми актами или соглашением сторон, рассматривается как обмен документами.</p>
              <p>4.3. Право собственности и иные вещные права на материальные носители, содержащие документированную информацию, устанавливаются действующим гражданским законодательством Российской Федерации.</p>
            </div>
            <div className={style.contentItem}>
              <h4>5. СПОСОБЫ И СРОКИ ОБРАБОТКИ ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ </h4>
              <p>5.1. Обработка персональных данных потребителя осуществляется без ограничения срока любым законным способом, в том числе в информационных системах персональных данных с использованием средств автоматизации.</p>
              <p>5.2. Потребитель соглашается с тем, что администратор сайта вправе в случаях, на основании и в порядке, предусмотренных законодательствам Российской Федерации передавать персональные данные потребителя третьим лицам.</p>
            </div>
            <div className={style.contentItem}>
              <h4>6. ОБЯЗАТЕЛЬСТВА СТОРОН</h4>
              <p>6.1. Пользователь обязан:</p>
              <p>6.1.1. Предоставлять достоверную и запрашиваемом объеме информацию о своих персональных данных, необходимую для оформления заказа;</p>
              <p>6.1.2. По запросу администратора сайта представить дополнительную информацию;</p>
              <p>6.1.3. Соблюдать условия пользовательского Соглашения, а также действующей политики конфиденциальности, размещенных на сайте.</p>
              <p>6.2. Администратор сайта обязан:</p>
              <p>6.2.1. Использовать полученную информацию исключительно в целях качественного предоставления услуг потребителю;</p>
              <p>6.2.2. Предпринять необходимые меры для сохранности конфиденциальной информации;</p>
              <p>6.2.3. Отказаться от предоставления услуг потребителю в случае неуплаты потребителем стоимости услуг, либо предоставления потребителем недействительных (ложных) данных в рамках оформления заказа.</p>
            </div>
            <div className={style.contentItem}>
              <h4>7. ОТВЕТСТВЕННОСТЬ СТОРОН</h4>
              <p>7.1. Стороны несут ответственность в отношении принятых на себя обязательств в соответствии с действующим законодательством Российской Федерации.</p>
            </div>
            <div className={style.contentItem}>
              <h4>8. РАЗРЕШЕНИЕ СПОРОВ</h4>
              <p>8.1.  Стороны установили, что все споры, возникающие из отношений между ними, будут разрешаться путем переговоров, посредством направления претензионных писем.</p>
              <p>8.2. Если стороны не достигнут соглашения в ходе переговоров, или на претензионное письмо не будет получен ответ в течение 10 календарных дней, то спор подлежит рассмотрению в порядке, установленном действующим законодательством Российской Федерации.</p>
            </div>
            <div className={style.contentItem}>
              <h4>9. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ</h4>
              <p>9.1. Администратор сайта вправе вносить изменения в политику конфиденциальности без уведомления и согласия потребителя.</p>
              <p>9.2. Новая редакция политики конфиденциальности вступает в силу с момента её размещения на сайте. При дальнейшем пользовании услугами сайта, потребитель соглашается с новыми условиями политики конфиденциальности, а в случае несогласия, потребитель обязан покинуть сайт и не использовать в дальнейшем ресурсы сайта.</p>
            </div>
            <strong>Потребитель подтверждает, что ознакомлен со всеми пунктами настоящей политики конфиденциальности и полностью принимает их к действию.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}