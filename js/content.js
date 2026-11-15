/* =========================================================
   STOA — course content
   Exercise helpers keep the data compact.
   ========================================================= */

const LEARN = (title, body, quote, by) => ({ t: 'learn', title, body, quote, by });
const MC = (q, options, a, why) => ({ t: 'mc', q, options, a, why });
const TF = (q, a, why) => ({ t: 'mc', q, options: ['True', 'False'], a: a ? 0 : 1, why, noShuffle: true });
const FILL = (text, options, a, by, why) => ({ t: 'fill', text, options, a, by, why });
const ORDER = (answer, by, extra = []) => ({ t: 'order', answer, by, extra });
const MATCH = (q, pairs) => ({ t: 'match', q, pairs });
const SORT = (q, labels, items) => ({ t: 'sort', q, labels, items });
const SCEN = (situation, options) => ({ t: 'scenario', situation, options });
const REFLECT = (prompt, hint) => ({ t: 'reflect', prompt, hint });

const UNITS = [
  /* ------------------------------------------------------ */
  {
    id: 'u1', title: 'The Painted Porch', sub: 'Where it all began', icon: '🏛️', color: '#b5653a',
    lessons: [
      {
        id: 'u1l1', title: 'A Shipwreck', icon: '⛵',
        items: [
          LEARN('A lucky disaster',
            `Around <b>300 BCE</b>, a merchant called <b>Zeno of Citium</b> was shipwrecked and lost his cargo. Stuck in Athens, he wandered into a bookshop, read about Socrates, and asked where he could find a man like that. The bookseller pointed at a passing philosopher: <i>"Follow him."</i>`,
            'I made a prosperous voyage when I suffered shipwreck.', 'Zeno of Citium (via Diogenes Laertius)'),
          LEARN('Why "Stoic"?',
            `Zeno later taught in public, at the <b>Stoa Poikilē</b>, the "Painted Porch", a colonnade in the Athenian marketplace. His followers were named after the place: <b>Stoics</b>, "the porch people".<br><br>It was philosophy for the street rather than an ivory tower.`),
          MC('Where did Zeno teach?', ['A painted colonnade in Athens', 'The Roman Senate', 'A temple in Egypt', 'A cave outside Sparta'], 0,
            'The Stoa Poikilē (Painted Porch) was a public colonnade. "Stoic" comes from "stoa".'),
          MC('What started Zeno on the path to philosophy?', ['Losing everything in a shipwreck', 'Winning a war', 'A dream from the gods', 'Inheriting a library'], 0,
            'Losing everything is what led him to philosophy. That is very Stoic: the disaster became the way.'),
          TF('Stoicism began as a private, secretive cult for the elite.', false,
            'It was taught in a public space and drew merchants, ex-slaves, senators and eventually an emperor.'),
          FILL('I made a prosperous voyage when I suffered ___.', ['shipwreck', 'victory', 'fortune', 'exile'], 0, 'Zeno',
            'Zeno saw his worst loss as his best voyage. Remember this line. It sums up a lot of Stoicism.'),
          REFLECT('Think of a "shipwreck" in your own life: a loss that, looking back, sent you somewhere good. What was it?',
            'Practising this kind of hindsight makes it easier to see the next setback the same way.')
        ]
      },
      {
        id: 'u1l2', title: 'The Good Life', icon: '🌿',
        items: [
          LEARN('The goal: eudaimonia',
            `Every ancient school asked: <b>what is a good life?</b> The Greek answer was <b>eudaimonia</b>, often translated "happiness" but closer to <i>flourishing</i>: a life that goes well all the way through.<br><br>The Stoic claim is radical: <b>virtue (excellence of character) is the only true good</b>, and it is enough for flourishing.`),
          LEARN('Live according to nature',
            `The Stoic motto was <b>"live in agreement with nature."</b> For humans that means living by <b>reason</b>, since reason is what is special about us, and living <b>socially</b>, because we are built to cooperate.<br><br>It does not mean "go live in the woods."`,
            'At dawn, when you have trouble getting out of bed, tell yourself: "I have to go to work — as a human being."', 'Marcus Aurelius, Meditations 5.1'),
          MC('What does "eudaimonia" mean most nearly?', ['Flourishing / living well', 'Pleasure', 'Wealth', 'Fame'], 0,
            'Eudaimonia is flourishing. It is about a whole life going well, not a passing good mood.'),
          MC('For the Stoics, what is the ONLY true good?', ['Virtue', 'Health', 'Money', 'Pleasure'], 0,
            'Health, money and pleasure are "indifferents". They are nice, but they do not make you good. Only virtue does.'),
          MC('"Live according to nature" means, for a human being…', ['Live by reason and as a social creature', 'Abandon technology', 'Follow every instinct', 'Avoid other people'], 0,
            'Our nature is rational and social, so living by nature means thinking clearly and acting for the common good.'),
          TF('A Stoic believes a person can flourish even in poverty or illness.', true,
            'Because virtue is the only good and it is always available to you, no external circumstance can stop you living well.'),
          FILL('At dawn… tell yourself: "I have to go to work — as a ___ ___."', ['human being', 'loyal soldier', 'rich man', 'good emperor'], 0, 'Marcus Aurelius 5.1',
            'Even an emperor struggled to get out of bed. His fix was to remember what a human being is for.'),
          REFLECT('If someone watched you for a week, what would they say you believe the "good life" is? Be honest.',
            'Compare it with what you would like them to say.')
        ]
      },
      {
        id: 'u1l3', title: 'The Big Three', icon: '📜',
        items: [
          LEARN('Three Romans you will meet often',
            `Most surviving Stoic writing comes from three Romans:<br><br>🖋️ <b>Seneca</b> (c. 4 BCE–65 CE): a statesman, playwright and Nero's adviser who wrote letters full of practical advice.<br>⛓️ <b>Epictetus</b> (c. 50–135 CE): born a slave, later a teacher. His student Arrian recorded his lessons.<br>👑 <b>Marcus Aurelius</b> (121–180 CE): Roman emperor. He wrote a private journal we now call <i>Meditations</i>.`),
          MATCH('Match the Stoic to their life', [
            ['Seneca', 'Adviser to Nero'], ['Epictetus', 'Born a slave'], ['Marcus Aurelius', 'Roman emperor'], ['Zeno', 'Shipwrecked merchant']
          ]),
          MATCH('Match the Stoic to their writing', [
            ['Marcus Aurelius', 'Meditations'], ['Seneca', 'Letters to Lucilius'], ['Epictetus', 'Discourses & Enchiridion'], ['Arrian', 'Recorded Epictetus']
          ]),
          TF('Marcus Aurelius wrote the Meditations to be published as a self-help book.', false,
            'It was a private notebook, written in Greek and probably titled "To Himself". He was coaching himself.'),
          MC('Which Stoic was a slave before becoming a famous teacher?', ['Epictetus', 'Seneca', 'Marcus Aurelius', 'Cato'], 0,
            '"Epictetus" means "acquired". He knew first-hand what it is to control nothing but your own mind.'),
          MC('What does the range of these three lives (slave, statesman, emperor) suggest?', ['Stoicism works in any circumstance', 'Only rich people can be Stoics', 'Philosophy requires leisure', 'Stoicism is mainly about politics'], 0,
            'If it worked in chains and on the throne, it can work in your life too.'),
          MC('Marcus Aurelius wrote his Meditations in which language?', ['Greek', 'Latin', 'Aramaic', 'Egyptian'], 0,
            'Greek was the language of philosophy, even for a Roman emperor.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u2', title: 'Up To Us', sub: 'The dichotomy of control', icon: '⚖️', color: '#5f7a4a',
    lessons: [
      {
        id: 'u2l1', title: 'The Dichotomy', icon: '✋',
        items: [
          LEARN('The first sentence of the Handbook',
            `Epictetus's <i>Enchiridion</i> ("handbook") opens with the most important idea in Stoicism:`,
            'Some things are within our power, while others are not. Within our power are opinion, motivation, desire, aversion, and, in a word, whatever is of our own doing.', 'Epictetus, Enchiridion 1'),
          LEARN('What is NOT up to us',
            `<b>Not</b> up to us: our body, property, reputation, job title, and "in a word, whatever is not of our own doing."<br><br>Treating things that are not up to you as if they were leads to frustration. Treating things that are up to you as if they were not leads to helplessness. Knowing the difference is the skill.`),
          SORT('Up to you, or not?', ['Up to me', 'Not up to me'], [
            ['Whether it rains tomorrow', 1], ['How I respond to criticism', 0], ['What my boss thinks of me', 1], ['Whether I keep my word', 0],
            ['The stock market', 1], ['My judgment about an insult', 0], ['Whether I get sick', 1], ['How much effort I put in', 0]
          ]),
          MC('According to Epictetus, which is "within our power"?', ['Our opinions and desires', 'Our reputation', 'Our health', 'Our property'], 0,
            'Opinion, motivation, desire and aversion all happen inside the mind, so they are yours.'),
          TF('Your own body is fully "up to you" in the Stoic sense.', false,
            'You can influence your body, but illness, injury and aging can happen however you choose. So it is not fully yours.'),
          FILL('Some things are within our ___, while others are not.', ['power', 'reach', 'future', 'family'], 0, 'Epictetus',
            'This is the opening line of the Handbook, and the rest of the book builds on it.'),
          REFLECT('What is one thing worrying you right now? Split it: which part is up to you, and which part is not?',
            'Then put your energy only into the first part.')
        ]
      },
      {
        id: 'u2l2', title: 'The Archer', icon: '🏹',
        items: [
          LEARN('Aim well, release the outcome',
            `Cicero describes a Stoic archer. Their job is to do <b>everything in their power</b> to shoot well: train, aim, steady the breath. Once the arrow leaves the bow, wind can carry it off.<br><br>Hitting the target is <b>"to be selected, not desired."</b> The archer's success is the quality of the shot, not where the arrow lands.`),
          LEARN('The reserve clause',
            `Stoics added a quiet clause to their plans: <b>"…if nothing prevents it"</b> or <b>"fate permitting."</b><br><br>"I'll finish the project, fate permitting." You still commit fully, and you are not shattered if the world says no.`,
            'I want to bathe, and I want to keep my choice in harmony with nature.', 'Epictetus, Enchiridion 4 (paraphrased)'),
          MC('In the archer analogy, what is the archer\'s real goal?', ['To shoot as well as possible', 'To hit the bullseye', 'To beat the other archers', 'To be praised'], 0,
            'Hitting the target is "preferred", but the true goal is the excellent shot, which is fully in the archer\'s power.'),
          SCEN('You\'re applying for your dream job. What\'s the Stoic way to define success?', [
            ['"Success = getting the offer."', false, 'The offer depends on other people, other candidates and luck. Making it your goal hands your peace to strangers.'],
            ['"Success = preparing thoroughly and interviewing honestly, then accepting the result."', true, 'That is the archer\'s mindset. You put full effort into the shot and loosen your grip on where it lands.'],
            ['"Don\'t bother caring, it\'s out of my control."', false, 'That is passivity, not Stoicism. Your preparation is entirely up to you, so care about it a lot.']
          ]),
          TF('The reserve clause ("fate permitting") means you shouldn\'t commit fully to plans.', false,
            'You commit fully to what you do. The clause only keeps your peace from depending on the outcome.'),
          MC('Which is the best rewrite of "I WILL win this match" in the Stoic style?', ['"I will play my best, if nothing prevents me."', '"I don\'t care if I win."', '"Winning is impossible anyway."', '"I deserve to win."'], 0,
            'The goal becomes your own conduct, and a reserve clause is added.'),
          REFLECT('Name one goal you\'re chasing. Rewrite it as an "internal goal", something fully up to you.',
            'For example, "get promoted" becomes "do excellent work and ask clearly for what I want."')
        ]
      },
      {
        id: 'u2l3', title: 'In The Wild', icon: '🚦',
        items: [
          SCEN('You\'re stuck in traffic and will be late to an important meeting.', [
            ['Honk, fume, and replay how unfair it is.', false, 'The traffic does not change, and now you have lost your calm as well as your time.'],
            ['Send a short message saying you\'ll be late, then use the time to listen to something good.', true, 'You did the part that was up to you (communicating) and let go of the part that was not (the traffic).'],
            ['Decide the day is ruined.', false, 'That is a judgment you added. The traffic did not ruin the day.']
          ]),
          SCEN('Your friend seems cold toward you and you don\'t know why.', [
            ['Assume they hate you and withdraw.', false, 'You built a story from very little evidence, and the story is what hurts.'],
            ['Ask kindly if everything is OK, and accept whatever they say.', true, 'Your action and your kindness are yours. Their mood belongs to them.'],
            ['Obsess over every message they\'ve ever sent.', false, 'Looking for certainty you cannot have just feeds anxiety.']
          ]),
          SORT('Sort these about a job interview', ['Up to me', 'Not up to me'], [
            ['Researching the company', 0], ['The interviewer\'s mood', 1], ['Arriving on time', 0], ['Other candidates\' skill', 1],
            ['Being honest', 0], ['The final decision', 1]
          ]),
          MC('Which response shows the dichotomy of control in practice?', ['Do your part, then release the result', 'Control everything you can by force', 'Give up since most things aren\'t up to you', 'Worry so you\'re prepared'], 0,
            'This is not resignation. It is putting your effort where it actually has an effect.'),
          TF('Stoicism says you should stop trying to change the world.', false,
            'The Stoics were senators, generals and teachers. They acted strongly in the world and held their attachment to results loosely.'),
          REFLECT('Recall a time this week you were frustrated. Was the frustration aimed at something up to you, or not?',
            'Notice how often anger is aimed at what we cannot control.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u3', title: 'The Four Virtues', sub: 'Wisdom · Courage · Justice · Temperance', icon: '💎', color: '#3f6b8a',
    lessons: [
      {
        id: 'u3l1', title: 'Wisdom & Courage', icon: '🦉',
        items: [
          LEARN('The cardinal virtues',
            `Stoics inherited four <b>cardinal virtues</b> from Plato:<br><br>🦉 <b>Wisdom</b>: knowing what is truly good, bad, or neither.<br>🦁 <b>Courage</b>: doing right in the face of fear and pain.<br>⚖️ <b>Justice</b>: treating others fairly and kindly.<br>🌊 <b>Temperance</b>: self-control and moderation.`),
          LEARN('Courage is more than battlefields',
            `Courage includes <b>moral courage</b>: telling an unwelcome truth, admitting you were wrong, or enduring pain without complaint. Epictetus said difficulties show who we are.`,
            'It is difficulties that show what men are.', 'Epictetus, Discourses 1.24'),
          MATCH('Match the virtue to its domain', [
            ['Wisdom', 'Knowing what is truly good'], ['Courage', 'Facing fear rightly'], ['Justice', 'Treating others fairly'], ['Temperance', 'Self-control']
          ]),
          MC('Speaking up in a meeting when your team is about to make an unethical decision is mostly…', ['Courage', 'Temperance', 'Wisdom', 'None, it\'s just risky'], 0,
            'It is moral courage, and justice is involved too. The virtues work together.'),
          MC('Wisdom, for the Stoics, is mainly…', ['Knowing what\'s good, bad, and indifferent', 'Having many facts', 'Being clever in debate', 'Predicting the future'], 0,
            'Stoic wisdom is practical. It means judging correctly what is worth wanting.'),
          FILL('It is ___ that show what men are.', ['difficulties', 'riches', 'friends', 'words'], 0, 'Epictetus',
            'Hardship is where character gets tested and shown.'),
          REFLECT('Where in your life right now would a little more courage make the biggest difference?',
            'Pick something small and concrete.')
        ]
      },
      {
        id: 'u3l2', title: 'Justice & Temperance', icon: '🌊',
        items: [
          LEARN('Justice: the social virtue',
            `Marcus called justice the source of the other virtues. For the Stoics it covers <b>fairness, honesty, kindness and doing your duty to others</b>. We are made to cooperate.`,
            'What is not good for the swarm is not good for the bee.', 'Marcus Aurelius, Meditations 6.54'),
          LEARN('Temperance: the right amount',
            `Temperance is <b>self-mastery</b>: the right amount of food, drink, sleep, screen time and anger. It is not misery. It is freedom from being pushed around by your appetites.`,
            'No man is free who is not master of himself.', 'Epictetus (fragment)'),
          MC('Choosing to eat one slice of cake instead of half the cake shows…', ['Temperance', 'Courage', 'Justice', 'Nothing important'], 0,
            'Enjoying it is fine. Temperance means you are steering the appetite rather than being steered by it.'),
          MC('Returning extra change a cashier accidentally gave you shows…', ['Justice', 'Temperance', 'Courage', 'Wisdom only'], 0,
            'Honesty and fairness toward others are justice.'),
          FILL('What is not good for the ___ is not good for the bee.', ['swarm', 'flower', 'honey', 'queen'], 0, 'Marcus Aurelius',
            'Your good and the common good cannot really be separated.'),
          ORDER('No man is free who is not master of himself', 'Epictetus', ['slave', 'rich']),
          TF('Stoic temperance means you should avoid all pleasure.', false,
            'Stoics enjoyed food, friendship and wine. Temperance is moderation and freedom, not punishing yourself.'),
          REFLECT('What appetite or habit pushes you around the most? (Phone, food, scrolling, anger?)',
            'Naming it is the first step to steering it.')
        ]
      },
      {
        id: 'u3l3', title: 'One Virtue', icon: '💠',
        items: [
          LEARN('The unity of virtue',
            `Stoics held that the virtues are really <b>one thing seen from different angles</b>, which is knowledge of how to live. Courage without wisdom is recklessness. Justice without courage collapses under pressure.`),
          MATCH('Match the virtue with its counterfeit', [
            ['Courage', 'Recklessness'], ['Temperance', 'Self-punishment'], ['Justice', 'Self-righteousness'], ['Wisdom', 'Mere cleverness']
          ]),
          SCEN('A colleague takes credit for your work in front of your boss.', [
            ['Publicly humiliate them right then.', false, 'This has some courage in it but lacks temperance and justice. Anger is running the show.'],
            ['Say nothing ever, and quietly resent them.', false, 'You keep the peace outwardly but there is no courage in it, and the resentment eats at you.'],
            ['Calmly correct the record with facts, then talk to them privately.', true, 'Courage to speak, temperance in the tone, justice toward everyone involved, and wisdom in choosing how.']
          ]),
          MC('Why did Stoics say "a person with one virtue has them all"?', ['Each virtue needs the others to work properly', 'Virtues are rare', 'It\'s a figure of speech only', 'Because the gods grant them together'], 0,
            'They are aspects of one skill: living wisely.'),
          FILL('Waste no more time arguing about what a good man should be. ___ one.', ['Be', 'Find', 'Follow', 'Praise'], 0, 'Marcus Aurelius 10.16',
            'Talking about virtue is easy. Practising it is the point.'),
          ORDER('Waste no more time arguing about what a good man should be', 'Marcus Aurelius 10.16'),
          REFLECT('Which of the four virtues is your strongest? Which is your weakest? Give one example of each.',
            'Self-knowledge is the beginning of wisdom.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u4', title: 'Indifferent Things', sub: 'Good, bad & everything else', icon: '🪙', color: '#8a6d3b',
    lessons: [
      {
        id: 'u4l1', title: 'Preferred Indifferents', icon: '🏺',
        items: [
          LEARN('Three categories',
            `The Stoics sorted everything into:<br><br>✅ <b>Good</b>: virtue only.<br>❌ <b>Bad</b>: vice only.<br>➖ <b>Indifferent</b>: everything else, such as health, wealth, reputation, and even life and death.<br><br>"Indifferent" does not mean you shouldn't care. It means these things <b>cannot make you good or bad</b>.`),
          LEARN('Preferred vs dispreferred',
            `Some indifferents are <b>preferred</b> (health, wealth, friends) and it is reasonable to pursue them. Others are <b>dispreferred</b> (illness, poverty) and it is reasonable to avoid them.<br><br>But you never trade virtue for a preferred indifferent. You don't lie to get rich.`),
          SORT('Classify it', ['Good / Bad', 'Indifferent'], [
            ['Being honest', 0], ['Being wealthy', 1], ['Cowardice', 0], ['A broken leg', 1], ['Fame', 1], ['Acting justly', 0], ['Being beautiful', 1], ['Cruelty', 0]
          ]),
          MC('Health is, for a Stoic…', ['A preferred indifferent', 'The highest good', 'Bad', 'Totally irrelevant'], 0,
            'Pursue it sensibly, but do not confuse it with goodness. Many healthy people are vicious.'),
          TF('A Stoic should refuse money if it\'s offered fairly.', false,
            'Wealth is preferred. Seneca was very rich. The point is not to be owned by it.'),
          SCEN('You can get a big promotion, but only by hiding a safety problem from customers.', [
            ['Take it: the promotion is a preferred indifferent.', false, 'You would be trading the only real good (virtue) for an indifferent. That is a bad trade.'],
            ['Report the problem, even if it costs you the promotion.', true, 'Preferred indifferents are never worth your integrity.']
          ]),
          REFLECT('What "indifferent" (money, status, approval…) do you secretly treat as the highest good?',
            'Look at where your worry goes.')
        ]
      },
      {
        id: 'u4l2', title: 'On Loan', icon: '🔁',
        items: [
          LEARN('Never say "I have lost it"',
            `Epictetus offers a reframe for loss:`,
            'Never say of anything, "I have lost it"; but, "I have returned it." Is your child dead? It is returned. Is your wife dead? She is returned.', 'Epictetus, Enchiridion 11'),
          LEARN('Everything is borrowed',
            `Your possessions, your body, even the people you love are <b>on loan from the universe</b>. Seeing it this way is not cold. It makes you <b>grateful while you have them</b> and less crushed when they go.`),
          FILL('Never say of anything, "I have lost it"; but, "I have ___ it."', ['returned', 'released', 'forgotten', 'earned'], 0, 'Epictetus',
            'What was given can be taken back by the giver, and it was never fully yours.'),
          MC('The "on loan" view of possessions mainly helps us…', ['Be grateful now and grieve less later', 'Stop caring about anything', 'Avoid buying things', 'Win arguments'], 0,
            'Things that are borrowed get treated with more care and appreciation.'),
          SCEN('Your phone is stolen.', [
            ['"This is a disaster, my day is ruined."', false, 'It is inconvenient, a dispreferred indifferent. The disaster part is a judgment you added.'],
            ['"It was on loan. I\'ll take the practical steps and keep my composure."', true, 'Report it, back up, replace it, and keep your peace.']
          ]),
          ORDER('It is not the man who has too little but the man who craves more that is poor', 'Seneca, Letter 2'),
          REFLECT('Name three things you "own" that you would be devastated to lose. Imagine each as returned. What changes?',
            'Notice whether gratitude comes up alongside the fear.')
        ]
      },
      {
        id: 'u4l3', title: 'Enough', icon: '🍞',
        items: [
          LEARN('Rich by nature, poor by opinion',
            `Seneca saw how desire keeps raising the bar. The cure is to want less, not to gain more.`,
            'If you live according to nature, you will never be poor; if you live according to opinion, you will never be rich.', 'Seneca, Letter 16'),
          FILL('If you live according to ___, you will never be poor.', ['nature', 'law', 'reason', 'fortune'], 0, 'Seneca, Letter 16',
            'Natural needs are few. The appetites driven by opinion have no limit.'),
          MC('According to Seneca, who is truly poor?', ['The one who craves more', 'The one with little', 'The one in debt', 'The one without friends'], 0,
            'Poverty is a gap between what you have and what you want. Shrink the wanting.'),
          TF('For Seneca, wealth itself is the problem.', false,
            'He was one of the richest men in Rome. The problem is craving and dependence, not having.'),
          SCEN('Your neighbour buys a much nicer car than yours. You feel a pang.', [
            ['Start looking for a loan to upgrade.', false, 'That is "living according to opinion". There will always be a nicer car.'],
            ['Notice the pang, remember your car does its job, and wish them well.', true, 'Envy lessens once you see the impression for what it is.']
          ]),
          REFLECT('What would "enough" look like for you, concretely? Money, possessions, achievements?',
            'Writing down a finish line takes some power away from craving.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u5', title: 'The Mind\'s Eye', sub: 'Impressions & judgments', icon: '👁️', color: '#6a4a7a',
    lessons: [
      {
        id: 'u5l1', title: 'Impressions', icon: '💭',
        items: [
          LEARN('It\'s not things that upset us',
            `Perhaps the most quoted Stoic line, and the seed of modern CBT:`,
            'Men are disturbed not by things, but by the opinions about things.', 'Epictetus, Enchiridion 5'),
          LEARN('Impression → assent',
            `First, an <b>impression</b> (phantasia) arrives: "That person insulted me!" It feels like a fact.<br><br>Then you either <b>assent</b> to it or not. The gap between impression and assent is where your freedom is. Epictetus's training was to <b>pause in that gap</b>.`,
            'Practise then from the start to say to every harsh impression, "You are an impression, and not at all what you appear to be."', 'Epictetus, Enchiridion 1'),
          FILL('Men are disturbed not by things, but by the ___ about things.', ['opinions', 'stories', 'rumours', 'feelings'], 0, 'Epictetus',
            'Events are neutral. The judgment we add is what wounds us.'),
          MC('What is "assent" in Stoic psychology?', ['Agreeing that an impression is true', 'Feeling an emotion', 'Seeing an object', 'Obeying the law'], 0,
            'Assent is your yes to the story an impression tells. It is the one step you control.'),
          ORDER('You are an impression and not at all what you appear to be', 'Epictetus'),
          TF('Modern Cognitive Behavioural Therapy (CBT) was partly inspired by Stoicism.', true,
            'Albert Ellis and Aaron Beck both cited Epictetus. "It\'s not events but our beliefs about them" is the core of CBT.'),
          REFLECT('Catch one impression from today that you assented to too fast. What was the event, and what was the story you added?',
            'Event: "She didn\'t reply." Story: "She thinks I\'m annoying."')
        ]
      },
      {
        id: 'u5l2', title: 'Just The Facts', icon: '🔍',
        items: [
          LEARN('Objective representation',
            `Marcus trained himself to describe things <b>exactly as they are</b>, stripped of hype:`,
            'When you have savoury dishes before you, see that this is the dead body of a fish, and this the dead body of a bird or of a pig; and this fine wine is only a little grape juice.', 'Marcus Aurelius, Meditations 6.13'),
          LEARN('Why do this?',
            `Describing things plainly <b>takes the spell off</b>: luxury goods, status symbols, even insults. "He called me an idiot" becomes "a man made a sound with his mouth." The facts stay the same and the drama goes.`,
            'Take away your opinion, and there is taken away the complaint "I have been harmed." Take away the complaint, and the harm is taken away.', 'Marcus Aurelius, Meditations 4.7'),
          MC('Which is the most "objective" description of a designer handbag?', ['Some leather stitched into a bag, with a logo', 'A symbol of success', 'The bag I deserve', 'An investment piece'], 0,
            'Strip away the story and see the object.'),
          SCEN('Someone leaves a nasty comment on your post.', [
            ['"I\'m being attacked, everyone thinks I\'m a fraud."', false, 'That is impression stacked on impression, all assented to.'],
            ['"A stranger typed some words on a screen. Is there anything true in them? If not, I can scroll on."', true, 'Objective description, then a calm check for truth.']
          ]),
          FILL('Take away your ___, and there is taken away the complaint "I have been harmed."', ['opinion', 'pain', 'enemy', 'pride'], 0, 'Marcus Aurelius 4.7',
            'The harm sits in the judgment.'),
          MATCH('Match the event to its objective description', [
            ['Gold medal', 'A disc of metal on a ribbon'], ['A rude email', 'Pixels arranged into words'], ['Fine wine', 'Fermented grape juice'], ['A throne', 'Wood covered in cloth']
          ]),
          REFLECT('Pick something you crave or fear. Describe it in the plainest, most physical terms you can.',
            'Notice how much of its pull came from the story.')
        ]
      },
      {
        id: 'u5l3', title: 'Dyed By Thoughts', icon: '🎨',
        items: [
          LEARN('The colour of your soul',
            `What you think about repeatedly becomes who you are. Marcus warned himself about this:`,
            'Such as are your habitual thoughts, such also will be the character of your mind; for the soul is dyed by the thoughts.', 'Marcus Aurelius, Meditations 5.16'),
          FILL('The soul is ___ by the thoughts.', ['dyed', 'trapped', 'freed', 'fed'], 0, 'Marcus Aurelius 5.16',
            'Your inputs become your character.'),
          MC('Which habit would Marcus most warn against?', ['Hours scrolling outrage content', 'Reading slowly', 'Walking alone', 'Keeping a journal'], 0,
            'Anger-bait dyes the mind with anger.'),
          SCEN('You notice you replay an old argument in your head every day.', [
            ['Keep replaying it to win next time.', false, 'Each replay dyes your mind a bit more with resentment.'],
            ['Notice it, label it "impression", and turn attention to the present task.', true, 'You cannot stop the thought arriving, but you decide whether to keep feeding it.']
          ]),
          TF('Stoics believed you can choose which thoughts arise in your mind.', false,
            'Impressions arrive uninvited. What you choose is your assent and how long you dwell on them.'),
          REFLECT('What has your mind been "dyed" with this month? What would you like it dyed with instead?',
            'Think about what you read, watch, and who you spend time with.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u6', title: 'Taming the Passions', sub: 'Anger, fear & desire', icon: '🔥', color: '#a8452f',
    lessons: [
      {
        id: 'u6l1', title: 'Not Emotionless', icon: '❤️',
        items: [
          LEARN('The myth of the "stoic"',
            `Lowercase "stoic" means unfeeling. Capital-S <b>Stoics</b> were not emotionless. They aimed to be free of <b>pathē</b>, passions based on <b>false judgments</b>, and to cultivate <b>eupatheiai</b>, "good feelings" based on true ones.`),
          LEARN('Four passions, three good feelings',
            `Passions: <b>distress</b>, <b>fear</b>, <b>craving</b>, <b>(irrational) pleasure</b>.<br>Good feelings: <b>joy</b> (instead of irrational pleasure), <b>caution</b> (instead of fear), <b>wishing</b> (instead of craving).<br><br>There is no good counterpart to distress, because the wise person has nothing truly bad to be distressed about.`),
          TF('Stoics aimed to feel nothing at all.', false,
            'They aimed for emotional health: joy, caution, and goodwill, without being carried away.'),
          MATCH('Match the passion with its healthy counterpart', [
            ['Fear', 'Caution'], ['Craving', 'Rational wishing'], ['Irrational pleasure', 'Joy']
          ]),
          MC('Why does distress have no good counterpart?', ['The wise have nothing truly bad to grieve, since only vice is bad', 'Distress is always good', 'The Stoics forgot', 'Sadness is a virtue'], 0,
            'If only vice is bad, and the wise person is not vicious, nothing they face is truly evil.'),
          MC('A passion, for the Stoics, is rooted in…', ['A false judgment', 'Bad luck', 'The body only', 'The gods'], 0,
            'Fix the judgment and the passion dissolves.'),
          REFLECT('Which passion visits you most: distress, fear, craving, or irrational pleasure? When does it show up?',
            'Look for patterns of time, place and people.')
        ]
      },
      {
        id: 'u6l2', title: 'On Anger', icon: '🌋',
        items: [
          LEARN('Seneca\'s "On Anger"',
            `Seneca wrote a whole book on anger, calling it a <b>brief madness</b>. His main remedy is simple:`,
            'The greatest remedy for anger is delay.', 'Seneca, On Anger'),
          LEARN('First movements',
            `Seneca noted that a jolt such as a flush of heat or a racing heart is a <b>"first movement"</b> (propatheia). It is <b>involuntary and not yet anger</b>. Anger begins only when you <b>assent</b>: "I was wronged and they must pay."<br><br>The jolt is nature. The rage is a choice.`),
          FILL('The greatest remedy for anger is ___.', ['delay', 'revenge', 'wine', 'exercise'], 0, 'Seneca',
            'Give the first movement time to pass before you act.'),
          TF('According to Seneca, feeling an initial jolt when insulted means you\'ve failed as a Stoic.', false,
            'First movements are involuntary, and even the sage has them. What matters is what you do next.'),
          SCEN('A driver cuts you off dangerously. Your heart pounds.', [
            ['Chase them to make a point.', false, 'Your assent turned a first movement into anger, and now you are the dangerous driver.'],
            ['Notice the jolt, breathe, and think: "Maybe they\'re rushing to a hospital."', true, 'Delay plus a charitable story. The jolt passes on its own.']
          ]),
          ORDER('How much more grievous are the consequences of anger than the causes of it', 'Marcus Aurelius 11.18'),
          MC('Seneca called anger…', ['A brief madness', 'A useful fuel', 'A divine gift', 'A warrior\'s virtue'], 0,
            'He argued anger is never useful. Reason can do anything anger can, and do it better.'),
          REFLECT('Recall your last flash of anger. What judgment did you assent to? ("They should have…")',
            'Behind most anger is a "should" about something that was not up to you.')
        ]
      },
      {
        id: 'u6l3', title: 'On Fear', icon: '🌫️',
        items: [
          LEARN('Suffering in imagination',
            `Seneca wrote to his anxious friend Lucilius:`,
            'We suffer more often in imagination than in reality.', 'Seneca, Letter 13'),
          LEARN('Hope and fear are chained together',
            `Seneca quotes Hecato: <b>"Cease to hope, and you will cease to fear."</b> Both pull you out of the present into an imagined future. Like a prisoner and guard chained together, they walk side by side.`),
          FILL('We suffer more often in ___ than in reality.', ['imagination', 'silence', 'public', 'winter'], 0, 'Seneca',
            'Most of what we dread never happens, and what does happen is usually more bearable than we imagined.'),
          MC('Why do hope and fear go together for Seneca?', ['Both project the mind into an uncertain future', 'They are opposites', 'Hope cures fear', 'Fear makes hope stronger'], 0,
            'Both depend on the future. The cure for both is returning to the present.'),
          ORDER('He who suffers before it is necessary suffers more than is necessary', 'Seneca, Letter 98'),
          SCEN('You have a medical test next week and keep imagining the worst.', [
            ['Google every symptom until 2am.', false, 'That is suffering in imagination, at full volume.'],
            ['Do what\'s up to you (go to the test, look after your health) and gently return to today each time the mind runs ahead.', true, 'Act on what you can, and come back to the present.']
          ]),
          REFLECT('What is something you\'re dreading? Write the worst case, then how you\'d actually cope if it happened.',
            'Fear shrinks once you look at it directly.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u7', title: 'Premeditatio Malorum', sub: 'Rehearsing hardship', icon: '🌩️', color: '#4b5a6e',
    lessons: [
      {
        id: 'u7l1', title: 'Expect It', icon: '🗡️',
        items: [
          LEARN('The premeditation of evils',
            `Stoics deliberately imagined bad things happening (loss, insult, failure), <b>not to be gloomy, but to be ready</b>. A blow you expected lands softer.`,
            'Nothing happens to the wise man against his expectation.', 'Seneca'),
          LEARN('Marcus\'s morning routine',
            `Every morning the emperor reminded himself what kind of people he would meet. He did not do this to hate them. He did it so they would not catch him off guard:`,
            'Begin the morning by saying to yourself: I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial.', 'Marcus Aurelius, Meditations 2.1'),
          MC('The purpose of negative visualization is to…', ['Be prepared and appreciate what you have', 'Become pessimistic', 'Attract bad luck', 'Avoid all risk'], 0,
            'It works like a vaccine: a small rehearsed dose builds resilience.'),
          FILL('Begin the morning by saying to yourself: I shall meet with the ___, the ungrateful, arrogant…', ['busybody', 'emperor', 'philosopher', 'soldier'], 0, 'Marcus Aurelius 2.1',
            'He went on to say that none of them can harm him, because none can make him do wrong.'),
          TF('Marcus wrote 2.1 because he despised people.', false,
            'He continues: "...I can neither be harmed by any of them... nor can I be angry with my kinsman." The point is preparation and compassion.'),
          SCEN('You have a tough family dinner tonight. A relative always picks political fights.', [
            ['Hope that this time they\'ll behave.', false, 'If they don\'t, you are caught off guard and react badly.'],
            ['Picture it in advance: "They\'ll probably provoke me. I\'ll smile, ask about their garden, and not take the bait."', true, 'A rehearsed response means you are not ambushed.']
          ]),
          REFLECT('What is one thing likely to go wrong tomorrow? How would your best self respond?',
            'Rehearse the response, not just the problem.')
        ]
      },
      {
        id: 'u7l2', title: 'Gratitude Through Loss', icon: '🕯️',
        items: [
          LEARN('Kiss them like it could be the last time',
            `This is one of the most striking Stoic exercises:`,
            'If you kiss your child or your wife, say that you only kiss things which are human, and thus you will not be disturbed if either of them dies.', 'Epictetus, Enchiridion 3'),
          LEARN('Beating hedonic adaptation',
            `We get used to good things and stop noticing them. Briefly imagining <b>losing</b> something makes you <b>notice it again</b>. Modern psychologists call this "negative visualization" and link it to gratitude.`),
          MC('What modern problem does briefly imagining loss help with?', ['Taking good things for granted', 'Insomnia', 'Bad posture', 'Memory loss'], 0,
            'Hedonic adaptation means we stop noticing what we have. Imagining loss resets that.'),
          SCEN('Your partner is chatting about their day while you scroll your phone.', [
            ['Keep scrolling, you\'ll hear about it later.', false, 'There may not always be a "later".'],
            ['Remember they are mortal and on loan. Put the phone down and really listen.', true, 'Negative visualization turned into presence.']
          ]),
          TF('Epictetus\'s advice in Enchiridion 3 is meant to make us love people less.', false,
            'It is meant to help us love them without illusion, and to treasure the moments.'),
          REFLECT('Imagine, for 30 seconds, that someone you love were gone. Then write what you\'d want to tell them, and tell them today.',
            'This exercise only pays off if you act on it.')
        ]
      },
      {
        id: 'u7l3', title: 'Voluntary Discomfort', icon: '🧊',
        items: [
          LEARN('Practise poverty',
            `Seneca advised rich Lucilius to regularly live like a poor man:`,
            'Set aside a certain number of days, during which you shall be content with the scantiest and cheapest fare, with coarse and rough dress, saying to yourself the while: "Is this the condition that I feared?"', 'Seneca, Letter 18'),
          LEARN('Why it works',
            `Voluntary discomfort (cold showers, fasting, sleeping rough, walking in bad weather) shows you that <b>what you fear is survivable</b>. It builds confidence and makes ordinary comforts feel new again.<br><br>Cato reportedly walked Rome <b>barefoot</b> to train himself to be ashamed only of what is truly shameful.`),
          FILL('…saying to yourself the while: "Is this the ___ that I feared?"', ['condition', 'enemy', 'future', 'person'], 0, 'Seneca, Letter 18',
            'Often the answer is: "This? This is fine."'),
          MC('The main benefit of voluntary discomfort is…', ['Learning that hardship is bearable', 'Punishing yourself for sins', 'Showing off toughness', 'Saving money'], 0,
            'It is training, not penance.'),
          MATCH('Match the practice with what it trains', [
            ['Cold shower', 'Tolerance of discomfort'], ['Skipping a meal', 'Mastery of appetite'], ['Plain clothes in public', 'Freedom from others\' opinion'], ['Phone-free day', 'Independence from distraction']
          ]),
          TF('Seneca recommended giving away all your wealth permanently.', false,
            'He suggested practising poverty for a few days. The aim is freedom from the fear of losing wealth.'),
          REFLECT('Choose one voluntary discomfort to try this week. What is it, and when will you do it?',
            'Commit to a specific day. The Today tab will challenge you with these too.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u8', title: 'Memento Mori', sub: 'Remember you will die', icon: '⏳', color: '#2f3a44',
    lessons: [
      {
        id: 'u8l1', title: 'Shortness of Life', icon: '⌛',
        items: [
          LEARN('It\'s not short, it\'s wasted',
            `Seneca's essay <i>On the Shortness of Life</i> opens with a correction:`,
            'It is not that we have a short time to live, but that we waste a lot of it. Life is long, if you know how to use it.', 'Seneca, On the Shortness of Life'),
          LEARN('The thief of time',
            `Seneca saw people guarding their money carefully while giving away their <b>time</b> to anyone who asked, the one thing that can never be returned.`,
            'The greatest obstacle to living is expectancy, which hangs upon tomorrow and loses today.', 'Seneca, On the Shortness of Life 9'),
          FILL('It is not that we have a short time to live, but that we ___ a lot of it.', ['waste', 'fear', 'forget', 'share'], 0, 'Seneca',
            'Life is long enough if it is actually lived.'),
          MC('What did Seneca call the greatest obstacle to living?', ['Expectancy, living for tomorrow', 'Poverty', 'Illness', 'Bad rulers'], 0,
            'Postponing life until later is how a lifetime gets wasted.'),
          ORDER('Life is long if you know how to use it', 'Seneca'),
          TF('Seneca thought we should guard our time even more than our money.', true,
            'Money can be earned back. Time cannot.'),
          REFLECT('Where did your time go yesterday? Was it spent, or wasted?',
            'Track one day honestly. The result may surprise you.')
        ]
      },
      {
        id: 'u8l2', title: 'You Could Leave Now', icon: '💀',
        items: [
          LEARN('Memento mori',
            `"Remember you will die." Stoics kept death in view on purpose, <b>not to be morbid, but to wake up</b>. Death is the ultimate deadline, and it clarifies what matters.`,
            'You could leave life right now. Let that determine what you do and say and think.', 'Marcus Aurelius, Meditations 2.11'),
          LEARN('Each day a life',
            `Seneca suggested treating each day as a complete life: reviewed, finished, and enough.`,
            'Begin at once to live, and count each separate day as a separate life.', 'Seneca, Letter 101'),
          FILL('You could leave life right now. Let that ___ what you do and say and think.', ['determine', 'frighten', 'excuse', 'delay'], 0, 'Marcus Aurelius 2.11',
            'Mortality works as a filter on what is worth doing.'),
          MC('The Stoic purpose of memento mori is to…', ['Clarify priorities and live fully now', 'Make people afraid', 'Prepare for an afterlife', 'Justify recklessness'], 0,
            'Death is the deadline that gives every day its value.'),
          ORDER('Count each separate day as a separate life', 'Seneca, Letter 101'),
          SCEN('You\'ve been putting off calling an old friend for "a few months".', [
            ['Keep waiting until life calms down.', false, 'Life does not calm down. Memento mori.'],
            ['Call today, before you have more time to think of excuses.', true, '"You could leave life right now." So could they.']
          ]),
          MC('"Perfection of character is this: to live each day as if it were your last, without frenzy, without apathy, without ___."', ['pretence', 'fear', 'friends', 'plans'], 0,
            'Marcus 7.69: not a frantic bucket list, but calm, sincere presence.'),
          REFLECT('If you knew you had one year left, what would you stop doing immediately? What would you start?',
            'You will not have unlimited years either. Start one thing now.')
        ]
      },
      {
        id: 'u8l3', title: 'All Is Fleeting', icon: '🍂',
        items: [
          LEARN('Everyone in Vespasian\'s time',
            `Marcus pictured the busy people of an earlier age: <i>marrying, raising children, sick, dying, feasting, trading, flattering, scheming.</i> All of them are gone. Then he did the same for his own time.`,
            'Soon you will have forgotten all things; and soon all things will have forgotten you.', 'Marcus Aurelius, Meditations 7.21'),
          FILL('Soon you will have forgotten all things; and soon all things will have ___ you.', ['forgotten', 'praised', 'judged', 'followed'], 0, 'Marcus Aurelius 7.21',
            'This is meant as relief, not despair. Fame and others\' opinions matter far less than we think.'),
          MC('Reflecting on how fleeting fame is helps us…', ['Care less about reputation, more about virtue', 'Seek fame faster', 'Give up on work', 'Avoid all people'], 0,
            'Why sacrifice your peace for applause that will fade?'),
          TF('For Marcus, the only time we can lose is the present moment.', true,
            'Meditations 2.14: the past is gone and the future is not yet here. Only the present can be lived, or lost.'),
          ORDER('We love ourselves more than others but care more about their opinion than our own', 'Marcus Aurelius 12.4'),
          REFLECT('Whose opinion are you living for? Will it matter in 100 years?',
            'Pick one decision that is currently driven by what others might think.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u9', title: 'The Obstacle Is The Way', sub: 'Amor fati', icon: '🔥', color: '#9a5b1e',
    lessons: [
      {
        id: 'u9l1', title: 'Fuel For The Fire', icon: '🪵',
        items: [
          LEARN('What stands in the way becomes the way',
            `One of Marcus's most powerful passages:`,
            'The impediment to action advances action. What stands in the way becomes the way.', 'Marcus Aurelius, Meditations 5.20'),
          LEARN('The fire',
            `Marcus compared the mind to a <b>blazing fire</b>: throw anything at it and it burns it as fuel and grows brighter. A small lamp would be smothered. Every obstacle is a chance to practise some virtue: patience, courage, creativity, kindness.`),
          ORDER('What stands in the way becomes the way', 'Marcus Aurelius 5.20'),
          FILL('The impediment to action ___ action.', ['advances', 'prevents', 'delays', 'excuses'], 0, 'Marcus Aurelius 5.20',
            'The obstacle becomes the material you work with.'),
          MATCH('Match the obstacle with the virtue it trains', [
            ['A rude customer', 'Patience'], ['A frightening diagnosis', 'Courage'], ['A tempting shortcut', 'Integrity'], ['A cancelled plan', 'Adaptability']
          ]),
          SCEN('Your laptop dies the day before a deadline, with work unsaved.', [
            ['Curse fate, then give up for the night.', false, 'The lamp gets smothered.'],
            ['"OK, this is a chance to practise calm and resourcefulness." Borrow a machine and rebuild the work more cleanly.', true, 'Like a blazing fire, the mind uses the setback as fuel.']
          ]),
          REFLECT('What is your biggest obstacle right now? Write: "This is an opportunity to practise ___."',
            'Fill the blank with a virtue.')
        ]
      },
      {
        id: 'u9l2', title: 'Love Your Fate', icon: '🌀',
        items: [
          LEARN('Wish for what happens',
            `Epictetus put it simply:`,
            'Do not seek for things to happen as you wish, but wish for things to happen as they do happen, and you will go on well.', 'Epictetus, Enchiridion 8'),
          LEARN('The dog and the cart',
            `Early Stoics described a dog tied to a moving cart. It can <b>trot along willingly</b> or be <b>dragged</b> kicking and yelping. Either way, it goes where the cart goes.<br><br>(Fun fact: the phrase <i>amor fati</i>, "love of fate", is from Nietzsche, but the idea is Stoic.)`),
          FILL('Wish for things to happen as they ___ happen, and you will go on well.', ['do', 'should', 'might', 'once'], 0, 'Epictetus',
            'Trying to fight reality is how most suffering starts.'),
          MC('In the dog-and-cart image, what\'s the dog\'s only real choice?', ['Run along willingly or be dragged', 'Whether the cart moves', 'Where the cart goes', 'To bite the driver'], 0,
            'Your attitude is free. The direction of events often is not.'),
          TF('The term "amor fati" was coined by an ancient Stoic.', false,
            'The phrase is Nietzsche\'s (19th century). The attitude is ancient Stoic.'),
          MC('Amor fati is best described as…', ['Embracing everything that happens as material for your life', 'Pretending bad things are good', 'Giving up on change', 'Believing the future is predetermined so effort is pointless'], 0,
            'It is acceptance plus active use: "This happened. Now what can I build from it?"'),
          REFLECT('What happened this year that you\'ve been fighting against in your head? What would loving it look like?',
            'Not liking it, but accepting it fully and using it.')
        ]
      },
      {
        id: 'u9l3', title: 'Fire Tests Gold', icon: '🥇',
        items: [
          LEARN('Unlucky never to suffer',
            `In <i>On Providence</i>, Seneca argues hardship is training from a demanding coach. He quotes Demetrius:`,
            'No one seems to me more unhappy than the man who has never met with adversity.', 'Seneca, On Providence'),
          LEARN('Gold in the furnace',
            `<i>"Fire tests gold, misfortune brave men."</i> (Seneca, On Providence 5)<br><br>Without challenge you never find out what you are capable of. An athlete without opponents never improves.`),
          FILL('Fire tests gold, ___ brave men.', ['misfortune', 'battle', 'wealth', 'praise'], 0, 'Seneca, On Providence',
            'Hardship is where your strength gets tested and proven.'),
          MC('Why might someone who never faces adversity be "unhappy", for Seneca?', ['They never learn what they\'re capable of', 'They get bored', 'The gods hate them', 'They become rich'], 0,
            'An untested person does not know their own strength.'),
          ORDER('It is difficulties that show what men are', 'Epictetus'),
          SCEN('You fail an important exam.', [
            ['"I\'m just not smart. Why try?"', false, 'You assented to a story about permanent inability.'],
            ['"This is the furnace. What did it reveal? I\'ll adjust and go again."', true, 'This is Seneca\'s gold test: the failure becomes information and training.']
          ]),
          REFLECT('What past hardship made you stronger? What did it teach you that comfort never could?',
            'Remember this the next time something hard comes along.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u10', title: 'Citizens of the World', sub: 'Living with others', icon: '🌍', color: '#2f7a72',
    lessons: [
      {
        id: 'u10l1', title: 'Cosmopolis', icon: '🗺️',
        items: [
          LEARN('Citizen of the cosmos',
            `The Stoics saw all humans as members of one city, the <b>cosmopolis</b>. Every person shares in reason, so everyone is kin.`,
            'We are made for cooperation, like feet, like hands, like eyelids, like the rows of the upper and lower teeth.', 'Marcus Aurelius, Meditations 2.1'),
          LEARN('Hierocles\' circles',
            `Hierocles pictured each of us surrounded by <b>concentric circles</b>: self → family → relatives → neighbours → fellow citizens → all humanity.<br><br>The exercise is to <b>draw the circles inward</b>: treat strangers a little more like relatives and relatives a little more like yourself.`),
          MC('In Hierocles\' exercise, what are we supposed to do with the circles?', ['Draw the outer circles inward', 'Push outsiders farther away', 'Stay only in the inner circle', 'Erase the self'], 0,
            'Extend family-like care outward, step by step.'),
          FILL('We are made for ___, like feet, like hands, like eyelids…', ['cooperation', 'competition', 'solitude', 'war'], 0, 'Marcus Aurelius 2.1',
            'Working against each other goes against our nature.'),
          TF('"Cosmopolitan" comes from the Stoic idea of being a "citizen of the cosmos".', true,
            'Kosmos (world) + politēs (citizen). Diogenes the Cynic coined it and the Stoics developed it.'),
          ORDER('Men exist for the sake of one another teach them then or bear with them', 'Marcus Aurelius 8.59'),
          REFLECT('Who is in your "outer circle" (a coworker, neighbour, cashier) that you could treat a little more like family this week?',
            'Make it a specific person and a specific act.')
        ]
      },
      {
        id: 'u10l2', title: 'Difficult People', icon: '🌪️',
        items: [
          LEARN('They do not know better',
            `Following Socrates, the Stoics held that <b>no one does wrong willingly</b>. Wrongdoers are mistaken about what is good. Your anger is better replaced with something closer to pity, or patience with a student.`,
            'The best revenge is to be unlike him who performed the injury.', 'Marcus Aurelius, Meditations 6.6'),
          LEARN('Two handles',
            `Epictetus: everything has <b>two handles</b>, one you can carry it by and one you can't. If your brother wrongs you, don't grab the handle "he wronged me". Grab the other one: <b>"he is my brother, raised with me."</b>`,
            'Remember, it is not he who reviles you or strikes you who insults you, but your opinion that these things are insulting.', 'Epictetus, Enchiridion 20'),
          FILL('The best revenge is to be ___ him who performed the injury.', ['unlike', 'better than', 'far from', 'kind to'], 0, 'Marcus Aurelius 6.6',
            'Not becoming like them is the "win".'),
          SCEN('A coworker is constantly passive-aggressive toward you.', [
            ['Match their energy, two can play that game.', false, 'Now there are two people behaving badly, and one of them is you.'],
            ['Assume they\'re struggling or mistaken, set a clear boundary politely, and stay kind.', true, 'You took the right handle, practised justice, and did not become them.']
          ]),
          MC('According to Enchiridion 20, what actually insults you?', ['Your own opinion that it\'s insulting', 'The insulter\'s words', 'The audience', 'Bad luck'], 0,
            'Without your assent, an insult is just noise.'),
          FILL('Everything has two ___, by one of which it can be carried, by the other not.', ['handles', 'sides', 'faces', 'paths'], 0, 'Epictetus, Enchiridion 43',
            'Look for the handle you can carry.'),
          REFLECT('Who annoys you most right now? Find the "other handle". What is true and sympathetic about them?',
            'What might they be struggling with?')
        ]
      },
      {
        id: 'u10l3', title: 'Two Ears, One Mouth', icon: '👂',
        items: [
          LEARN('Listen more',
            `Zeno reportedly told a chatty young man:`,
            'We have two ears and one mouth, so we should listen more than we say.', 'Zeno (via Diogenes Laertius)'),
          LEARN('Speak little, and well',
            `Epictetus advised silence or brief, necessary speech, and especially avoiding gossip: "not about gladiators or horse races… and above all, not about people, blaming or praising or comparing them."`,
            'Be for the most part silent, or speak merely what is necessary, and in few words.', 'Epictetus, Enchiridion 33'),
          FILL('We have two ears and one mouth, so we should ___ more than we say.', ['listen', 'think', 'eat', 'learn'], 0, 'Zeno',
            'Listening is a form of justice: giving others their due.'),
          MC('Which topic did Epictetus most warn against chatting about?', ['Other people, blaming or praising them', 'The weather', 'Philosophy', 'Your goals'], 0,
            'Gossip trains the mind toward judgment and away from virtue.'),
          SCEN('A friend is venting about a bad week.', [
            ['Jump in with a story about your own even worse week.', false, 'That turns their moment into yours.'],
            ['Listen fully, ask a question, and offer advice only if they want it.', true, 'Two ears, one mouth.']
          ]),
          ORDER('If it is not right do not do it if it is not true do not say it', 'Marcus Aurelius 12.17'),
          REFLECT('In your next conversation, try to speak less than half the time. Before that, what do you expect to notice?',
            'Come back to your journal and see if you were right.')
        ]
      }
    ]
  },

  /* ------------------------------------------------------ */
  {
    id: 'u11', title: 'The Daily Discipline', sub: 'Philosophy as a way of life', icon: '🌅', color: '#c08a2e',
    lessons: [
      {
        id: 'u11l1', title: 'Morning & Evening', icon: '🌗',
        items: [
          LEARN('Bookends of the day',
            `Stoics bracketed each day with reflection:<br><br>🌅 <b>Morning</b>: anticipate challenges and set an intention (premeditatio).<br>🌙 <b>Evening</b>: review the day honestly but gently.`),
          LEARN('Seneca\'s nightly review',
            `Seneca describes going over his whole day each night, after the lamp was out:`,
            'What bad habit have I cured today? What fault have I resisted? In what respect am I better?', 'Seneca, On Anger 3.36 (quoting Sextius)'),
          FILL('What bad habit have I ___ today?', ['cured', 'started', 'enjoyed', 'hidden'], 0, 'Seneca',
            'The review is not about punishing yourself. It is about noticing so you can improve.'),
          MC('Seneca approached his nightly self-examination with…', ['Honesty, but without harsh self-punishment', 'Terror of failure', 'Excuses for everything', 'Avoidance'], 0,
            'He said he hides nothing from himself, and then forgives what can be fixed: "See that you never do that again."'),
          TF('This app\'s "Today" tab lets you practise both of these routines.', true,
            'Morning Preparation and Evening Review are in the Today tab. Try both tonight and tomorrow.'),
          REFLECT('Run a mini evening review now: what did you do well today? Where did you fall short? What will you do differently?',
            'Be honest but kind, the way a good coach would be.')
        ]
      },
      {
        id: 'u11l2', title: 'Be One', icon: '⚒️',
        items: [
          LEARN('Philosophy is practice',
            `For the Stoics, philosophy you only read about is useless. Epictetus mocked students who could quote Chrysippus but panicked in a storm.`,
            'Never call yourself a philosopher, nor talk a great deal among the unlearned about theorems, but act conformably to them.', 'Epictetus, Enchiridion 46'),
          LEARN('Habits make the person',
            `Every habit is strengthened by the matching actions. If you want to be a writer, write. If you want to stop being angry, don't feed the anger. Count the days you weren't angry: "I used to be angry every day, now every other day, then every third…"`,
            'First say to yourself what you would be; and then do what you have to do.', 'Epictetus, Discourses 3.23'),
          ORDER('First say to yourself what you would be and then do what you have to do', 'Epictetus'),
          MC('What would Epictetus think of someone who can quote Stoics perfectly but loses their temper daily?', ['They\'re not yet a philosopher at all', 'They\'re a great Stoic', 'That\'s fine, knowledge comes first', 'They should teach'], 0,
            'He would point them back to practice, starting today.'),
          FILL('How long are you going to wait before you demand the ___ for yourself?', ['best', 'truth', 'rest', 'credit'], 0, 'Epictetus, Enchiridion 51',
            'You are not a child anymore. Start now.'),
          SCEN('You\'ve finished this unit and feel inspired.', [
            ['Read three more Stoic books before changing anything.', false, 'That postpones practice, which is the trap Epictetus warned about.'],
            ['Pick ONE practice (morning prep, evening review, or a daily challenge) and do it every day this week.', true, 'One habit, actually done, is worth more than any amount of theory.']
          ]),
          REFLECT('Finish this sentence: "I want to be the kind of person who…" Then: "So today I will…"',
            'This is Discourses 3.23 put to work.')
        ]
      },
      {
        id: 'u11l3', title: 'Real or Fake?', icon: '🕵️',
        items: [
          LEARN('Beware of fake Stoic quotes',
            `The internet is full of misattributed "Stoic" quotes. A good Stoic checks impressions, including quotes! Let's test your discernment.`),
          MC('"Luck is what happens when preparation meets opportunity." Is this a genuine Seneca quote?', ['No, it isn\'t found in his writings', 'Yes, from his Letters', 'Yes, from On Anger', 'Yes, from Meditations'], 0,
            'It is widely attributed to Seneca, but scholars have not found it in his surviving works.'),
          MC('"Every new beginning comes from some other beginning\'s end." Seneca?', ['No, it\'s a 1990s song lyric', 'Yes, Letter 1', 'Yes, On Providence', 'It\'s Marcus, not Seneca'], 0,
            'It is from the song "Closing Time" by Semisonic, though it is often credited to Seneca online.'),
          MC('"Men are disturbed not by things, but by the opinions about things." Genuine?', ['Yes, Epictetus, Enchiridion 5', 'No, it\'s modern', 'Yes, Seneca', 'Yes, Zeno'], 0,
            'Genuine, and one of the most important lines in the tradition.'),
          MC('"The impediment to action advances action." Genuine?', ['Yes, Marcus Aurelius, Meditations 5.20', 'No, it\'s a modern business book', 'Yes, Epictetus', 'No, it\'s Nietzsche'], 0,
            'Genuine Marcus. A modern bestseller popularised it.'),
          TF('Admiral James Stockdale credited Epictetus with helping him survive 7+ years as a prisoner of war.', true,
            'Stockdale had studied the Enchiridion. When shot down over Vietnam he thought: "I\'m leaving the world of technology and entering the world of Epictetus."'),
          MATCH('Match the modern figure to their Stoic connection', [
            ['James Stockdale', 'POW who leaned on Epictetus'], ['Albert Ellis', 'Founder of REBT, cited Epictetus'], ['Nietzsche', 'Coined "amor fati"'], ['Hadot', 'Called it "the inner citadel"']
          ]),
          REFLECT('You\'ve completed the Stoa course. What is the ONE idea you most want to remember for the rest of your life?',
            'Write it somewhere you\'ll see it every day.')
        ]
      }
    ]
  }
];

/* ---------------------------------------------------------
   Quotes (quote of the day, Citadel, lesson complete)
   --------------------------------------------------------- */
const QUOTES = [
  ['Men are disturbed not by things, but by the opinions about things.', 'Epictetus', 'Enchiridion 5'],
  ['The impediment to action advances action. What stands in the way becomes the way.', 'Marcus Aurelius', 'Meditations 5.20'],
  ['We suffer more often in imagination than in reality.', 'Seneca', 'Letter 13'],
  ['It is not that we have a short time to live, but that we waste a lot of it.', 'Seneca', 'On the Shortness of Life'],
  ['Waste no more time arguing about what a good man should be. Be one.', 'Marcus Aurelius', 'Meditations 10.16'],
  ['First say to yourself what you would be; and then do what you have to do.', 'Epictetus', 'Discourses 3.23'],
  ['You could leave life right now. Let that determine what you do and say and think.', 'Marcus Aurelius', 'Meditations 2.11'],
  ['No man is free who is not master of himself.', 'Epictetus', 'Fragments'],
  ['Begin at once to live, and count each separate day as a separate life.', 'Seneca', 'Letter 101'],
  ['The best revenge is to be unlike him who performed the injury.', 'Marcus Aurelius', 'Meditations 6.6'],
  ['It is difficulties that show what men are.', 'Epictetus', 'Discourses 1.24'],
  ['He who suffers before it is necessary suffers more than is necessary.', 'Seneca', 'Letter 98'],
  ['If it is not right, do not do it; if it is not true, do not say it.', 'Marcus Aurelius', 'Meditations 12.17'],
  ['Do not seek for things to happen as you wish, but wish for things to happen as they do happen, and you will go on well.', 'Epictetus', 'Enchiridion 8'],
  ['The soul is dyed by the thoughts.', 'Marcus Aurelius', 'Meditations 5.16'],
  ['If you live according to nature, you will never be poor; if you live according to opinion, you will never be rich.', 'Seneca', 'Letter 16'],
  ['How long are you going to wait before you demand the best for yourself?', 'Epictetus', 'Enchiridion 51'],
  ['Be like the promontory against which the waves continually break, but it stands firm and tames the fury of the water around it.', 'Marcus Aurelius', 'Meditations 4.49'],
  ['Fire tests gold, misfortune brave men.', 'Seneca', 'On Providence 5'],
  ['We have two ears and one mouth, so we should listen more than we say.', 'Zeno of Citium', 'Diogenes Laertius 7.23'],
  ['Take away your opinion, and there is taken away the complaint, "I have been harmed." Take away the complaint, and the harm is taken away.', 'Marcus Aurelius', 'Meditations 4.7'],
  ['Life is long, if you know how to use it.', 'Seneca', 'On the Shortness of Life'],
  ['Never say of anything, "I have lost it"; but, "I have returned it."', 'Epictetus', 'Enchiridion 11'],
  ['Men exist for the sake of one another. Teach them then or bear with them.', 'Marcus Aurelius', 'Meditations 8.59'],
  ['The greatest remedy for anger is delay.', 'Seneca', 'On Anger'],
  ['Associate with those who will make a better man of you.', 'Seneca', 'Letter 7'],
  ['I must die. Must I then die lamenting?', 'Epictetus', 'Discourses 1.1'],
  ['Soon you will have forgotten all things; and soon all things will have forgotten you.', 'Marcus Aurelius', 'Meditations 7.21'],
  ['Everywhere means nowhere.', 'Seneca', 'Letter 2'],
  ['If you want to improve, be content to be thought foolish and stupid.', 'Epictetus', 'Enchiridion 13'],
  ['Very little is needed to make a happy life; it is all within yourself, in your way of thinking.', 'Marcus Aurelius', 'Meditations 7.67'],
  ['What is not good for the swarm is not good for the bee.', 'Marcus Aurelius', 'Meditations 6.54'],
  ['Freedom is secured not by the fulfilling of one\'s desires, but by the removal of desire.', 'Epictetus', 'Discourses 4.1'],
  ['No great thing is created suddenly, any more than a bunch of grapes or a fig.', 'Epictetus', 'Discourses 1.15'],
  ['Cease to hope, and you will cease to fear.', 'Seneca (quoting Hecato)', 'Letter 5'],
  ['Accept the things to which fate binds you, and love the people with whom fate brings you together.', 'Marcus Aurelius', 'Meditations 6.39'],
  ['Let us go to our sleep with joy and gladness; let us say: I have lived.', 'Seneca', 'Letter 12'],
  ['Remember that it is not he who reviles you or strikes you who insults you, but your opinion that these things are insulting.', 'Epictetus', 'Enchiridion 20'],
  ['Kindness is invincible, if it be sincere.', 'Marcus Aurelius', 'Meditations 11.18'],
  ['The happiness of your life depends upon the quality of your thoughts.', 'Marcus Aurelius', 'paraphrase of Meditations 5.16'],
  ['Wherever there is a human being, there is an opportunity for a kindness.', 'Seneca', 'On the Happy Life 24 (paraphrase)']
];

/* ---------------------------------------------------------
   Daily challenges — real-world practice
   --------------------------------------------------------- */
const CHALLENGES = [
  { title: 'The Cold Finish', virtue: 'Courage', icon: '🧊', desc: 'End your shower with 30–60 seconds of cold water. Breathe slowly. Notice that the discomfort is just a sensation.', src: 'Voluntary discomfort (Seneca, Letter 18)' },
  { title: 'Plain Fare', virtue: 'Temperance', icon: '🍞', desc: 'Eat one deliberately simple meal today: rice, bread, oats, water. Ask: "Is this the condition I feared?"', src: 'Seneca, Letter 18' },
  { title: 'Ten Breaths Before Reacting', virtue: 'Temperance', icon: '🌬️', desc: 'The next time you feel irritated, take ten slow breaths before saying or typing anything.', src: '"The greatest remedy for anger is delay." (Seneca)' },
  { title: 'Fate Permitting', virtue: 'Wisdom', icon: '🎯', desc: 'Add "…if nothing prevents me" to three plans you make today, out loud or in your head. Notice the lightness.', src: 'The Stoic reserve clause' },
  { title: 'No Complaints', virtue: 'Temperance', icon: '🤐', desc: 'Go the whole day without complaining aloud. Each time you slip, just notice it and start the count again.', src: 'Epictetus on blaming' },
  { title: 'The View From Above', virtue: 'Wisdom', icon: '🛰️', desc: 'Use the View From Above tool in the Citadel tab. Then look at today\'s biggest worry from that height.', src: 'Marcus Aurelius 9.30' },
  { title: 'Phone-Free First Hour', virtue: 'Temperance', icon: '📵', desc: 'Don\'t touch your phone for the first hour after you wake up. Use the time for your morning preparation.', src: 'Seneca on guarding time' },
  { title: 'Two Ears, One Mouth', virtue: 'Justice', icon: '👂', desc: 'In your next conversation, ask at least three genuine questions and talk less than half the time.', src: 'Zeno of Citium' },
  { title: 'Secret Kindness', virtue: 'Justice', icon: '🎁', desc: 'Do one kind thing for someone today without anyone knowing it was you.', src: 'Marcus: "What more do you want when you\'ve done a man a service?" (9.42)' },
  { title: 'Return It', virtue: 'Wisdom', icon: '🔁', desc: 'Look at something you love (a person, a possession) and silently think: "This is on loan." Then appreciate it fully.', src: 'Epictetus, Enchiridion 11' },
  { title: 'Kiss Like It\'s The Last', virtue: 'Justice', icon: '🕯️', desc: 'When you next see someone you love, remember they are mortal. Give them your undivided attention for 10 minutes.', src: 'Epictetus, Enchiridion 3' },
  { title: 'Hard Thing First', virtue: 'Courage', icon: '⛰️', desc: 'Do the task you\'re most avoiding first, before anything else. "I rise to do the work of a human being."', src: 'Marcus Aurelius 5.1' },
  { title: 'Just The Facts', virtue: 'Wisdom', icon: '🔍', desc: 'Pick something that upset you recently. Describe it in purely objective, physical terms, with no adjectives about how it felt.', src: 'Marcus Aurelius 6.13' },
  { title: 'Accept Criticism Gracefully', virtue: 'Courage', icon: '🛡️', desc: 'When you receive criticism today, don\'t defend yourself. Say "thank you, I\'ll think about that", and actually do.', src: 'Epictetus: "If anyone tells you a certain person speaks ill of you…" (Ench. 33)' },
  { title: 'Let Someone Else Choose', virtue: 'Temperance', icon: '🎲', desc: 'Give up a minor preference today: where to eat, what to watch, which route to take. Notice it doesn\'t matter.', src: 'Practising indifference to indifferents' },
  { title: 'Memento Mori Walk', virtue: 'Wisdom', icon: '💀', desc: 'Take a 10-minute walk without headphones. Reflect: this day will never come again. What matters?', src: 'Marcus Aurelius 2.11' },
  { title: 'Write To A Mentor', virtue: 'Justice', icon: '✉️', desc: 'Like Marcus in Book 1 of the Meditations, write down what you learned from one person, then tell them.', src: 'Meditations Book 1' },
  { title: 'Premeditate Tomorrow', virtue: 'Courage', icon: '🌩️', desc: 'Before bed, list three things that could go wrong tomorrow and how your best self would respond to each.', src: 'Premeditatio malorum' },
  { title: 'The Other Handle', virtue: 'Justice', icon: '🏺', desc: 'Think of someone who frustrates you. Find the "other handle": write three sympathetic or true things about them.', src: 'Epictetus, Enchiridion 43' },
  { title: 'Fast From Opinions', virtue: 'Temperance', icon: '🤫', desc: 'Don\'t share any unrequested opinion today, online or offline. Speak only what is necessary.', src: 'Epictetus, Enchiridion 33' },
  { title: 'Wear The Unfashionable', virtue: 'Courage', icon: '👕', desc: 'Wear something plain or slightly unfashionable in public and practise not caring about others\' glances.', src: 'Cato the Younger' },
  { title: 'Give Away Something', virtue: 'Justice', icon: '🤲', desc: 'Give away one possession you don\'t need to someone who could use it.', src: 'Practising non-attachment' },
  { title: 'An Hour Of Deep Work', virtue: 'Courage', icon: '⏱️', desc: 'Spend one full hour on your most important work with zero distractions. Guard your time like gold.', src: 'Seneca, Letter 1' },
  { title: 'Delay A Desire', virtue: 'Temperance', icon: '⏳', desc: 'The next time you crave something (a snack, a purchase, a scroll), wait 20 minutes. See if the craving survives.', src: 'Epictetus on desire' },
  { title: 'Read The Masters', virtue: 'Wisdom', icon: '📖', desc: 'Read one letter of Seneca or one book of the Meditations (they\'re free online). Copy one line by hand.', src: 'Seneca, Letter 2: read deeply, not widely' },
  { title: 'Forgive In Advance', virtue: 'Justice', icon: '🕊️', desc: 'Before a meeting or gathering, decide in advance to forgive whoever annoys you. They know not what is good.', src: 'Marcus Aurelius 2.1' },
  { title: 'Sleep On The Floor', virtue: 'Courage', icon: '🛏️', desc: '(Optional and advanced) Sleep one night on the floor or with only a thin blanket. Learn how little you need.', src: 'Seneca & Musonius Rufus' },
  { title: 'The Long Walk', virtue: 'Temperance', icon: '🚶', desc: 'Walk instead of driving or taking transit for one errand today, whatever the weather.', src: 'Musonius Rufus on physical training' },
  { title: 'Gratitude Inventory', virtue: 'Wisdom', icon: '🌾', desc: 'List ten ordinary things you\'d miss if they vanished: running water, your eyes, a friend\'s laugh…', src: 'Negative visualization' },
  { title: 'Be Wrong On Purpose', virtue: 'Courage', icon: '🙋', desc: 'Admit you were wrong about something today, out loud to someone. It\'s freeing.', src: 'Marcus Aurelius 6.21' },
  { title: 'Help Without Credit', virtue: 'Justice', icon: '🐝', desc: 'Do something for the "hive" (clean a shared space, pick up litter, fix something at work) without mentioning it.', src: 'Marcus Aurelius 6.54' }
];

/* Citadel closing quotes (for moments of distress) */
const CITADEL_QUOTES = [
  ['Be like the promontory against which the waves continually break, but it stands firm and tames the fury of the water around it.', 'Marcus Aurelius 4.49'],
  ['If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.', 'Marcus Aurelius 8.47'],
  ['We suffer more often in imagination than in reality.', 'Seneca, Letter 13'],
  ['Men are disturbed not by things, but by the opinions about things.', 'Epictetus, Enchiridion 5'],
  ['The impediment to action advances action. What stands in the way becomes the way.', 'Marcus Aurelius 5.20'],
  ['Unhappy am I because this has happened to me? Not so, but happy am I, though this has happened, because I continue free from pain.', 'Marcus Aurelius 4.49'],
  ['Remember that it is not he who reviles you or strikes you who insults you, but your opinion that these things are insulting.', 'Epictetus, Enchiridion 20'],
  ['Do not disturb yourself by thinking of the whole of your life.', 'Marcus Aurelius 8.36']
];

const RANKS = [
  { xp: 0, name: 'Listener', greek: 'Akroatēs', icon: '👂' },
  { xp: 100, name: 'Student', greek: 'Mathētēs', icon: '📜' },
  { xp: 300, name: 'Practitioner', greek: 'Askētēs', icon: '🏺' },
  { xp: 700, name: 'Prokoptōn', greek: 'one making progress', icon: '🌿' },
  { xp: 1400, name: 'Philosopher', greek: 'Philosophos', icon: '🦉' },
  { xp: 2500, name: 'Teacher', greek: 'Didaskalos', icon: '🏛️' },
  { xp: 4000, name: 'Stoic', greek: 'Stōikos', icon: '⚖️' },
  { xp: 7000, name: 'Approaching the Sage', greek: 'Sophos (an ideal nobody fully reaches)', icon: '☀️' }
];
