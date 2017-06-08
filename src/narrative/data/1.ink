INCLUDE functions.ink

VAR checkin = 0
VAR countdown = 0
VAR enthusiasm = 0
VAR hesitate = 0
VAR turndown = 0

VAR guilty = ""
VAR mouth = ""
VAR thankyou = "thank you"

-> youve_matched


== youve_matched ==

+ hey -> startconvo
+ WAIT(20) -> startconvodelay


== startconvodelay ==

hey

~ hesitate += 1
~ countdown += 1

{ hesitate > 0:
    ~ guilty = "guilty as charged."
}

+ hey -> startconvo


== startconvo ==

{ hesitate > 0:
    NULL{ wait(5) }{ typing(3) }{ wait(2) }

    phew, i was worried i'd lost you. how are you?
}

{ hesitate <= 0:
    NULL{ wait(2) }

    hey, how are you?
}

+ { hesitate > 0 } haha, a little eager, aren't you? -> hesitate_response_1
+ hey! yeah, i'm good, how are you? -> enthusiastic_response_1
+ ugh, i'm up super late working on this project. you? -> hesitate_response_1
+ pretty exhausted, if i'm honest. -> turndown_response_1


== enthusiastic_response_1 ==

NULL{ wait(2) }{ typing(4) }{ wait(4) }

i'm pretty tired, if i'm honest.{ wait(3) }

you're up late!

~ enthusiasm += 1

+ you caught me! -> anchor_1


== hesitate_response_1 ==

NULL{ wait(2) }

{ guilty } i guess we're both up kind of late, aren't we?

~ hesitate += 1

+ yeah, i guess i don't normally stay up so late -> anchor_1
+ i like staying up late. it helps me work. -> anchor_1


== turndown_response_1 ==

oh geez, yeah, me too{ wait(4) }{ typing(2) }{ wait(7) }{ typing(3) }{ wait(1) }

but it's better to get whatever you're working on done, right?

~ turndown += 1

+ right -> anchor_1


== anchor_1

NULL{ wait(1) }{ typing(2) }{ wait(4) }

i'm just lookin out for you, i guess

+ oh yeah? -> anchor_2
+ haha -> anchor_2
+ uh, you definitely don't need to -> anchor_2


== anchor_2 ==

{ enthusiasm > 0: i mean, not that you need it }

{ enthusiasm <= 0 and hesitate > 0:
    NULL{ wait(3) }

    well, if you'll let me
}

{ enthusiasm <= 0 and hesitate <= 0 and turndown > 0:
    NULL{ wait(1) }{ typing(1) }{ wait(2) }{ typing(0.5) }{ wait(1) }{ typing(3) }{ wait(2) }

    haha sorry, i don't mean to say that you need looking after
}

+ { enthusiasm > 0 } what else are you looking out for? -> enthusiastic_forward
+ { enthusiasm > 0 } why's that? -> hesitate_forward
+ { enthusiasm <= 0 and hesitate > 0 } i'll let you. -> enthusiastic_forward_1
+ { enthusiasm <= 0 and hesitate > 0 } if i let you? -> hesitate_forward
+ { enthusiasm <= 0 and hesitate <= 0 and turndown > 0 } yeah, i don't -> end
+ { enthusiasm <= 0 and hesitate <= 0 and turndown > 0 } it's okay -> turndown_forward
+ { enthusiasm <= 0 and hesitate <= 0 and turndown <= 0 } i can let you look after me -> enthusiastic_delay
+ { enthusiasm <= 0 and hesitate <= 0 and turndown <= 0 } i mean, why are you up so late? -> turndown_forward
+ { enthusiasm <= 0 and hesitate <= 0 and turndown <= 0 } ... -> hesitate_forward


== enthusiastic_forward ==

NULL{ wait(1) }

a little bit of fun

~ enthusiasm += 1

+ me too -> enthusiastic_forward_1
+ i think we might have a different idea of fun -> hold_on


== enthusiastic_forward_1 ==

NULL{ wait(2) }

i was just thinking about your pictures. you've got a nice smile.

~ enthusiasm += 1
~ mouth = ""

+ smiling isn't the only thing my mouth can do -> forward
+ WAIT(10) -> check_in_1


== enthusiastic_forward_2 ==

try me.

+ well, it's more my mouth and my tongue -> enthusiastic_forward_3
+ WAIT(10) -> check_in_2


== enthusiastic_forward_3 ==

