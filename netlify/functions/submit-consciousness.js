const sgMail = require('@sendgrid/mail');

const COUNSELOR_EMAIL = 'justin@loveinmost.org';

const LEVELS = [
    { id: 'shame',   val: 20,  ko: '수치심',  en: 'Shame' },
    { id: 'guilt',   val: 30,  ko: '죄책감',  en: 'Guilt' },
    { id: 'apathy',  val: 50,  ko: '무감각',  en: 'Apathy' },
    { id: 'grief',   val: 75,  ko: '슬픔',    en: 'Grief' },
    { id: 'fear',    val: 100, ko: '두려움',  en: 'Fear' },
    { id: 'desire',  val: 125, ko: '욕망',    en: 'Desire' },
    { id: 'anger',   val: 150, ko: '분노',    en: 'Anger' },
    { id: 'pride',   val: 175, ko: '자존심',  en: 'Pride' },
    { id: 'courage', val: 200, ko: '용기',    en: 'Courage' },
    { id: 'neutral', val: 250, ko: '중립',    en: 'Neutrality' },
    { id: 'willing', val: 310, ko: '의지',    en: 'Willingness' },
    { id: 'accept',  val: 350, ko: '수용',    en: 'Acceptance' },
    { id: 'reason',  val: 400, ko: '이성',    en: 'Reason' },
    { id: 'love',    val: 500, ko: '사랑',    en: 'Love' },
    { id: 'joy',     val: 540, ko: '기쁨',    en: 'Joy' },
    { id: 'peace',   val: 600, ko: '평화',    en: 'Peace' },
    { id: 'enlight', val: 700, ko: '깨달음',  en: 'Enlightenment' },
];

