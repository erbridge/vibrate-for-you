INCLUDE functions.ink

VAR player_online = 1

-> start


== start ==

Welcome...
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.
This is another line.

*   Hello, how are you? -> hello
*   Hi! -> hello
*   Hi there -> hello
*   WAIT(20) -> hello


== hello ==

~ player_online = 0

Hello world! :cherry_blossom::eggplant:{ wait(5) }{ typing(4) }{ wait(5) }

How are you today?

- (opts)
    <-  debug(-> opts)
    *   WAIT(10) Goodbye... -> DONE
    *   Hello back! -> DONE
    *   WAIT(20) -> there


== there ==

Are you there?

-> DONE


== debug(-> next) ==
# debug

player_online = {player_online}

+   { not player_online } [DEBUG set player_online = 1]
    ~ player_online = 1
+   { player_online } [DEBUG set player_online = 0]
    ~ player_online = 0
-   -> next