+ WAIT(3) -> enthusiastic_forward_4


== enthusiastic_forward_4 ==

+ at your neck, behind your ears -> enthusiastic_forward_5


== enthusiastic_forward_5 ==

+ fingernails raking down your back -> yes_god
+ is that something you're into? -> enthusiastic_check_in_1


== enthusiastic_check_in_1 ==

it is, it is

~ checkin += 1

+ good -> enthusiastic_check_in_2


== enthusiastic_check_in_2 ==

NULL{ wait(2) }{ typing(1) }{ wait(1) }

i wish you were here right now

+ hands at your hips, pulling at your jeans? -> yes_god
+ actually, hold on -> hold_on_2


== yes_god ==

yes{ wait(1) }

god

+ you're really hot, you know that? -> turned_on_1
+ if i were with you, would you want me to hurt you? -> bdsm_1
+ wait a second -> hold_on_2


== turned_on_1 ==

NULL{ wait(3) }

i can stand to hear it again

+ do you want me to keep talking to you like this -> turned_on_2


== turned_on_2 ==

NULL{ wait(1) }

i want a lot of things from you

+ tell me -> turned_on_3


== turned_on_3 ==

NULL{ typing(2) }{ wait(4) }{ typing(1) }{ wait(1) }

i want you, i want to hear you come, i want to feel you around me and inside me

+ i want you to come for me -> turned_on_4
+ woah -> hold_on


== turned_on_4 ==

NULL{ wait(6) }

i'm so close

+ yeah? -> turned_on_5


== turned_on_5 ==

NULL{ wait(10) }

can i come

+ please -> end_7


== bdsm_1 ==

NULL{ wait(12) }{ typing(2) }{ wait(4) }

maybe a little{ wait(5) }

yes, a lot actually

+ just pin your hands above your head, would you like that? -> bdsm_2


== bdsm_2 ==

NULL{ wait(2) }{ typing(1) }{ wait(1) }

would you pull my hair

+ i'd grab fist fulls of it to keep you still -> bdsm_4


== bdsm_4 ==

NULL{ wait(10) }{ typing(2) }{ wait(3) }

tell me i'm good

+ you're so good -> turned_on_4


== enthusiastic_response_2 ==

NULL{ wait(4) }

and your mouth?

-> enthusiastic_forward_4


== enthusiastic_delay ==

NULL{ typing(3) }{ wait(1) }{ typing(2) }{ wait(3) }

i guess i was just hoping we could have some fun

+ i'd like that -> enthusiastic_forward_1
+ actually, i think i'd rather not -> end


== hesitate_forward ==

+ WAIT(15) are you there? -> hesitate_forward_2
+ WAIT(30) -> end_1


== hesitate_forward_2 ==

NULL{ wait(15) }

it's raining outside.

+ oh, it's raining here, too -> raining
+ uh -> uh


== raining ==

NULL{ wait(3) }

we are, according to finder, like a mile apart

+ did you see the thunder -> thunder


== thunder ==

you mean hear

+ that too -> thunder_2


== thunder_2 ==

NULL{ wait(1) }

from the humidity, i'd guess

+ it was so hot today. i made iced tea -> weather


== uh ==

NULL{ wait(5) }{ typing(1) }{ wait(1) }

just an observation

+ i see -> i_see


== i_see ==

NULL{ wait(7) }

anyway

+ right. -> end_3


== turndown_forward ==

NULL{ wait(2) }

what are you working on?

+ just this project i said i'd get done by a crazy deadline -> turndown_forward_1


== turndown_forward_1 ==

NULL{ wait(2) }{ typing(2) }{ wait(1) }

are you getting distracted, working so late?

+ you're distracting -> enthusiastic_delay
+ not really -> turndown_end


== turndown_end ==

NULL{ wait(6) }

oh

+ yeah. anyway. -> end


== forward ==

NULL{ typing(1) }{ wait(1) }

{ mouth } what else can your mouth do?

+ uh -> hesitate_forward
+ ... -> dotdotdot
+ you might be surprised -> enthusiastic_forward_2
+ WAIT(10) -> check_in_1


== dotdotdot ==

NULL{ wait(6) }

would you pin me down

+ knees either side of you -> enthusiastic_response_2
+ no, i'd let you take the lead -> take_the_lead_1


== take_the_lead_1 ==

NULL{ wait(4) }{ typing(2) }{ wait(1) }