const QUESTIONS = [
    { id: 1,  lv: 'shame',   ko: '나는 내가 존재하지 않는 것이 낫다고 진심으로 생각한 적이 있다.' },
    { id: 2,  lv: 'shame',   ko: '누군가 나를 관찰할 때 극도의 수치심으로 인해 내 얼굴과 몸을 숨기고 싶은 충동을 느낀다.' },
    { id: 3,  lv: 'shame',   ko: '나는 내 기본적인 특성이나 모습이 다른 사람들보다 근본적으로 "잘못"되었다고 느낀다.' },
    { id: 4,  lv: 'shame',   ko: '내가 누군가에게 관심을 받으면, 나는 곧 그들이 나를 거절할 것이라고 확신한다.' },
    { id: 5,  lv: 'shame',   ko: '나는 내 자신이 다른 사람들의 짐이자 부담이라고 깊이 믿는다.' },
    { id: 6,  lv: 'shame',   ko: '어떤 작은 실수도 나의 무가치함을 증명하는 증거로 느껴진다.' },
    { id: 7,  lv: 'shame',   ko: '나는 과거의 부정적 경험이나 상처가 나를 영구적으로 손상시켰다고 믿는다.' },
    { id: 8,  lv: 'shame',   ko: '나는 다른 사람들과 진정한 관계를 맺을 수 없다고 확신하며, 혼자가 되는 것이 낫다고 생각한다.' },
    { id: 9,  lv: 'guilt',   ko: '나는 타인에게 해를 끼쳤다고 생각하는 상황들이 자주 떠올라 밤에 잠을 설친다.' },
    { id: 10, lv: 'guilt',   ko: '어떤 일이 잘못되었을 때, 내가 그것을 완벽하게 예방하지 못했다는 자책이 먼저 든다.' },
    { id: 11, lv: 'guilt',   ko: '내가 한 말이나 행동으로 누군가가 상처받았을 가능성이 있으면, 나는 그것을 반복해서 생각하고 재해석한다.' },
    { id: 12, lv: 'guilt',   ko: '나는 내가 받은 도움이나 호의를 충분히 갚지 못했다는 죄책감을 느낀다.' },
    { id: 13, lv: 'guilt',   ko: '과거의 잘못이나 불완전한 행동 때문에 자신에게 어느 정도의 고통이나 제약을 받아야 한다고 생각한다.' },
    { id: 14, lv: 'guilt',   ko: '어떤 선택을 했을 때 "내가 다른 선택을 했다면 결과가 달랐을 텐데"라는 생각에 사로잡혀 자책한다.' },
    { id: 15, lv: 'guilt',   ko: '내 행동의 부정적 결과에 대해 타인이 나를 용서하더라도, 나는 스스로를 용서하기 어렵다.' },
    { id: 16, lv: 'guilt',   ko: '나는 "만약 내가 더 신경 썼다면" 또는 "만약 내가 더 노력했다면"이라는 생각이 자주 든다.' },
    { id: 17, lv: 'apathy',  ko: '미래에 어떤 긍정적 변화가 일어날 수 있다는 믿음이 거의 또는 전혀 없다.' },
    { id: 18, lv: 'apathy',  ko: '무언가를 하고 싶은 의욕이나 에너지가 거의 없으며, 모든 것이 무의미하게 느껴진다.' },
    { id: 19, lv: 'apathy',  ko: '다른 사람들이 나를 돕거나 지지해도 별로 도움이 되지 않을 것이라고 생각한다.' },
    { id: 20, lv: 'apathy',  ko: '나는 지금 상태에서 벗어날 수 없다고 느끼며, 그것을 바꾸려는 노력 자체가 헛되다고 생각한다.' },
    { id: 21, lv: 'apathy',  ko: '나는 자신의 감정이나 상황에 거의 신경을 쓰지 않으며, 무관심한 상태가 오래 지속되고 있다.' },
    { id: 22, lv: 'apathy',  ko: '나는 삶 자체가 의미 있는지에 대해 의문을 품으며, 그 답을 찾을 수 없다고 느낀다.' },
    { id: 23, lv: 'apathy',  ko: '어떤 일을 시작해도 지루하거나 흥미를 잃기가 쉬우며, 끝내기가 어렵다.' },
    { id: 24, lv: 'apathy',  ko: '나는 내 삶이나 미래에 대해 생각하는 것을 피하려고 하며, 가능한 한 그런 생각을 하지 않으려고 한다.' },
    { id: 25, lv: 'grief',   ko: '내가 잃어버린 무언가(관계, 기회, 건강, 시간)에 대한 깊은 슬픔이 갑자기 밀려온다.' },
    { id: 26, lv: 'grief',   ko: '과거의 어떤 순간을 다시 돌아갈 수 없다는 것을 깨달을 때마다 깊은 슬픔을 느낀다.' },
    { id: 27, lv: 'grief',   ko: '내가 더 충분히 누군가를 사랑하거나 챙기지 못했다는 후회가 계속 남아있다.' },
    { id: 28, lv: 'grief',   ko: '기쁜 순간이 있어도 그것이 "지금 더 이상 돌아오지 않을 과거의 시간"이라는 생각이 들어 슬퍼진다.' },
    { id: 29, lv: 'grief',   ko: '나는 지금 내 삶이 내가 예상했던 것이 아니라는 감정을 받아들이기 어렵다.' },
    { id: 30, lv: 'grief',   ko: '나는 "만약 그때 다르게 했더라면"이라는 소원이 자주 들고, 그 생각으로 깊이 슬퍼진다.' },
    { id: 31, lv: 'grief',   ko: '누군가가 이미 떠나가거나 헤어진 관계에 대해 이야기할 때, 나는 깊은 슬픔을 느낀다.' },
    { id: 32, lv: 'grief',   ko: '나는 과거의 좋은 시절이 돌아오지 않을 것이라는 생각에 가슴이 철렁내려앉는다.' },
    { id: 33, lv: 'fear',    ko: '미래의 불확실한 상황에 대해 생각할 때, 나는 자주 최악의 시나리오를 상상하고 가슴이 철렁거린다.' },
    { id: 34, lv: 'fear',    ko: '예상하지 못한 상황이 발생하면, 나는 즉시 신체적 불안감(손 떨림, 가슴 철렁거림, 숨가쁨)을 경험한다.' },
    { id: 35, lv: 'fear',    ko: '사람들이 나를 판단하거나 비판할까봐 두려워 하고 싶은 말이나 행동을 자제할 때가 많다.' },
    { id: 36, lv: 'fear',    ko: '나는 새로운 환경이나 낯선 사람들 앞에서 불편하고 안전하지 않다는 느낌을 받는다.' },
    { id: 37, lv: 'fear',    ko: '어떤 일을 하다가 실패할 가능성이 조금만 있어도 나는 그것을 시도하기를 회피한다.' },
    { id: 38, lv: 'fear',    ko: '나는 질병이나 건강 문제에 대해 과도하게 걱정하는 경향이 있다.' },
    { id: 39, lv: 'fear',    ko: '누군가 나를 거절하거나 나를 떠날 가능성에 대해 자주 생각하고 불안해한다.' },
    { id: 40, lv: 'fear',    ko: '나는 내가 통제할 수 없는 상황에 처하면 극도의 불안감을 느끼고 그 상황을 피하려고 한다.' },
    { id: 41, lv: 'desire',  ko: '내가 원하는 무언가(성공, 인정, 물질, 관계 등)를 얻지 못할 때, 나는 강한 좌절감과 공허함을 느낀다.' },
    { id: 42, lv: 'desire',  ko: '특정한 것을 더 많이 얻거나 더 나은 상태가 되어야만 진정으로 행복할 수 있을 것 같다.' },
    { id: 43, lv: 'desire',  ko: '어떤 욕구나 충동을 느낄 때, 나는 그것을 즉시 충족시키고 싶은 강한 압박감을 경험한다.' },
    { id: 44, lv: 'desire',  ko: '내가 갖고 싶은 물질적인 것이나 상태를 상상하면, 그것을 얻을 때까지 불안정한 기분이 지속된다.' },
    { id: 45, lv: 'desire',  ko: '누군가가 나에게 특별한 관심이나 사랑을 주지 않으면, 나는 그것을 얻기 위해 많은 노력을 하거나 집착한다.' },
    { id: 46, lv: 'desire',  ko: '내가 하고 싶은 것을 하지 못하게 제약받으면, 나는 그것을 하기 위해 다양한 방법을 시도하거나 규칙을 우회한다.' },
    { id: 47, lv: 'desire',  ko: '나는 현재의 삶이 충분하지 않으며, 더 많은 것을 이루거나 갖게 되면 더 행복할 것이라고 생각한다.' },
    { id: 48, lv: 'desire',  ko: '나는 특정한 것(음식, 쇼핑, SNS, 알코올 등)에 대한 갈망이 쉽게 사라지지 않는다.' },
    { id: 49, lv: 'anger',   ko: '나는 내가 부당하게 대우받거나 무시당했다고 느낄 때 강한 분노 반응을 보인다.' },
    { id: 50, lv: 'anger',   ko: '타인의 불공정한 행동이나 결정에 대해 쉽게 분노하고, 그 감정이 오래 지속된다.' },
    { id: 51, lv: 'anger',   ko: '나는 상황이 내 뜻대로 되지 않을 때 강한 좌절감과 분노를 느낀다.' },
    { id: 52, lv: 'anger',   ko: '나는 다른 사람의 행동이 잘못됐다고 생각할 때, 그것을 직접적으로 비판하거나 지적하지 않으면 불편하다.' },
    { id: 53, lv: 'anger',   ko: '나는 내 감정이나 필요가 무시당할 때 폭발적인 반응이 나오거나, 강하게 저항한다.' },
    { id: 54, lv: 'anger',   ko: '나는 종종 분노가 치밀어올라 다른 사람에게 상처를 주는 말이나 행동을 한 후 후회한 적이 있다.' },
    { id: 55, lv: 'anger',   ko: '나는 사회적 불의나 불평등에 대해 강한 분노와 저항감을 느낀다.' },
    { id: 56, lv: 'anger',   ko: '나는 특정 사람이나 상황에 대해 오랫동안 분노와 원한을 간직하는 편이다.' },
    { id: 57, lv: 'pride',   ko: '나는 내 성취나 능력에 대한 강한 자부심이 있으며, 타인이 이를 인정해 주기를 바란다.' },
    { id: 58, lv: 'pride',   ko: '나는 내 신념이나 가치관이 옳다고 확신하며, 다른 관점을 받아들이기 어려울 때가 있다.' },
    { id: 59, lv: 'pride',   ko: '나는 비판을 받을 때 방어적이 되거나 즉각적으로 자신을 정당화하려는 경향이 있다.' },
    { id: 60, lv: 'pride',   ko: '나는 특정 집단(가족, 국가, 종교, 직업 등)에 대한 강한 소속감과 자부심이 있으며, 그 집단을 옹호한다.' },
    { id: 61, lv: 'pride',   ko: '나는 내 방식이나 기준이 더 우월하다고 느끼며, 타인이 그 기준을 충족시키지 못할 때 실망하거나 판단한다.' },
    { id: 62, lv: 'pride',   ko: '나는 실수를 인정하거나 도움을 요청하는 것이 어렵다.' },
    { id: 63, lv: 'pride',   ko: '나는 내 성공이나 지위가 타인의 존중을 받을 자격이 있다고 생각한다.' },
    { id: 64, lv: 'pride',   ko: '나는 나보다 수준이 낮다고 여기는 사람들의 의견이나 생각을 가볍게 여기는 경향이 있다.' },
    { id: 65, lv: 'courage', ko: '나는 어렵거나 두려운 상황에서도 "할 수 있다"는 자신감을 잃지 않는다.' },
    { id: 66, lv: 'courage', ko: '나는 도전적인 과제나 새로운 기회를 만났을 때 흥미와 열정을 느낀다.' },
    { id: 67, lv: 'courage', ko: '나는 실패를 두려워하기보다, 그것에서 배울 수 있다는 사실에 초점을 맞춘다.' },
    { id: 68, lv: 'courage', ko: '나는 내 삶을 스스로 변화시킬 수 있는 능력이 있다고 믿는다.' },
    { id: 69, lv: 'courage', ko: '나는 다른 사람들이 어렵다고 포기한 일도, 방법을 찾아 해낼 수 있다고 생각한다.' },
    { id: 70, lv: 'courage', ko: '나는 내 삶의 어려움을 극복하는 과정에서 성장했다고 느낀다.' },
    { id: 71, lv: 'courage', ko: '나는 나 자신과 타인의 가능성을 믿으며, 그 잠재력이 실현될 수 있도록 지원한다.' },
    { id: 72, lv: 'courage', ko: '나는 다른 사람들에게 용기와 희망을 주는 존재라고 생각한다.' },
    { id: 73, lv: 'neutral', ko: '나는 삶에서 벌어지는 일들에 대해 지나치게 집착하거나 저항하지 않는다.' },
    { id: 74, lv: 'neutral', ko: '나는 다양한 관점을 가진 사람들과 편안하게 대화할 수 있다.' },
    { id: 75, lv: 'neutral', ko: '나는 내가 통제할 수 없는 상황에서도 비교적 평온함을 유지할 수 있다.' },
    { id: 76, lv: 'neutral', ko: '나는 원하는 결과가 나오지 않더라도 그것을 수용하고 다음 단계로 나아갈 수 있다.' },
    { id: 77, lv: 'neutral', ko: '나는 갈등 상황에서 어느 한쪽에 치우치지 않고 균형 잡힌 시각을 유지한다.' },
    { id: 78, lv: 'neutral', ko: '나는 삶이 완벽하지 않아도 그것이 기본적으로 괜찮다고 느낀다.' },
    { id: 79, lv: 'willing', ko: '나는 내 삶을 더 나아지게 하기 위해 기꺼이 변화하고 노력할 의지가 있다.' },
    { id: 80, lv: 'willing', ko: '나는 새로운 것을 배우거나 성장할 기회가 생기면 적극적으로 참여한다.' },
    { id: 81, lv: 'willing', ko: '나는 어려운 상황에서도 포기하지 않고 방법을 찾으려는 노력을 한다.' },
    { id: 82, lv: 'willing', ko: '나는 내 한계나 단점을 인식하고, 그것을 개선하기 위해 노력한다.' },
    { id: 83, lv: 'willing', ko: '나는 미래에 대한 긍정적인 기대와 희망을 갖고 있다.' },
    { id: 84, lv: 'willing', ko: '나는 타인의 성장이나 발전을 돕는 것에서 기쁨을 느낀다.' },
    { id: 85, lv: 'accept',  ko: '나는 내 삶의 상황을 있는 그대로 받아들이며, 불필요한 저항을 하지 않는다.' },
    { id: 86, lv: 'accept',  ko: '나는 나 자신의 결함이나 한계를 판단하지 않고 수용할 수 있다.' },
    { id: 87, lv: 'accept',  ko: '나는 타인의 다름이나 실수를 자연스럽게 받아들이고 용서할 수 있다.' },
    { id: 88, lv: 'accept',  ko: '나는 과거의 상처나 실망스러운 경험들을 용서하고 내려놓을 수 있다.' },
    { id: 89, lv: 'accept',  ko: '나는 삶의 어려운 경험들도 내 성장의 일부로 바라볼 수 있다.' },
    { id: 90, lv: 'accept',  ko: '나는 다양한 상황과 사람들 속에서 내면의 평화를 유지할 수 있다.' },
    { id: 91, lv: 'reason',  ko: '나는 복잡한 상황을 논리적으로 분석하고 명확한 결론을 도출하는 능력이 있다.' },
    { id: 92, lv: 'reason',  ko: '나는 감정보다 이성적 판단에 더 의존하여 중요한 결정을 내린다.' },
    { id: 93, lv: 'reason',  ko: '나는 다양한 관점과 정보를 검토하여 균형 잡힌 이해를 추구한다.' },
    { id: 94, lv: 'reason',  ko: '나는 명확한 논리와 근거를 통해 타인에게 아이디어를 설명하는 것을 잘한다.' },
    { id: 95, lv: 'love',    ko: '나는 타인의 행복과 안녕을 진심으로 바라며, 그들을 돕는 것에서 깊은 기쁨을 느낀다.' },
    { id: 96, lv: 'love',    ko: '나는 조건 없이 사람들을 있는 그대로 사랑하고 수용할 수 있다.' },
    { id: 97, lv: 'joy',     ko: '나는 삶의 모든 순간에서 내면 깊은 곳에서 우러나오는 기쁨과 감사를 느낀다.' },
    { id: 98, lv: 'peace',   ko: '나는 존재 그 자체로 완전한 평화와 고요함을 경험한다.' },
    { id: 99, lv: 'enlight', ko: '나는 모든 것이 하나로 연결되어 있다는 깊은 인식과 함께 순수한 의식 상태를 경험한다.' },
];

const LEVEL_COLORS = {
    shame: '#555', guilt: '#666', apathy: '#777', grief: '#888',
    fear: '#F77F00', desire: '#E9C46A', anger: '#E76F51', pride: '#F4A261',
    courage: '#80B918', neutral: '#40BF60', willing: '#06D6A0',
    accept: '#00B4D8', reason: '#2196F3', love: '#3A86FF',
    joy: '#5C4DB1', peace: '#7B2D8B', enlight: '#B5179E',
};

const SCORE_LABEL = (s) => ['', '전혀 그렇지 않다', '그렇지 않다', '보통이다', '그렇다', '매우 그렇다'][s] || s;

function genderLabel(g) {
    if (g === 'male') return '남성';
    if (g === 'female') return '여성';
    if (g === 'undisclosed') return '명시 안함';
    return g || '-';
}

// ── HTML 이메일 공통 래퍼 ────────────────────────────────────────
function wrap(title, body) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#FFF5F8;margin:0;padding:0;}
  .outer{max-width:700px;margin:0 auto;padding:24px;}
  .header{background:linear-gradient(135deg,#A04870,#C96A8A);color:#fff;border-radius:14px 14px 0 0;padding:28px 32px;}
  .header h1{margin:0;font-size:1.4rem;font-weight:700;}
  .header p{margin:6px 0 0;font-size:0.9rem;opacity:0.85;}
  .body{background:#fff;padding:28px 32px;border:1px solid #F5D9E4;border-top:none;border-radius:0 0 14px 14px;}
  .section{margin-bottom:28px;}
  .section-title{font-size:1rem;font-weight:700;color:#A04870;border-bottom:2px solid #F5D9E4;padding-bottom:8px;margin-bottom:14px;}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .info-item{background:#FFF5F8;border-radius:8px;padding:10px 14px;}
  .info-label{font-size:0.75rem;color:#8A6B76;font-weight:600;margin-bottom:3px;}
  .info-value{font-size:0.95rem;color:#2D1A22;font-weight:600;}
  .score-box{background:linear-gradient(135deg,#A04870,#C96A8A);color:#fff;border-radius:12px;padding:24px;text-align:center;margin-bottom:20px;}
  .score-box .score{font-size:3.5rem;font-weight:800;letter-spacing:-2px;line-height:1;}
  .score-box .level{font-size:1.3rem;font-weight:700;margin-top:8px;color:#FFE4EE;}
  .score-box .emo{font-size:0.9rem;opacity:0.85;margin-top:6px;}
  .bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
  .bar-label{width:70px;font-size:0.8rem;color:#2D1A22;font-weight:600;text-align:right;flex-shrink:0;}
  .bar-val{width:28px;font-size:0.78rem;color:#8A6B76;text-align:right;flex-shrink:0;}
  .bar-bg{flex:1;height:12px;background:#F5D9E4;border-radius:6px;overflow:hidden;}
  .bar-fill{height:100%;border-radius:6px;}
  .badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:0.8rem;font-weight:600;margin:2px;}
  .strength{background:#DDFAEC;color:#1a5c38;}
  .challenge{background:#FFE8DC;color:#8B3A1A;}
  .q-table{width:100%;border-collapse:collapse;font-size:0.82rem;}
  .q-table th{background:#FFF0F5;color:#A04870;padding:7px 10px;text-align:left;font-weight:600;}
  .q-table td{padding:7px 10px;border-bottom:1px solid #F5D9E4;vertical-align:top;}
  .q-table tr:last-child td{border-bottom:none;}
  .score-dot{display:inline-block;width:22px;height:22px;border-radius:50%;color:#fff;font-size:0.75rem;font-weight:700;text-align:center;line-height:22px;}
  .interp{background:#FFF5F8;border-left:4px solid #C96A8A;padding:14px 16px;border-radius:0 8px 8px 0;font-size:0.88rem;line-height:1.7;color:#2D1A22;}
  .counsel-box{background:#FFF0F5;border:1px solid #F5D9E4;border-radius:10px;padding:16px;margin-bottom:12px;}
  .counsel-title{font-weight:700;color:#A04870;margin-bottom:6px;font-size:0.9rem;}
  .footer{text-align:center;font-size:0.75rem;color:#8A6B76;margin-top:20px;}
</style></head><body>
<div class="outer">
  <div class="header">
    <h1>💗 Love Inmost — ${title}</h1>
    <p>L.O.C 측정 검사 결과 보고서 · loveinmost.org</p>
  </div>
  <div class="body">${body}</div>
  <div class="footer">© 2026 Love Inmost Life Coaching &amp; Counselling. All rights reserved.<br>This report is confidential and intended solely for the recipient.</div>
</div>
</body></html>`;
}

// ── 내담자용 이메일 ───────────────────────────────────────────────
function buildClientEmail(data) {
    const { name, date, score, currentLevel, lvScores, ranked, gender, phone, email, counselor } = data;
    const levelName = currentLevel.ko;
    const isCritical = currentLevel.val >= 200;

    const allRanked = [...LEVELS].sort((a, b) => (lvScores[b.id] || 0) - (lvScores[a.id] || 0));
    const top3 = allRanked.slice(0, 3);
    const bottom3 = [...allRanked].reverse().slice(0, 3);

    const barsHtml = LEVELS.slice().reverse().map(lv => {
        const avg = lvScores[lv.id] || 0;
        const pct = ((avg - 1) / 4) * 100;
        const color = LEVEL_COLORS[lv.id] || '#C96A8A';
        const isCur = lv.id === currentLevel.id;
        return `<div class="bar-row">
            <div class="bar-label" style="${isCur ? 'color:#A04870;' : ''}">${lv.ko}${isCur ? ' ◀' : ''}</div>
            <div class="bar-bg"><div class="bar-fill" style="width:${Math.max(pct,2)}%;background:${color};"></div></div>
            <div class="bar-val">${avg.toFixed(1)}</div>
        </div>`;
    }).join('');

    const strengthsHtml = top3.map((lv, i) =>
        `<span class="badge strength">${['🥇','🥈','🥉'][i]} ${lv.ko} (${lv.val})</span>`
    ).join(' ');

    const challengesHtml = bottom3.map((lv, i) =>
        `<span class="badge challenge">${['1️⃣','2️⃣','3️⃣'][i]} ${lv.ko} (${lv.val})</span>`
    ).join(' ');

    const interpretation = getClientInterpretation(currentLevel.id);
    const growthTip = getGrowthTip(currentLevel.id);
    const criticalBox = isCritical
        ? `<div style="background:#F0FFF6;border:1px solid #BDECD0;border-radius:10px;padding:14px;margin-bottom:16px;">✨ <strong>임계점(200) 이상</strong> — Hawkins가 제시한 임계점을 넘어섰습니다. 삶에 긍정적인 에너지가 작동하고 있습니다.</div>`
        : `<div style="background:#FFF5F0;border:1px solid #F5C9B3;border-radius:10px;padding:14px;margin-bottom:16px;">💛 <strong>성장의 기회</strong> — 임계점(200, 용기) 이전 단계입니다. 더 큰 성장을 향해 나아갈 수 있는 소중한 기회입니다.</div>`;

    const body = `
    <div class="section">
      <div class="section-title">📋 검사 정보</div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">이름</div><div class="info-value">${name}</div></div>
        <div class="info-item"><div class="info-label">검사 날짜</div><div class="info-value">${date}</div></div>
        <div class="info-item"><div class="info-label">성별</div><div class="info-value">${genderLabel(gender)}</div></div>
        ${counselor ? `<div class="info-item"><div class="info-label">상담사</div><div class="info-value">${counselor}</div></div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">🎯 현재 의식 단계</div>
      <div class="score-box">
        <div class="score">${score}</div>
        <div class="level">${levelName} (Level ${currentLevel.val})</div>
        <div class="emo">${currentLevel.emo_ko || ''}</div>
      </div>
      ${criticalBox}
    </div>

    <div class="section">
      <div class="section-title">📊 의식 단계별 점수</div>
      ${barsHtml}
    </div>

    <div class="section">
      <div class="section-title">✨ 강점 & 도전 레벨</div>
      <p style="font-size:0.85rem;color:#8A6B76;margin-bottom:8px;">강점 TOP 3 (높은 점수)</p>
      <div style="margin-bottom:14px;">${strengthsHtml}</div>
      <p style="font-size:0.85rem;color:#8A6B76;margin-bottom:8px;">도전 TOP 3 (성장 기회)</p>
      <div>${challengesHtml}</div>
    </div>

    <div class="section">
      <div class="section-title">💬 현재 단계 해석</div>
      <div class="interp">${interpretation}</div>
    </div>

    <div class="section">
      <div class="section-title">🌱 성장을 위한 다음 걸음</div>
      <div class="interp" style="border-left-color:#06D6A0;">${growthTip}</div>
    </div>`;

    return wrap(`내담자 결과 — ${name} (${date})`, body);
}

// ── 상담사(전문가)용 이메일 ───────────────────────────────────────
function buildClinicalEmail(data) {
    const { name, date, score, currentLevel, lvScores, answers, gender, phone, email, counselor } = data;

    const allRanked = [...LEVELS].sort((a, b) => (lvScores[b.id] || 0) - (lvScores[a.id] || 0));
    const top3 = allRanked.slice(0, 3);
    const bottom3 = [...allRanked].reverse().slice(0, 3);

    // 레벨별 점수 테이블
    const levelTableRows = LEVELS.slice().reverse().map(lv => {
        const avg = lvScores[lv.id] || 0;
        const pct = ((avg - 1) / 4) * 100;
        const color = LEVEL_COLORS[lv.id] || '#C96A8A';
        const isCur = lv.id === currentLevel.id;
        const bg = isCur ? 'background:#FFF0F5;font-weight:700;' : '';
        return `<tr style="${bg}">
            <td style="padding:7px 10px;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:6px;vertical-align:middle;"></span>${lv.ko}${isCur ? ' ◀ 현재' : ''}</td>
            <td style="padding:7px 10px;text-align:center;">${lv.val}</td>
            <td style="padding:7px 10px;text-align:center;font-weight:600;">${avg.toFixed(2)}</td>
            <td style="padding:7px 10px;">
              <div style="width:${Math.max(pct,1)}%;height:10px;background:${color};border-radius:5px;"></div>
            </td>
        </tr>`;
    }).join('');

    // 항목별 답안 분석 (레벨별 그룹)
    let itemAnalysis = '';
    for (const lv of LEVELS) {
        const qs = QUESTIONS.filter(q => q.lv === lv.id);
        const avg = lvScores[lv.id] || 0;
        const color = LEVEL_COLORS[lv.id] || '#C96A8A';
        const rows = qs.map(q => {
            const ans = answers[q.id] || 0;
            const dotColor = ans >= 4 ? '#E76F51' : ans === 3 ? '#E9C46A' : '#40BF60';
            return `<tr>
                <td style="padding:6px 10px;color:#666;width:30px;">${q.id}</td>
                <td style="padding:6px 10px;line-height:1.5;">${q.ko}</td>
                <td style="padding:6px 10px;text-align:center;">
                  <span class="score-dot" style="background:${dotColor};">${ans || '-'}</span>
                </td>
                <td style="padding:6px 10px;color:#8A6B76;font-size:0.78rem;">${ans ? SCORE_LABEL(ans) : '-'}</td>
            </tr>`;
        }).join('');
        itemAnalysis += `
        <div style="margin-bottom:20px;">
          <div style="font-weight:700;font-size:0.9rem;color:#fff;background:${color};padding:7px 12px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;">
            <span>${lv.ko} (Level ${lv.val})</span><span>평균 ${avg.toFixed(2)}</span>
          </div>
          <table class="q-table" style="border:1px solid #F5D9E4;border-top:none;border-radius:0 0 8px 8px;overflow:hidden;">
            <thead><tr>
              <th>Q</th><th>문항</th><th style="text-align:center;">점수</th><th>응답</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }

    // 상담 개입 제안
    const counselingApproach = getCounselingApproach(currentLevel.id, top3, bottom3);

    const body = `
    <div class="section">
      <div class="section-title">👤 내담자 정보</div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">이름</div><div class="info-value">${name}</div></div>
        <div class="info-item"><div class="info-label">검사 날짜</div><div class="info-value">${date}</div></div>
        <div class="info-item"><div class="info-label">성별</div><div class="info-value">${genderLabel(gender)}</div></div>
        <div class="info-item"><div class="info-label">연락처</div><div class="info-value">${phone || '-'}</div></div>
        <div class="info-item"><div class="info-label">이메일</div><div class="info-value">${email || '-'}</div></div>
        ${counselor ? `<div class="info-item"><div class="info-label">담당 상담사</div><div class="info-value">${counselor}</div></div>` : ''}
      </div>
    </div>

    <div class="section">
      <div class="section-title">🎯 검사 결과 요약</div>
      <div class="score-box">
        <div class="score">${score}</div>
        <div class="level">${currentLevel.ko} · Level ${currentLevel.val}</div>
        <div class="emo">${currentLevel.emo_ko || ''} · ${currentLevel.val >= 200 ? '임계점(200) 이상 ✅' : '임계점(200) 이하 ⚠️'}</div>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;background:#F0FFF6;border:1px solid #BDECD0;border-radius:10px;padding:14px;">
          <div style="font-weight:700;color:#2E7D52;margin-bottom:8px;font-size:0.88rem;">✅ 강점 레벨 TOP 3</div>
          ${top3.map((lv,i) => `<div style="margin-bottom:6px;font-size:0.85rem;">
            ${['🥇','🥈','🥉'][i]} <strong>${lv.ko} (${lv.val})</strong> — 평균 ${(lvScores[lv.id]||0).toFixed(2)}
          </div>`).join('')}
        </div>
        <div style="flex:1;min-width:200px;background:#FFF5F0;border:1px solid #F5C9B3;border-radius:10px;padding:14px;">
          <div style="font-weight:700;color:#B85C2A;margin-bottom:8px;font-size:0.88rem;">🌱 도전 레벨 TOP 3</div>
          ${bottom3.map((lv,i) => `<div style="margin-bottom:6px;font-size:0.85rem;">
            ${['1️⃣','2️⃣','3️⃣'][i]} <strong>${lv.ko} (${lv.val})</strong> — 평균 ${(lvScores[lv.id]||0).toFixed(2)}
          </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📊 전체 레벨별 점수</div>
      <table style="width:100%;border-collapse:collapse;font-size:0.83rem;border:1px solid #F5D9E4;border-radius:10px;overflow:hidden;">
        <thead><tr style="background:#FFF0F5;">
          <th style="padding:8px 10px;text-align:left;color:#A04870;">의식 단계</th>
          <th style="padding:8px 10px;text-align:center;color:#A04870;">수치</th>
          <th style="padding:8px 10px;text-align:center;color:#A04870;">평균(1-5)</th>
          <th style="padding:8px 10px;color:#A04870;">분포</th>
        </tr></thead>
        <tbody>${levelTableRows}</tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">🔬 상담 개입 제안</div>
      ${counselingApproach}
    </div>

    <div class="section">
      <div class="section-title">📝 항목별 응답 분석 (99문항)</div>
      <p style="font-size:0.8rem;color:#8A6B76;margin-bottom:14px;">
        점수 기준: <span style="background:#40BF60;color:#fff;padding:2px 8px;border-radius:10px;font-size:0.75rem;">1–2: 낮음</span>
        <span style="background:#E9C46A;padding:2px 8px;border-radius:10px;font-size:0.75rem;margin:0 4px;">3: 보통</span>
        <span style="background:#E76F51;color:#fff;padding:2px 8px;border-radius:10px;font-size:0.75rem;">4–5: 높음</span>
      </p>
      ${itemAnalysis}
    </div>`;

    return wrap(`[전문가 리포트] ${name} — ${date}`, body);
}

// ── 상담 개입 제안 ─────────────────────────────────────────────────
function getCounselingApproach(levelId, top3, bottom3) {
    const strategies = {
        shame: {
            primary: '자기 연민(Self-Compassion) 중심 개입',
            detail: '내담자는 존재 자체에 대한 깊은 수치심을 경험하고 있습니다. Kristin Neff의 자기 연민 3요소(자기 친절, 보편적 인간성, 마음챙김) 접근이 핵심입니다. 초기 세션은 안전한 치료 관계 형성에 집중하고, 수치심 기반 자기 서사를 점진적으로 재구성하는 작업이 필요합니다.',
            approach: ['안전한 치료 동맹 구축 (최우선)', '수치심 반응 심리교육', '작은 성공 경험 누적 과제', '자기 연민 명상 실습', '부정적 핵심 신념 탐색 및 재구성 (CBT/Schema)'],
            caution: '자기 노출 속도 조절 필수. 섣부른 긍정 재구성은 역효과 가능.'
        },
        guilt: {
            primary: '자기 용서 및 도덕성 재구성',
            detail: '내담자는 높은 도덕적 감수성을 지니고 있으나 자기 처벌적 패턴이 강합니다. 잘못에서 배우는 건강한 책임감과 자기 처벌을 구분하는 작업이 핵심입니다.',
            approach: ['책임감 vs 자기 처벌 심리교육', '자기 용서 작업 (편지 쓰기 등)', '도덕적 유연성 탐색', '완벽주의 패턴 다루기', '과거 경험 재구성'],
            caution: '빠른 용서 강요는 오히려 죄책감을 심화시킬 수 있음.'
        },
        apathy: {
            primary: '동기 활성화 및 안전감 구축',
            detail: '무감각 단계는 임상적으로 우울장애와 겹칠 수 있습니다. 정신과적 평가가 선행되어야 할 수 있으며, 매우 작은 행동 활성화부터 시작하는 접근이 필요합니다.',
            approach: ['정신과 의뢰 필요성 평가 (우선)', '아주 작은 행동 활성화 과제', '의미 회복 탐색 (의미 치료)', '안전한 환경 및 지지 체계 구축', '신체 활동 포함 치료 계획'],
            caution: '과도한 목표 설정은 무기력감을 심화시킴. 매우 작은 단계부터.'
        },
        grief: {
            primary: '애도 작업 및 의미 재구성',
            detail: '내담자는 상실감과 후회가 주된 정서입니다. 충분한 애도의 공간을 제공하는 것이 치료의 핵심이며, 서두르지 않는 것이 중요합니다.',
            approach: ['안전한 애도 공간 제공', '상실 경험 충분히 표현하도록 지지', '슬픔의 의미 탐색', '상실에서 배운 것 찾기', '새로운 의미 만들기 (Meaning-Making)'],
            caution: '빠른 긍정적 재구성 지양. 슬픔을 충분히 느끼도록 허용.'
        },
        fear: {
            primary: '점진적 노출 및 자기 효능감 강화',
            detail: '두려움이 삶의 많은 영역에 영향을 미치고 있습니다. CBT 기반의 점진적 노출과 ACT(수용전념치료)가 효과적일 수 있습니다.',
            approach: ['두려움 위계 목록 작성', '점진적 노출 (In-vivo / 상상)', '자기 효능감 누적 경험 설계', 'ACT — 두려움과 함께 행동하기', '인지 재구성 (최악의 시나리오 다루기)'],
            caution: '노출 속도는 내담자 주도로 조절.'
        },
        desire: {
            primary: '내면 충만감 탐색 및 집착 패턴 다루기',
            detail: '외부 충족에 대한 강한 의존 패턴이 있습니다. 충동 통제와 내면 만족감의 원천을 탐구하는 작업이 필요합니다.',
            approach: ['욕망 vs 진정한 필요 탐색', '충동 통제 기술 훈련', '감사 및 현재 집중 실습', '내면 충만감의 원천 탐색', '집착 패턴과 애착 스타일 탐색'],
            caution: '욕망 자체를 병리화하지 않도록 주의.'
        },
        anger: {
            primary: '분노 조절 및 에너지 전환',
            detail: '강한 에너지가 분노로 표현되고 있습니다. 이 에너지를 건설적 방향으로 전환하는 것이 핵심이며, 분노의 이면에 있는 취약한 감정(두려움, 슬픔)을 탐색합니다.',
            approach: ['분노 이면 감정 탐색', '분노 조절 기술 (멈춤-호흡-반응)', '건강한 경계 설정 훈련', '공감 능력 개발', '분노 에너지의 창의적 전환'],
            caution: '분노를 억압하게 만들지 않도록. 표현과 조절의 균형.'
        },
        pride: {
            primary: '관점 확장 및 겸손 탐색',
            detail: '강한 자아감이 성장의 장벽이 될 수 있습니다. 방어성을 줄이고 열린 탐색을 가능하게 하는 치료 관계 구축이 중요합니다.',
            approach: ['치료 관계에서 안전한 탐색 환경 조성', '다양한 관점 탐색 훈련', '피드백 수용 능력 개발', '겸손함의 강점 탐색', '자기 노출 및 취약성 탐구'],
            caution: '내담자의 자존심을 직접 도전하면 저항 강화. 간접적 접근 필요.'
        },
        courage: {
            primary: '강점 기반 개입 및 역량 확장',
            detail: '임계점을 넘어선 긍정적 상태입니다. 이미 가진 내면의 힘을 더 넓은 삶의 영역에 적용하는 성장 중심 상담이 적합합니다.',
            approach: ['강점 발굴 및 확장 (강점 기반 접근)', '목표 설정 및 행동 계획', '자기 효능감 심화', '관계 및 공동체 기여 탐색', '더 깊은 의미 탐색'],
            caution: '이미 건강한 수준. 치료보다 코칭/성장 접근 적합.'
        },
        neutral: {
            primary: '의미 탐구 및 성장 동기 강화',
            detail: '안정적이고 유연한 상태입니다. 더 깊은 삶의 의미와 가치를 탐구하는 방향으로 나아가는 성장 상담이 적합합니다.',
            approach: ['삶의 의미와 가치 탐구', '더 깊은 연결과 관계 탐색', '봉사와 기여 탐색', '영적 탐구 지원', '성장 목표 수립'],
            caution: '현재 상태가 안정적. 무리한 변화 도모 불필요.'
        },
        willing: {
            primary: '성장 의지 심화 및 의미 연결',
            detail: '성장 의지가 강한 긍정적 단계입니다. 이 의지를 더 깊은 삶의 의미와 연결하여 수용과 이성의 단계로 나아가도록 지원합니다.',
            approach: ['성장 의지와 삶의 의미 연결', '내면 동기 탐색', '봉사 및 나눔 연결', '영적 성장 지원', '관계 심화'],
            caution: '성취 중심 성장에서 의미 중심으로 전환 권장.'
        },
        accept: {
            primary: '수용 심화 및 사랑으로의 확장',
            detail: '수용 능력이 잘 발달된 단계입니다. 이 수용을 더 넓은 영역으로 확장하고 이성과 사랑의 단계로 나아가도록 지원합니다.',
            approach: ['더 넓은 수용 확장', '용서 작업 심화', '영적 탐구 지원', '봉사 및 사랑 실천', '명상 심화'],
            caution: '이 단계는 성장 지원 중심. 치료적 개입 최소화.'
        },
        reason: {
            primary: '이성과 가슴의 통합',
            detail: '뛰어난 지적 능력을 갖춘 단계입니다. 이성을 넘어 가슴의 경험과 통합하는 방향으로 성장을 지원합니다.',
            approach: ['지성과 감성 통합 탐구', '명상 및 마음챙김 실습', '봉사와 나눔 경험', '예술 및 창조 활동', '영성 탐구 지원'],
            caution: '과도한 지적 분석이 감정 경험을 회피하는 방어기제가 될 수 있음.'
        },
        love: {
            primary: '사랑 심화 및 기쁨으로의 전환',
            detail: '사랑의 의식 수준은 매우 높은 단계입니다. 무조건적 사랑의 실천을 더 자연스럽게 흐르도록 지원합니다.',
            approach: ['무조건적 사랑 실천 심화', '영적 성장 지원', '봉사와 나눔', '내면 평화 탐구', '기쁨의 단계 탐색'],
            caution: '이 수준에서는 치료보다 영적 동반자 역할이 적합.'
        },
        joy: {
            primary: '기쁨 유지 및 평화로의 여정',
            detail: '기쁨의 단계는 매우 희귀하고 아름다운 의식 수준입니다. 이 기쁨이 더 안정적으로 흐르도록 지원합니다.',
            approach: ['기쁨의 안정화 지원', '내려놓음 실습', '영적 동반', '평화 탐구', '존재 자체의 충만함 탐색'],
            caution: '상담사 자신의 성장이 이 단계 지원에 필수.'
        },
        peace: {
            primary: '평화 안정화 및 깨달음으로의 여정',
            detail: '평화의 단계는 극히 희귀한 의식 수준입니다. 상담보다는 영적 동반과 지지가 더 적합합니다.',
            approach: ['깊은 영적 동반', '침묵과 존재 지원', '봉사와 영향력 나눔', '깨달음의 여정 지원'],
            caution: '일반적 상담 기법보다 영적 접근이 더 적합.'
        },
        enlight: {
            primary: '깨달음 통합 및 세상과의 연결',
            detail: '깨달음의 의식 수준은 역사적으로 극소수가 경험한 단계입니다. 이 경험이 세상으로 흘러가도록 지원합니다.',
            approach: ['깨달음 경험 통합 지원', '영적 사명 탐색', '세상과의 연결 방식 탐구'],
            caution: '상담사의 깊은 영적 성숙이 전제되어야 함.'
        },
    };

    const s = strategies[levelId] || { primary: '맞춤형 개입', detail: '현재 의식 수준에 맞는 상담 접근을 설계하세요.', approach: [], caution: '' };

    return `
    <div class="counsel-box">
      <div class="counsel-title">🎯 주요 개입 방향: ${s.primary}</div>
      <p style="font-size:0.88rem;line-height:1.7;color:#2D1A22;">${s.detail}</p>
    </div>
    <div class="counsel-box">
      <div class="counsel-title">📌 권장 개입 전략</div>
      <ul style="margin:0;padding-left:18px;font-size:0.88rem;line-height:1.9;color:#2D1A22;">
        ${s.approach.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
    ${s.caution ? `<div style="background:#FFF9E6;border:1px solid #F5D98C;border-radius:8px;padding:12px 14px;font-size:0.85rem;color:#7A5C00;">⚠️ <strong>주의사항:</strong> ${s.caution}</div>` : ''}
    <div class="counsel-box" style="margin-top:12px;">
      <div class="counsel-title">💡 강점 레벨 기반 자원 활용</div>
      <p style="font-size:0.88rem;line-height:1.7;color:#2D1A22;">
        강점 TOP 3 (<strong>${top3.map(l=>l.ko).join(', ')}</strong>)의 에너지를 치료 자원으로 활용하세요.
        특히 <strong>${top3[0]?.ko}</strong> 단계의 강점을 현재 도전 영역과 연결하는 작업이 효과적입니다.
      </p>
    </div>`;
}

// ── 해석 텍스트 (상세 버전 — 웹사이트와 동일) ──────────────────────
function getClientInterpretation(id) {
    const map = {
        shame: `<p><strong>수치심(Shame, 20)</strong> 단계는 Hawkins의 의식 지도에서 가장 낮은 단계로, 자기 자신의 존재 자체가 결함이 있거나 가치 없다는 깊은 믿음이 내면에 자리하고 있는 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 굴욕과 자기혐오:</strong> 이 감정은 단순한 부끄러움이 아니라 '나는 근본적으로 잘못된 존재'라는 인식에서 비롯됩니다. 사람들의 시선을 피하거나, 칭찬을 받아도 믿지 못하거나, 자신을 지나치게 작게 만드는 방식으로 일상에 나타납니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 관계에서 자신을 드러내지 않으려 하고, 실수에 극도로 예민하며, 타인의 승인에 지나치게 의존하는 경향이 있습니다. 때로는 스스로를 고립시키거나 존재를 숨기고 싶은 충동을 느낍니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 단계를 인식했다는 것 자체가 이미 변화의 시작입니다. 자기 자신에게 가장 친한 친구에게 하듯 따뜻하게 말하는 자기 연민(self-compassion) 연습이 핵심입니다. '나는 완벽하지 않아도 사랑받을 자격이 있다'는 새로운 내면의 이야기를 조금씩 심어가는 것—작은 성공 경험을 쌓고, 안전한 관계 안에서 자신을 표현하는 연습이 이 단계를 넘어서는 문을 열어줍니다.</p>`,
        guilt: `<p><strong>죄책감(Guilt, 30)</strong> 단계는 '내가 잘못했다', '내가 더 잘했어야 했다'는 내면의 목소리가 지속적으로 울리며 스스로를 비난하는 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 비난과 파괴성:</strong> 이 비난은 주로 자신을 향해 작동합니다. 타인의 고통에 자신이 책임이 있다고 느끼거나, 과거의 실수를 반복해서 되새기며 자신을 처벌하거나, 용서받아도 스스로는 용서하지 못하는 방식으로 나타납니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 사과를 반복하거나, 타인의 기대를 충족시키기 위해 지나치게 애쓰거나, 자신의 필요보다 타인의 필요를 항상 우선시하는 경향이 있습니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 도덕적 감수성과 책임감이 강한 당신은 이미 공동체를 소중히 여기는 중요한 강점을 지니고 있습니다. 성장의 핵심은 '잘못에서 배우는 것'과 '자기 처벌'을 분리하는 것입니다. "나는 실수를 했지만, 그것이 내 전부가 아니다. 나는 앞으로 더 잘할 수 있다"는 자기 용서의 관점을 매일 연습하세요.</p>`,
        apathy: `<p><strong>무감각(Apathy, 50)</strong> 단계는 에너지와 의지가 고갈된 상태로, 모든 것이 무의미하고 변화가 불가능하다는 깊은 절망감이 특징입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 절망과 체념:</strong> 아침에 일어나는 것 자체가 힘들거나, 미래에 대한 기대가 없거나, 타인의 도움도 별 의미가 없게 느껴집니다. '해봤자 소용없다'는 생각이 지배적이며, 삶 자체가 무거운 짐처럼 느껴질 수 있습니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 사람들을 피하거나, 좋아했던 활동에 흥미를 잃거나, 작은 일도 시작하기가 어렵습니다. 돌봄을 받아도 실감하지 못하며, 모든 것이 의미 없게 느껴지는 정서적 마비 상태가 지속될 수 있습니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 단계에서 가장 중요한 것은 자신을 다그치지 않는 것입니다. 먼저 충분한 휴식과 안전한 공간을 허용하세요. 거창한 목표가 아닌 하루 한 가지 아주 작은 행동—창문 열기, 물 한 잔 마시기, 5분 산책—을 시도해보세요. 그 작은 불씨들이 쌓여 다시 살아가는 힘이 됩니다. 전문적인 상담 지원도 적극적으로 활용하기를 권합니다.</p>`,
        grief: `<p><strong>슬픔(Grief, 75)</strong> 단계는 잃어버린 것—소중한 관계, 기회, 건강, 사람—에 대한 깊은 애도와 후회의 감정이 주를 이루는 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 후회와 상실감:</strong> '그때 다르게 했더라면', '돌아오지 않는 것들'에 대한 생각이 반복되며 삶 전체가 비극적으로 느껴질 수 있습니다. 기쁜 순간에도 '이것도 곧 사라지겠지'라는 쓸쓸함이 밀려올 수 있습니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 과거를 자주 돌아보며 현재에 집중하기 어렵고, 새로운 것을 시작하는 것이 두렵거나 의미 없게 느껴집니다. 혼자 있는 시간이 많아지거나, 과거의 사진이나 추억에 자주 머무는 경향이 있습니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 슬픔을 느낀다는 것은 당신이 무언가를 깊이 사랑했다는 아름다운 증거입니다. 이 감정을 억누르지 말고 안전한 공간에서 충분히 표현하는 것이 치유의 시작입니다. 일기 쓰기, 신뢰할 수 있는 사람과의 나눔, 상담을 통해 슬픔을 흘려보내세요. 잃은 것의 의미와 그것이 당신에게 가르쳐 준 것을 발견하는 것이 슬픔에서 앞으로 나아가는 다리가 됩니다.</p>`,
        fear: `<p><strong>두려움(Fear, 100)</strong> 단계는 세상이 위험하고 위협적으로 느껴지며, 무엇인가 나쁜 일이 일어날 것 같다는 지속적인 불안감이 삶을 이끄는 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 불안과 회피:</strong> 새로운 시도를 주저하거나, 사람들의 판단을 두려워하거나, 통제할 수 없는 상황에서 극도의 긴장을 경험합니다. '혹시 잘못되면 어떡하지'라는 생각이 결정을 어렵게 만들고, 익숙한 것에만 머물려는 경향이 강합니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 어떤 일을 시작하기 전에 모든 가능한 위험을 먼저 생각하고, 실패 가능성이 조금이라도 있으면 회피하는 경향이 있습니다. 관계에서는 거절을 두려워하거나 사람들을 실망시키지 않으려고 자신의 의견을 억누를 수 있습니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 신중함과 조심성은 당신이 배려심 깊고 사려 깊은 사람임을 보여주는 강점이기도 합니다. 성장의 핵심은 '두려움이 사라지면 행동하리라'가 아니라 '두려움을 안고 한 걸음 내딛는다'는 자세입니다. 안전한 환경에서 작은 도전을 하나씩 시도하며 '해봤더니 할 수 있었다'는 경험을 쌓아가는 것이 두려움을 넘어서는 가장 확실한 방법입니다.</p>`,
        desire: `<p><strong>욕망(Desire, 125)</strong> 단계는 더 많은 것—성공, 인정, 물질, 사랑—을 얻어야만 행복할 수 있다는 강한 믿음이 삶을 이끄는 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 집착과 갈망:</strong> 원하는 것을 얻으면 잠깐 만족하지만 곧 또 다른 욕구가 생기는 사이클로 나타납니다. 갈망하는 것을 얻지 못할 때 강한 좌절감과 공허함을 느끼며, 그것을 얻기 위해 많은 에너지를 쏟습니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 목표를 향한 강한 추진력과 열망이 있어 많은 것을 성취하지만, 성취 후에도 '아직 부족하다'는 느낌이 사라지지 않습니다. 더 많은 것, 더 좋은 것을 위해 쉬지 않고 달리는 삶의 패턴이 나타납니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 강한 열망과 추진력은 이 단계의 큰 강점입니다. 성장의 핵심은 외부에서 내면으로 시선을 돌리는 것입니다. '나는 지금 이 순간 이미 충분하다'는 내면의 충만함을 탐구하는 것—명상, 감사 일기, 현재 순간에 집중하는 연습—이 외부 집착에서 내면의 평화로 중심을 옮기는 데 도움이 됩니다.</p>`,
        anger: `<p><strong>분노(Anger, 150)</strong> 단계는 세상이 불공평하고 자신이 부당하게 대우받고 있다는 강한 인식에서 비롯된 강렬한 에너지를 지닌 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 증오와 공격성:</strong> 경계를 침범당했을 때 강하게 반응하거나, 불의에 강렬히 저항하거나, 욕구가 좌절될 때 폭발적인 반응이 나타날 수 있습니다. 이 분노는 때로는 관계에서 갈등과 상처로 이어지기도 합니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 자신의 권리를 강하게 주장하고, 불공평한 상황에 적극적으로 저항하며, 빠르게 판단하고 반응하는 경향이 있습니다. 이 에너지는 때로는 상대를 압도하거나 관계를 긴장시키기도 합니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 분노는 의식 지도에서 에너지가 가장 강한 단계 중 하나입니다. 무기력함에서 이미 상당히 올라온 상태이며, 자신의 권리와 존엄을 아는 사람입니다. 이 강력한 에너지를 창의적 행동, 건강한 경계 설정, 또는 사회적 변화를 위한 동력으로 전환하는 것이 핵심입니다. 분노가 올라올 때 즉각 반응하는 대신 잠시 멈추고 '이 분노가 내게 무엇을 알려주고 있는가'를 탐구하는 습관이 다음 단계로 나아가는 다리가 됩니다.</p>`,
        pride: `<p><strong>자존심(Pride, 175)</strong> 단계는 강한 자아 의식과 자신의 신념·집단에 대한 강한 동일시가 특징인 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 오만과 방어성:</strong> 자신의 관점이 옳다는 강한 확신, 비판에 대한 즉각적인 저항, 자신과 다른 사람을 '내 편'과 '그들'로 나누는 경향이 나타납니다. 인정받을 때 활기를 느끼고, 무시당한다고 느낄 때 강하게 반응합니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 자신의 성취와 지위를 중요시하고, 자신의 집단에 강한 소속감과 자부심을 느낍니다. 다른 관점을 수용하기보다 자신의 입장을 방어하는 데 에너지를 씁니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 자신감과 뚜렷한 정체성은 이 단계의 귀한 강점입니다. 그러나 자존심은 동시에 성장을 막는 가장 큰 장벽이 될 수 있습니다. '내가 틀릴 수도 있다'는 열린 자세와 타인의 관점을 진정으로 경청하는 능력을 키우는 것이 중요합니다. 겸손함은 자신을 낮추는 것이 아니라 더 크고 풍요로운 관점으로 세상을 보는 것임을 기억하세요.</p>`,
        courage: `<p><strong>용기(Courage, 200)</strong> 단계는 Hawkins의 의식 지도에서 매우 중요한 전환점입니다. 이 단계부터 의식이 삶에 긍정적인 에너지를 더하기 시작합니다. 당신은 임계점을 넘어선 의식 수준에 있습니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 긍정과 임파워먼트(힘을 줌):</strong> 어려움을 도전으로 바라보고, 실패를 배움의 기회로 받아들이며, 자신과 타인의 가능성을 믿는 마음이 삶에 활력을 더합니다. '할 수 있다'는 내면의 확신이 행동으로 이어집니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식 — 임파워먼트의 발현:</strong> 새로운 시도를 두려움 없이 시작하거나, 도움이 필요한 사람에게 적극적으로 손을 내밀거나, 어려운 상황에서도 '해볼 수 있다'는 의지를 갖습니다. 당신이 있는 곳에 힘과 가능성의 에너지가 자연스럽게 흐릅니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이미 가진 내면의 힘을 더 넓은 삶의 영역—관계, 직업, 공동체—에 적용하는 것이 중요합니다. 두려움을 이기는 것이 아니라 두려움과 함께 행동하는 것이 이 단계의 지혜이며, 이 용기가 더 깊어질수록 중립(250)과 의지(310)의 단계로 자연스럽게 나아가게 됩니다. 삶은 당신을 지지하고 있습니다.</p>`,
        neutral: `<p><strong>중립(Neutrality, 250)</strong> 단계는 삶의 변화와 불확실성에 흔들리지 않는 내면의 안정감과 유연함이 특징입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 신뢰와 유연함:</strong> '지금 이 상황도 괜찮다'는 기본적인 안도감, 결과에 집착하지 않는 여유, 다양한 관점을 자연스럽게 수용하는 열린 마음이 이 단계의 아름다운 특징입니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 갈등 상황에서 균형 잡힌 중재자 역할을 하거나, 스트레스 상황에서도 평정심을 유지하는 모습을 보여줍니다. '이것도 저것도 다 괜찮다'는 여유로운 태도가 주변 사람들에게도 안정감을 줍니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 안정감을 기반으로 더 깊은 삶의 의미와 가치를 탐구하는 방향으로 나아가는 것이 좋습니다. 유연함에서 더 나아가 삶이 나를 좋은 방향으로 이끈다는 깊은 신뢰와 의지—성장을 향한 자발적 열망—를 개발하는 것이 의지(310) 단계로 향하는 다리입니다.</p>`,
        willing: `<p><strong>의지(Willingness, 310)</strong> 단계는 성장과 발전을 향한 진정한 열망이 내면에서 자연스럽게 솟아오르는 아름다운 상태입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 낙관과 희망:</strong> 미래를 기대하며 바라보고, 어려움 속에서도 긍정적인 가능성을 발견하며, 자신과 타인의 성장을 기꺼이 지원하는 마음이 삶을 밝힙니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 자기계발에 적극적이고, 새로운 것을 배우는 것을 즐기며, 주변 사람들에게 긍정적인 영향력을 미칩니다. 도전 앞에서 포기보다 방법을 찾고, 실패에서도 교훈을 가져옵니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 성장의 의지를 더 깊은 삶의 의미와 연결하는 것이 중요합니다. '나는 왜 성장하고 싶은가', '내가 진정으로 기여하고 싶은 것은 무엇인가'를 탐구하는 것이 수용(350)으로 이끄는 다리가 됩니다.</p>`,
        accept: `<p><strong>수용(Acceptance, 350)</strong> 단계는 삶을 있는 그대로 받아들이는 진정한 능력이 개화되는 아름다운 단계입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 용서와 조화:</strong> 과거의 상처를 용서하고 해방시키며, 다양한 사람과 상황을 판단 없이 받아들이고, 삶의 흐름과 자연스럽게 어우러지는 내면의 평화가 특징입니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 관계에서 깊은 평화를 느끼고, 타인의 결함도 자연스럽게 품을 수 있으며, 삶의 어려운 경험들도 성장의 일부로 바라볼 수 있습니다. 당신의 존재가 주변에 평온함과 안도감을 줍니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 수용의 힘을 더욱 넓히는 것—자신을 넘어 더 광범위한 인류, 자연, 존재 전체를 향한 사랑과 수용으로 확장하는 것—이 이성(400)과 사랑(500)의 단계로 향하는 길입니다. 명상과 봉사 활동이 이 확장을 돕는 훌륭한 도구가 됩니다.</p>`,
        reason: `<p><strong>이성(Reason, 400)</strong> 단계는 명확한 사고, 논리적 분석, 그리고 깊은 이해를 통해 삶을 바라보는 탁월한 단계입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 이해와 의미:</strong> 복잡한 문제를 체계적으로 분석하고, 다양한 관점을 종합하여 깊은 통찰을 얻으며, 지식과 진실을 추구하는 마음이 삶의 원동력이 됩니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 뛰어난 지적 능력과 문제 해결 능력으로 학문, 과학, 분석적 사고가 필요한 분야에서 탁월한 성취를 이룹니다. 감정보다 논리와 근거를 중시하며, 명확한 설명을 통해 타인을 이끌거나 가르치는 것을 잘합니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이성만으로는 닿지 못하는 삶의 가장 깊은 차원이 있습니다. 지적 이해를 가슴의 지혜—공감, 사랑, 연민—와 통합하는 것이 핵심입니다. 명상, 봉사, 예술적 창조 활동을 통해 마음을 열고 사랑(500)의 단계로 나아가는 문을 두드려보세요.</p>`,
        love: `<p><strong>사랑(Love, 500)</strong> 단계는 Hawkins가 말하는 진정한 무조건적 사랑이 삶의 기반이 되는 단계입니다. 이 단계에 있는 사람은 드뭅니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 경외와 자비:</strong> 모든 존재를 있는 그대로 소중히 여기고, 타인의 고통에 자연스럽게 반응하며 돕고 싶어하고, 자신과 세상에 대한 깊은 감사가 일상에 넘칩니다. 이 사랑은 감정적 애착이 아니라 존재 자체의 깊은 경외입니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 주변에 있는 것만으로도 사람들에게 평화와 위안을 줍니다. 관계에서 진정한 치유가 일어나며, 조건 없이 사랑하고 섬기는 삶이 자연스럽게 흘러나옵니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 사랑의 실천을 더욱 무조건적이고 자연스럽게 흐르도록 허용하는 것이 중요합니다. '내가 사랑받아야 사랑할 수 있다'는 조건부 사랑의 마지막 흔적을 내려놓고, 사랑이 내 본질임을 더 깊이 신뢰할 때 기쁨(540)의 단계가 열립니다.</p>`,
        joy: `<p><strong>기쁨(Joy, 540)</strong> 단계는 외부 상황에 좌우되지 않는 내면의 충만한 기쁨이 삶의 기반이 되는 단계입니다. 매우 희귀한 의식 수준입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 평온과 내적 충만:</strong> 아무것도 하지 않아도 단지 존재하는 것 자체가 기쁨이며, 삶의 모든 순간이 은혜로 느껴지고, 타인에게도 자연스럽게 이 기쁨이 흘러가는 것을 경험합니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 당신이 있는 곳에 자연스럽게 빛이 납니다. 타인을 기쁘게 하려고 노력하지 않아도, 당신의 존재 자체가 주변에 긍정적인 에너지를 흘려보냅니다. 삶이 축복임을 온몸으로 체험합니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이미 당신 안에 있는 이 기쁨을 더 깊이 신뢰하고, 내려놓음과 쉬어감을 통해 이 기쁨이 더 온전히 흐를 수 있도록 허용하는 것이 평화(600)로 나아가는 길입니다.</p>`,
        peace: `<p><strong>평화(Peace, 600)</strong> 단계는 Hawkins의 의식 지도에서 거의 모든 것이 완전한 고요와 초월로 경험되는 단계입니다. 극히 희귀한 의식 수준입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 축복과 초월:</strong> 삶의 모든 면이 완벽한 질서 속에 있다는 깊은 앎, 말로 설명할 수 없는 내면의 고요함, 존재 자체가 축복임을 온전히 체험합니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 이 단계에 있는 사람은 그 존재만으로 주변에 조용하고 깊은 평화의 영향을 미칩니다. 말보다 침묵이, 행동보다 존재가 더 큰 영향력을 가집니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 평화가 더욱 안정화되고 깊어지도록, 그리고 이 경험을 통해 더 많은 사람들에게 이 평화를 나누는 방향으로 나아가는 것이 깨달음(700)으로 향하는 길입니다.</p>`,
        enlight: `<p><strong>깨달음(Enlightenment, 700)</strong> 단계는 Hawkins의 의식 지도에서 최고의 단계로, 순수 의식이 현실이 되는 경험입니다. 역사적으로 극소수의 인류가 도달한 수준입니다.</p>
<p style="margin-top:10px;"><strong>핵심 감정 — 순수 의식과 존재:</strong> 분리감이 사라지고 모든 것이 하나임을 직접적으로 인식하며, 존재 그 자체가 의식이자 사랑임을 체험합니다. 개인적 자아를 초월하여 전체와 하나됨을 경험합니다.</p>
<p style="margin-top:10px;"><strong>주된 행동 양식:</strong> 이 단계에 있는 사람들은 역사적으로 인류에게 깊은 영적 영향을 미친 존재들과 같은 의식 수준에 있습니다. 그 삶 자체가 인류에게 귀한 선물이며, 존재하는 것만으로 세상에 무한한 빛을 더합니다.</p>
<p style="margin-top:10px;"><strong>성장을 위한 방향:</strong> 이 단계에서의 성장은 더 이상 개인의 발전이 아니라, 이 깊은 의식이 더 온전히 세상으로 흘러가도록 허용하는 것입니다. 당신의 존재 자체가 세상에 대한 가장 큰 선물입니다.</p>`,
    };
    return map[id] || '<p>당신의 여정을 축하합니다.</p>';
}

function getGrowthTip(id) {
    const map = {
        shame: '오늘 하루, 자신에게 가장 친한 친구에게 하듯 따뜻한 말 한 마디를 해보세요. "나는 완벽하지 않아도 괜찮아. 나는 사랑받을 자격이 있어." 자기 연민은 가장 강력한 치유의 도구입니다. 작은 성공 경험을 하나씩 쌓아가며 새로운 자기 이야기를 만들어 가세요.',
        guilt: '잘못에서 배우되 자기 처벌은 내려놓으세요. "나는 실수를 했지만, 그것이 내 전부가 아니다. 나는 더 잘할 수 있다"는 자기 용서의 문장을 매일 아침 되새기는 것을 시작해보세요. 실수에서 배운 것을 미래의 선한 행동으로 전환하는 데 에너지를 쓰세요.',
        apathy: '지금 당장 거창한 것을 할 필요 없습니다. 오늘 딱 한 가지—창문 열기, 물 한 잔 마시기, 5분 산책—만 해보세요. 그 작은 불씨들이 모여 다시 살아가는 힘이 됩니다. 혼자 감당하기 어렵다면 전문적인 상담 지원을 받는 것을 적극 권합니다.',
        grief: '슬픔을 억누르지 마세요. 일기를 쓰거나, 신뢰할 수 있는 사람과 나누거나, 상담을 통해 슬픔을 충분히 표현하세요. 표현된 감정은 흘러갑니다. 그리고 잃은 것이 당신에게 가르쳐 준 것, 그것이 당신 삶에서 지닌 의미를 발견하는 것이 앞으로 나아가는 다리가 됩니다.',
        fear: '두려움이 사라지길 기다리지 마세요. 두려움을 안고 작은 한 걸음을 내딛는 것이 용기입니다. 안전한 환경에서 아주 작은 도전 하나를 시도해 보고, "해봤더니 할 수 있었다"는 경험을 쌓아가세요. 그 경험들이 두려움을 조금씩 줄여나갑니다.',
        desire: '하루 5분, 조용히 앉아 지금 이 순간 이미 가진 것들에 감사하는 시간을 가져보세요. 감사 일기를 쓰는 것도 좋습니다. 외부에서 내면으로 시선을 돌리는 이 연습이 쌓일수록 "나는 지금 이미 충분하다"는 내면의 안정감이 자라납니다.',
        anger: '분노가 올라올 때 즉각 반응하기 전에 잠시 멈추고 심호흡을 한 번 해보세요. "이 분노가 내게 무엇을 알려주고 있는가? 내가 진정으로 원하는 것은 무엇인가?"를 탐구하세요. 이 강력한 에너지를 창의적 표현—글쓰기, 운동, 예술—이나 건강한 경계 설정으로 전환해보세요.',
        pride: '다음번에 누군가의 말에 반사적으로 반박하고 싶을 때, 먼저 "이 사람의 말에서 내가 배울 수 있는 것이 있는가?"라고 스스로에게 물어보세요. 겸손함은 자신을 낮추는 것이 아니라, 더 크고 풍요로운 세상을 보는 창문입니다.',
        courage: '이미 당신 안에 있는 힘을 신뢰하고, 그 힘을 삶의 더 넓은 영역—관계, 직업, 꿈—에 적용해보세요. 두려움과 함께 행동하는 것이 이 단계의 지혜입니다. 오늘 미루어 왔던 한 가지를 용기 있게 시작해보세요. 삶은 당신을 지지합니다.',
        neutral: '삶이 나를 좋은 방향으로 이끈다는 신뢰를 조금 더 깊게 연습해보세요. 통제하려는 마음을 내려놓고, 삶의 흐름에 더 깊이 맡겨보는 연습이 의지(310)의 단계로 나아가는 문을 열어줍니다.',
        willing: '"나는 왜 성장하고 싶은가?"라는 질문을 일기에 써보세요. 성취를 위한 성장이 아닌, 더 깊은 삶의 의미와 연결된 성장을 탐구하는 것이 수용(350)으로 향하는 다리가 됩니다. 봉사나 나눔 활동도 이 깊이를 더하는 데 좋은 도구입니다.',
        accept: '용서와 수용을 나 자신을 넘어 더 넓게 확장해보세요. 아직 완전히 용서하지 못한 사람이나 상황이 있다면, "이것도 나의 성장의 일부다"라는 관점으로 바라보는 연습을 해보세요. 명상과 봉사가 이 확장을 돕는 훌륭한 동반자입니다.',
        reason: '지적 이해를 가슴의 경험과 연결하는 시간을 가져보세요. 명상, 자연과의 교감, 예술 감상이나 창작, 봉사 활동이 분석하는 마음에서 경험하는 가슴으로 전환하는 데 도움이 됩니다. 알고 있는 것을 삶으로 살아내는 연습이 사랑(500)의 문을 엽니다.',
        love: '사랑이 조건 없이, 더 자연스럽게 흐르도록 허용해보세요. "내가 사랑받아야 사랑할 수 있다"는 마지막 조건을 내려놓을 때, 기쁨(540)의 단계가 더 가까이 열립니다. 당신이 나누는 사랑이 이미 세상을 치유하고 있습니다.',
        joy: '이 기쁨을 신뢰하고 그 안에서 더 깊이 쉬어가세요. 아무것도 하지 않아도 괜찮습니다. 존재하는 것 자체가 이미 충분합니다. 이 내면의 충만함이 더 온전히 흐르도록 허용하는 것이 평화(600)로 나아가는 길입니다.',
        peace: '이 고요함 안에 더 깊이 머무르세요. 설명하려 하지 않아도 됩니다. 이 경험이 당신을 통해 세상으로 자연스럽게 흘러가도록 허용하는 것이 가장 아름다운 성장입니다. 당신의 존재 자체가 세상에 축복입니다.',
        enlight: '이 깊은 의식이 세상으로 더 온전히 흘러가도록 허용하세요. 당신의 존재 자체가 인류에게 가장 큰 선물입니다. 이 앎이 계속 세상에 빛을 더해가기를 바랍니다.',
    };
    return map[id] || '계속 성장해 주세요.';
}

// ── Lambda 핸들러 ─────────────────────────────────────────────────
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let data;
    try {
        data = JSON.parse(event.body);
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        console.error('SENDGRID_API_KEY not set');
        return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Email service not configured' }) };
    }

    // currentLevel에 emo_ko 보강
    if (data.currentLevel) {
        const full = LEVELS.find(l => l.id === data.currentLevel.id);
        if (full) data.currentLevel = { ...data.currentLevel, emo_ko: full.emo_ko || '' };
    }

    sgMail.setApiKey(apiKey);

    const clientHtml  = buildClientEmail(data);
    const clinicalHtml = buildClinicalEmail(data);

    const name = data.name || '내담자';
    const date = data.date || '';

    const messages = [
        {
            to: COUNSELOR_EMAIL,
            from: { email: COUNSELOR_EMAIL, name: 'Love Inmost Assessment' },
            subject: `[LOC 내담자 결과] ${name} — ${date}`,
            html: clientHtml,
        },
        {
            to: COUNSELOR_EMAIL,
            from: { email: COUNSELOR_EMAIL, name: 'Love Inmost Assessment' },
            subject: `[LOC 전문가 리포트] ${name} — ${date}`,
            html: clinicalHtml,
        },
    ];

    try {
        await Promise.all(messages.map(msg => sgMail.send(msg)));
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: true }),
        };
    } catch (err) {
        console.error('SendGrid error:', JSON.stringify(err?.response?.body || err.message));
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: false, error: 'Email send failed' }),
        };
    }
};