i'd be gentle with you

+ yeah? -> take_the_lead_2


== take_the_lead_2 ==

NULL{ wait(2) }

kiss you at the hollow beneath your ear,

+ go on -> go_on


== go_on ==

NULL{ wait(5) }

down your neck to your collarbone, the hollow of your throat{ wait(3) }

i'd leave a trail with my tongue

+ yeah -> yeah


== yeah ==

NULL{ wait(4) }

i'd want to hear you moan, to make you come in my hands, against me, shuddering

+ yes, yeah yes -> yeah_2
+ uh wait a second -> hold_on_2


== yeah_2 ==

NULL{ wait(5) }{ typing(2) }{ wait(2) }

do you want that? do you want to come with me

+ please -> please


== please ==

NULL{ wait(10) }

thank you

+ thank you -> DONE
+ WAIT(10) -> end_7


== check_in_1 ==

{ hey, are you still there? | hey just checking in | are you alright? }

{ checkin > 0:
    ~ mouth = "i think you left me wondering,"
}

+ hey, yeah, sorry, i'm here -> im_here


== check_in_2 ==

{ is this too much? | yeah? | do you want to talk about something else? }

+ no, i'm fine, you're just distracting me -> take_the_lead_1
+ actually, can you give me a sec? -> hold_on


== im_here ==

NULL{ wait(1) }

{ enthusiasm > 1: just wanted to make sure }
{ enthusiasm <= 1 and hesitate > 2: just wanted to make sure. we can stop if you want? }
{ enthusiasm <= 1 and hesitate <= 2: are you sure? }

~ checkin += 1
~ hesitate += 1
~ countdown += 1

+ { enthusiasm > 1 } what were we talking about? -> forward
+ { enthusiasm > 1 } actually, can you hold on a sec? -> hold_on
+ { enthusiasm <= 1 and hesitate > 2 } no no, i'm okay -> hesitate_forward
+ { enthusiasm <= 1 and hesitate > 2 } no no, i just don't really know who you are is all -> hold_on
+ { enthusiasm <= 1 and hesitate <= 2 and turndown > 1 } really, i'm fine -> hesitate_forward
+ { enthusiasm <= 1 and hesitate <= 2 and turndown > 1 } actually, i'm not really feeling it -> hold_on
+ { enthusiasm <= 1 and hesitate <= 2 and turndown <= 1 } i can let you look after me -> enthusiastic_delay
+ { enthusiasm <= 1 and hesitate <= 2 and turndown <= 1 } i mean, why are you up so late? -> turndown_forward
+ { enthusiasm <= 1 and hesitate <= 2 and turndown <= 1 } ... -> hesitate_forward


== hold_on ==

NULL{ wait(2) }{ typing(1) }{ wait(3) }{ typing(2) }{ wait(1) }

i don't mean to be forward{ wait(4) }{ typing(1) }{ wait(3) }

you're right, it's a bit much

~ enthusiasm -= 1
~ turndown += 1

+ tell me something about you -> learn
+ yeah, i don't think i'm into this right now -> end


== hold_on_2 ==

NULL{ wait(2) }

whatever you need

+ you -> hold_on_2a
+ can we slow down for a second -> hold_on


== hold_on_2a ==

NULL{ wait(5) }

do you want me

+ i want you to come for me -> turned_on_3


== learn ==

NULL{ wait(10) }{ typing(2) }{ wait(4) }

it's raining outside. i like it when it rains.{ wait(1) }

the sound makes the whole house feel smaller.

+ i meant something about you -> learn_2
+ it's so hot outside. i made iced tea earlier. -> weather


== learn_2 ==

NULL{ wait(4) }{ typing(3) }{ wait(1) }

i'm five foot nine. i've got a cat. his name is thomas.

+ you gave your cat a person's name? -> learn_3


== learn_3 ==

well it's a cat's name when he has it.

+ a good point. -> learn_4
+ WAIT(10) -> check_in_1


== learn_4 ==

NULL{ wait(10) }

i'd send you a picture, but i don't know where he's gone

+ a different kind of pussy pic -> pussy_pic


== pussy_pic ==

haha{ wait(3) }

crass

+ i mean, we're chatting on finder -> learn_6
+ were you expecting something a bit more demure? -> learn_6
+ WAIT(10) -> check_in_2


== learn_6 ==

NULL{ wait(3) }

i don't know what i was expecting

+ me neither -> me_neither
+ i mean, i was expecting something... else -> expecting_something


== me_neither ==

NULL{ wait(6) }

well{ wait(5) }

anyway

+ yeah -> end_3
+ do you want to meet up in person sometime? -> meet_up


== meet_up ==

NULL{ wait(6) }

oh

+ i mean, we don't have to -> end_4
+ i just thought it would be nice. i like talking to you -> might_be_nice


== might_be_nice ==

NULL{ wait(2) }

yeah{ wait(4) }

no

i think it would be nice, too

+ what are you doing tomorrow? we could grab a coffee in city centre -> coffee


== coffee ==

i'd really like that{ wait(3) }

we could meet at the corner of regent and royal

+ if you don't look like an axe murderer, i'll be there at 3 -> learn_7


== learn_7 ==

it's a date.

+ see you then -> DONE


== expecting_something ==

NULL{ wait(1) }

sorry to disappoint

-> end_3


== weather ==

NULL{ wait(2) }

what kind of tea?

+ green tea. with peppermint. -> weather_2


== weather_2 ==

that sounds nice.{ wait(5) }{ typing(1) }{ wait(2) }

do you have any more now?

+ on my bedside table. -> bedside_table


== bedside_table ==

NULL{ wait(2) }

is that within reach?

+ yeah, it is -> bedside_table_2


== bedside_table_2 ==

maybe you should have some.

+ WAIT(10) -> cold_wet_1


== cold_wet_1 ==

any good?

+ cold. wet. -> cold_wet


== cold_wet ==

and you?

+ warm. hot. -> warm_hot
+ not feeling this -> end_2


== warm_hot ==

NULL{ wait(4) }

are you in bed?

+ yes -> yes


== yes ==

NULL{ wait(5) }{ typing(1) }{ wait(1) }{ typing(2) }{ wait(2) }

have you thought about touching yourself

+ yes. i mean. i am. -> touching_self
+ no, it's not really been... -> touching_self_reject


== touching_self ==

NULL{ wait(1) }

are you still warm and hot{ wait(3) }

can you imagine my mouth on yours

+ can you imagine my hands on you -> yes_weather_2
+ can you imagine my hands on your body -> yes_weather_2
+ can you imagine my mouth wet with you -> yes_weather_2
+ WAIT(7) -> yes_weather


== touching_self_reject ==

NULL{ wait(2) }

it's okay - i get it{ wait(3) }{ typing(1) }{ wait(1) }

sorry for pushing

we don't have to talk anymore

+ yeah, maybe it's best if we don't -> end_2
+ i mean, maybe you could just tell me more about... you? -> learn_2


== yes_weather ==

can you imagine my mouth on you

+ can you imagine my hands on you -> i_want_that
+ can you imagine my hands on your body -> i_want_that
+ can you imagine my mouth wet with you -> i_want_that
+ i want that -> i_want_that


== yes_weather_2 ==

NULL{ wait(4) }

can you imagine my mouth on you

+ i want that -> i_want_that


== i_want_that ==

NULL{ wait(2) }

i know

+ i want this -> turned_on_2


== end ==

NULL{ wait(6) }

okay, well, maybe we could talk some other time

-> DONE


== end_1 ==

+ are you there? -> hesitate_forward_2
+ okay, well, nice talking to you -> DONE


== end_2 ==

NULL{ wait(3) }{ typing(1) }{ wait(1) }

oh! okay. sorry if i made you feel uncomfortable. we don't have to keep talking

+ yeah, i'm just not really into it -> DONE


== end_3 ==

NULL{ wait(4) }

thanks for the chat

xx

-> DONE


== end_4 ==

NULL{ wait(5) }{ typing(3) }{ wait(1) }

yeah, i don't know, i was kind of looking for a casual thing

+ oh, that's fine -> end_6


== end_6 ==

NULL{ wait(1) }

but thank you for talking with me

-> DONE


== end_7 ==

thank you

{ enthusiasm > 2:
    ~ thankyou = "thank you for being so direct with me"
}

{ hesitate > 2:
    ~ thankyou = "thank you for taking time to think about this"
}

{ turndown > 1:
    ~ thankyou = "thank you for taking a chance on me"
}

{ countdown > 1:
    ~ thankyou = "thank you for taking your time with me"
}

+ WAIT(10) -> end_8


== end_8 ==

{ thankyou }

let's chat again soon

-> DONE
